package controllers

import (
	"backend/models"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
	"time"
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

	var rawTodo struct {
		Title          string `json:"title"`
		AdditionalInfo string `json:"additional_info"`
		DueDate        string `json:"due_date"` // Accepts string from JSON
		Completed      bool   `json:"completed"`
	}

	if err := json.NewDecoder(r.Body).Decode(&rawTodo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var parsedDate time.Time
	if rawTodo.DueDate != "" {
		var err error
		parsedDate, err = time.Parse(time.RFC3339, rawTodo.DueDate)
		if err != nil {
			http.Error(w, "Invalid date format. Use RFC3339 (e.g. 2023-12-31T12:00:00Z)", http.StatusBadRequest)
			return
		}
	}

	todo := models.Todo{
		Title:          rawTodo.Title,
		AdditionalInfo: rawTodo.AdditionalInfo,
		DueDate:        parsedDate,
		Completed:      rawTodo.Completed,
		ListID:         listID,
	}

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
	id := params["id"]

	if id == "" {
		http.Error(w, "Missing todo ID", http.StatusBadRequest)
		return
	}

	idInt, _ := strconv.Atoi(id)

	var rawTodo struct {
		Title          string `json:"title"`
		AdditionalInfo string `json:"additional_info"`
		DueDate        string `json:"due_date"` // Accepts string from JSON
		Completed      bool   `json:"completed"`
	}

	if err := json.NewDecoder(r.Body).Decode(&rawTodo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var parsedDate time.Time
	if rawTodo.DueDate != "" {
		var err error
		parsedDate, err = time.Parse(time.RFC3339, rawTodo.DueDate)
		if err != nil {
			http.Error(w, "Invalid date format. Use RFC3339 (e.g. 2023-12-31T12:00:00Z)", http.StatusBadRequest)
			return
		}
	}

	todo := models.Todo{
		ID:             idInt,
		Title:          rawTodo.Title,
		AdditionalInfo: rawTodo.AdditionalInfo,
		DueDate:        parsedDate,
		Completed:      rawTodo.Completed,
		ListID:         listID,
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
