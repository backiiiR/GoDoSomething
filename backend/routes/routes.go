package routes

import (
	"backend/controllers"
	"github.com/gorilla/mux"
)

func InitRoutes() *mux.Router {
	r := mux.NewRouter()

	// List routes
	r.HandleFunc("/lists", controllers.GetLists).Methods("GET")
	r.HandleFunc("/lists", controllers.CreateList).Methods("POST")
	r.HandleFunc("/lists/{id}", controllers.UpdateList).Methods("PUT")
	r.HandleFunc("/lists/{id}", controllers.DeleteList).Methods("DELETE")

	// Todo routes
	r.HandleFunc("/lists/{lid}/todos", controllers.GetTodosByList).Methods("GET")
	r.HandleFunc("/lists/{lid}/todos", controllers.CreateTodoForList).Methods("POST")
	r.HandleFunc("/lists/{lid}/todos/{id}", controllers.UpdateTodoForList).Methods("PUT")
	r.HandleFunc("/lists/{lid}/todos/{id}", controllers.DeleteTodoForList).Methods("DELETE")

	return r
}
