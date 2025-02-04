import {Todo} from "../types/Todo.ts";

const BASE_URL = "http://localhost:8080";

export async function fetchTodos(listId: number): Promise<Todo[]> {
    const response = await fetch(`${BASE_URL}/lists/${listId}/todos`);
    if (!response.ok) throw new Error("Failed to fetch todos");
    return response.json();
}

export async function createTodo(todo: Omit<Todo, "id">): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/lists/${todo.listId}/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error("Failed to create todo");
    return response.json();
}

export async function updateTodo(todo: Todo): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/lists/${todo.listId}/todos/${todo.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error("Failed to update todo");
    return response.json();
}

export async function deleteTodo(todo: Todo): Promise<void> {
    const response = await fetch(`${BASE_URL}/lists/${todo.listId}/todos/${todo.id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete todo");
    //return response.json();
}