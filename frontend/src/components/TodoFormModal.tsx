import {Dialog, DialogPanel, DialogTitle} from '@headlessui/react';
import React, {useEffect, useState} from 'react';
import {Todo} from '../types/Todo';
import DOMPurify from "dompurify";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (todo: Omit<Todo, 'id'>) => void;
    listId: number;
    initialTodo?: Omit<Todo, 'id'>;
}

const TodoFormModal: React.FC<Props> = ({open, onClose, onSubmit, listId, initialTodo}) => {
    const [title, setTitle] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [completed, setCompleted] = useState(false);
    const [errors, setErrors] = useState<{ title?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (title.length === 0 || title.length > 255) return;

        const sanitizedTitle = DOMPurify.sanitize(title);
        const sanitizedAdditionalInfo = DOMPurify.sanitize(additionalInfo);

        onSubmit({
            title: sanitizedTitle,
            additional_info: sanitizedAdditionalInfo,
            due_date: dueDate ? new Date(dueDate).toISOString() : '',
            completed,
            listId
        });
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setAdditionalInfo('');
        setDueDate('');
        setCompleted(false);
        onClose();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        if (input.length > 255) {
            setErrors({title: 'Title must be less than 255 characters'});
        } else if (input.length === 0) {
            setErrors({title: 'Title is required'});
        } else {
            setErrors({});
        }

        setTitle(input);
    };

    useEffect(() => {
        if (initialTodo) {
            setTitle(initialTodo.title);
            setAdditionalInfo(initialTodo.additional_info || '');
            setDueDate(new Date(initialTodo.due_date).toISOString().split('T')[0]);
            setCompleted(initialTodo.completed);
        }
        setErrors({});
    }, [initialTodo]);

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md bg-white rounded-lg p-6">
                    <DialogTitle className="text-lg font-bold mb-4">
                        {initialTodo ? 'Edit Todo' : 'Create Todo'}
                    </DialogTitle>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title*</label>
                            <input
                                required
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                className="w-full p-2 border rounded-lg"
                                maxLength={255}
                            />
                            {errors?.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={completed}
                                onChange={(e) => setCompleted(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <label className="text-sm font-medium">Completed</label>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 text-white rounded-lg ${errors.title || !title.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500   hover:bg-green-600'}`}
                                disabled={!!errors.title || !title.trim()}
                            >
                                {initialTodo ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default TodoFormModal;