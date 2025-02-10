import {List} from "../types/List.ts";

const BASE_URL = "http://localhost:8080";

export async function fetchLists(): Promise<List[]> {
    const response = await fetch(`${BASE_URL}/lists`);
    if (!response.ok) throw new Error("Failed to fetch lists");
    return response.json();
}

export async function fetchList(id: number): Promise<List> {
    const response = await fetch(`${BASE_URL}/lists/${id}`);
    if (!response.ok) throw new Error("Failed to fetch list with id: " + id);
    return response.json();
}

export async function createList(name: string): Promise<List> {
    const response = await fetch(`${BASE_URL}/lists`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name}),
    });
    if (!response.ok) throw new Error("Failed to create list");
    return response.json();
}

export async function updateList(id: number, name: string): Promise<List> {
    const response = await fetch(`${BASE_URL}/lists/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name}),
    });
    if (!response.ok) throw new Error("Failed to update list");
    return response.json();
}

export async function deleteList(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/lists/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete list");
    //return response.json();
}

