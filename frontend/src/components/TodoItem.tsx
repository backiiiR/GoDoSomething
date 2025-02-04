import React, {useState} from "react";
import {Todo} from "../types/Todo";

interface TodoProps {
    todo: Todo;
    onEdit: () => void;
    onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoProps> = ({todo, onEdit, onDelete}) => {
    const [isTouched, setIsTouched] = useState(false);

    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow relative group"
             onTouchStart={() => setIsTouched(!isTouched)}
             onTouchEnd={() => setIsTouched(!isTouched)}
             onClick={(e) => {
                 if ((e.target as HTMLElement).closest('button')) {
                     e.preventDefault()
                 }
             }}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => {}}
                        className="w-4 h-4 mt-1"
                    />
                    <div className="flex-1">
                        <h3 className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'font-medium'}`}>
                            {todo.title}
                        </h3>
                        {todo.additional_info && (
                            <p className="text-gray-600 text-sm mt-1">{todo.additional_info}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">

                            <span>📅 {todo.due_date !== "0001-01-01T00:00:00Z" ? new Date(todo.due_date).toLocaleDateString() : ''}</span>
                        </div>
                    </div>
                    <div className={`flex gap-2 ${
                        isTouched
                            ? 'opacity-100' // Mobile: show when touched
                            : 'opacity-100 md:opacity-0 md:group-hover:opacity-100' // Desktop: hide until hover
                    } transition-opacity duration-200`}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onEdit();
                            }}
                            className="text-gray-400 hover:text-blue-500">✏️</button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete(todo.id);
                            }}
                            className="text-gray-400 hover:text-red-500"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoItem;
