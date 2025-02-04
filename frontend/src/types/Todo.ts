export interface Todo {
    id: number;
    title: string;
    additional_info: string;
    due_date: string; // ISO string format
    completed: boolean;
    listId: number;
}