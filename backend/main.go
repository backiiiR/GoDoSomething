package main

import (
	"backend/db"
	"backend/middleware"
	"backend/routes"
	"log"
	"net/http"
)

func main() {
	// Initialize the database
	db.InitDB()

	// Set up the routes
	r := routes.InitRoutes()

	// Add the CORS middleware
	handler := middleware.EnableCors(r)

	// Start the server
	log.Fatal(http.ListenAndServe(":8080", handler))
}
