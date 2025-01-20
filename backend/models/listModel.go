package models

import (
	"backend/db"
	"database/sql"
	"log"
)

type List struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func GetAllLists() ([]List, error) {
	rows, err := db.DB.Query("SELECT * FROM lists")

	if err != nil {
		return nil, err
	}

	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	lists := make([]List, 0)
	for rows.Next() {
		var l List
		if err := rows.Scan(&l.ID, &l.Name); err != nil {
			log.Println(err)
			continue
		}
		lists = append(lists, l)
	}

	return lists, nil
}

func CreateList(name string) (int64, error) {
	res, err := db.DB.Exec("INSERT INTO lists (name) VALUES (?)", name)
	if err != nil {
		return 0, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, nil
}

func UpdateList(list List) error {
	_, err := db.DB.Exec("UPDATE lists SET name = ? WHERE id = ?", list.Name, list.ID)
	if err != nil {
		return err
	}

	return nil
}

func DeleteList(id int) error {
	_, err := db.DB.Exec("DELETE FROM lists WHERE id = ?", id)
	if err != nil {
		return err
	}

	return nil
}
