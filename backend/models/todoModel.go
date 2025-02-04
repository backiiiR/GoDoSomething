package models

import (
	"backend/db"
	"database/sql"
	"log"
	"time"
)

type Todo struct {
	ID             int       `json:"id"`
	Title          string    `json:"title"`
	AdditionalInfo string    `json:"additional_info"`
	DueDate        time.Time `json:"due_date"`
	Completed      bool      `json:"completed"`
	ListID         int       `json:"list_id"`
}

func AllTodosByList(listID int) ([]Todo, error) {
	rows, err := db.DB.Query("SELECT * FROM todos WHERE list_id = ?", listID)

	if err != nil {
		return nil, err
	}

	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	todos := make([]Todo, 0)
	for rows.Next() {
		var t Todo
		var dueDate sql.NullString
		if err := rows.Scan(&t.ID, &t.Title, &t.AdditionalInfo, &dueDate, &t.Completed, &t.ListID); err == nil {
			if dueDate.Valid {
				t.DueDate, err = time.Parse("2006-01-02", dueDate.String)
				if err != nil {
					log.Println(err)
					continue
				}
			} else {
				t.DueDate = time.Time{}
			}
		} else {
			log.Println(err)
			continue
		}
		todos = append(todos, t)
	}

	return todos, nil
}

func CreateTodo(todo Todo, listID int) (int64, error) {
	if todo.DueDate.IsZero() {
		res, err := db.DB.Exec(
			"INSERT INTO todos (title, additional_info, due_date, completed, list_id) VALUES (?, ?, NULL, ?, ?)",
			todo.Title, todo.AdditionalInfo, todo.Completed, listID)
		if err != nil {
			return 0, err
		}

		id, err := res.LastInsertId()
		if err != nil {
			return 0, err
		}

		return id, nil
	}

	res, err := db.DB.Exec(
		"INSERT INTO todos (title, additional_info, due_date, completed, list_id) VALUES (?, ?, ?, ?, ?)",
		todo.Title, todo.AdditionalInfo, todo.DueDate, todo.Completed, listID)
	if err != nil {
		return 0, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, nil
}

func UpdateTodo(todo Todo, listID int) error {
	if todo.DueDate.IsZero() {
		_, err := db.DB.Exec(
			"INSERT INTO todos (title, additional_info, due_date, completed, list_id) VALUES (?, ?, NULL, ?, ?)",
			todo.Title, todo.AdditionalInfo, todo.Completed, listID)
		if err != nil {
			return err
		}

		return nil
	}

	_, err := db.DB.Exec(
		"UPDATE todos SET title = ?, additional_info = ?, due_date = ?, completed = ? WHERE id = ? AND list_id = ?",
		todo.Title, todo.AdditionalInfo, todo.DueDate, todo.Completed, todo.ID, listID)
	if err != nil {
		return err
	}

	return nil
}

func DeleteTodo(id int, listID int) error {
	/*_, err := db.DB.Exec("DELETE FROM todos WHERE id = ?", id)
	if err != nil {
		return err
	}

	return nil*/

	_, err := db.DB.Exec("DELETE FROM todos WHERE id = ? AND list_id = ?", id, listID)
	if err != nil {
		return err
	}

	return nil
}
