import React, {useCallback, useEffect, useState} from "react";
import {createTodo, deleteTodo, fetchTodos, updateTodo} from "../api/todoApi";
import {Todo} from "../types/Todo";
import {useParams} from "react-router-dom";
import TodoItem from "../components/TodoItem";
import TodoFormModal from "../components/TodoFormModal.tsx";
import {fetchList} from "../api/listApi.ts";
import {List} from "../types/List.ts";

const ListPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [list, setList] = useState<List | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

    const loadTodos = useCallback(async () => {
        try {
            const todos = await fetchTodos(Number(id));
            setTodos(todos);
        } catch (error) {
            console.error(error);
        }
    }, [id]);

    const loadList = useCallback(async () => {
        try {
            const list = await fetchList(Number(id));
            setList(list);
        } catch (error) {
            console.error(error);
        }
    }, [id]);

    const handleCreateTodo = async (todo: Omit<Todo, 'id'>) => {
        try {
            const newTodo = await createTodo(todo);
            setTodos(prevTodos =>
                [...prevTodos, newTodo].sort((a, b) =>
                    new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
                )
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsModalOpen(false);
        }
    };

    const handleUpdateTodo = async (todo: Omit<Todo, 'id'>) => {
        if (!editingTodo) return;

        const id = editingTodo.id;

        try {
            const updatedTodo = await updateTodo({
                ...todo,
                id,
            });
            setTodos(prevTodos =>
                prevTodos
                    .map((t) => (t.id === id ? updatedTodo : t))
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
            );
        } catch (error) {
            console.error(error);
        } finally {
            setEditingTodo(null);
        }
    };

    const handleDelete = async (id: number) => {
        const todo = todos.find((todo) => todo.id === id);

        if (todo === undefined) {
            console.error('Todo not found');
            return;
        }

        try {
            await deleteTodo(todo);
            setTodos(todos.filter((t) => t.id !== todo.id));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (id) {
            loadTodos().then(r => r);
            loadList().then(r => r);
        }
    }, [id, loadList, loadTodos]);

    return (
        <div className="w-full md:w-2/3 lg:w-3/4">
            <button
                onClick={() => history.back()}
                className=" mb-2 p-2 bg-blue-200 text-white rounded-lg hover:bg-blue-600"
            >🔙</button>
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">List: {list?.name ?? 'not found'}</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Add Todo
                    </button>
                </div>
                <div className="space-y-3">
                    {todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onEdit={() => {
                                setEditingTodo(todo);
                                setIsModalOpen(true);
                            }}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>

            <TodoFormModal
                open={isModalOpen || !!editingTodo}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTodo(null);
                }}
                listId={Number(id)}
                onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
                initialTodo={editingTodo ?? undefined}
            />
        </div>
    );
};

export default ListPage;
