package controllers

import (
	"backend/models"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

func GetLists(w http.ResponseWriter, r *http.Request) {
	lists, err := models.GetAllLists()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(lists)
}

func CreateList(w http.ResponseWriter, r *http.Request) {
	var list models.List
	if err := json.NewDecoder(r.Body).Decode(&list); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id, err := models.CreateList(list.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	list.ID = int(id)
}

func UpdateList(w http.ResponseWriter, r *http.Request) {
	/*var list models.List
	if err := json.NewDecoder(r.Body).Decode(&list); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := models.UpdateList(list); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)*/

	// Get the list ID from the URL and then update the list
	params := mux.Vars(r)
	id := params["id"]
	if id == "" {
		http.Error(w, "Missing list ID", http.StatusBadRequest)
		return
	}

	var list models.List
	if err := json.NewDecoder(r.Body).Decode(&list); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	list.ID, _ = strconv.Atoi(id)

	if err := models.UpdateList(list); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteList(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	if id == "" {
		http.Error(w, "Missing list ID", http.StatusBadRequest)
		return
	}

	idInt, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := models.DeleteList(idInt); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
