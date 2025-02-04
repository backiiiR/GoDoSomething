package controllers

import (
	"backend/models"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

func GetTodosByList(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	listID, _ := strconv.Atoi(params["lid"])

	todos, err := models.AllTodosByList(listID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(todos)
	w.WriteHeader(http.StatusOK)
}

func CreateTodoForList(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	listID, _ := strconv.Atoi(params["lid"])

	var todo models.Todo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// todo.ListID = listID
	id, err := models.CreateTodo(todo, listID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	todo.ID = int(id)
	json.NewEncoder(w).Encode(todo)
	w.WriteHeader(http.StatusCreated)
}

func UpdateTodoForList(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	listID, _ := strconv.Atoi(params["lid"])

	//id := r.URL.Query().Get("id")
	id := params["id"]

	if id == "" {
		http.Error(w, "Missing todo ID", http.StatusBadRequest)
		return
	}

	var todo models.Todo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := models.UpdateTodo(todo, listID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(todo)
	w.WriteHeader(http.StatusOK)
}

func DeleteTodoForList(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	listID, _ := strconv.Atoi(params["lid"])
	id := params["id"]

	if id == "" {
		http.Error(w, "Missing todo ID", http.StatusBadRequest)
		return
	}

	idInt, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := models.DeleteTodo(idInt, listID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
