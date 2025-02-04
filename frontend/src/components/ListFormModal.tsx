import {Dialog, DialogPanel, DialogTitle} from '@headlessui/react';
import React, {useEffect, useState} from 'react';
import DOMPurify from 'dompurify';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
    initialName?: string;
}

const ListFormModal: React.FC<Props> = ({ open, onClose, onSubmit, initialName = '' }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setName(initialName);
        setError('');
    }, [initialName]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        if (input.length > 100) {
            setError('List name must be less than 100 characters');
        } else if (input.length === 0) {
            setError('List name is required');
        } else {
            setError('');
        }

        setName(input);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (name.length > 100 || name.length === 0) return;

        const sanitizedInput = DOMPurify.sanitize(name);

        onSubmit(sanitizedInput);
        setName('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md bg-white rounded-lg p-6">
                    <DialogTitle className="text-lg font-bold mb-4">
                        {initialName ? 'Edit List' : 'Create List'}
                    </DialogTitle>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">List Name*</label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                                maxLength={100}
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    setName(initialName);
                                    setError('');
                                }}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 text-white rounded-lg ${error || !name.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                disabled={!!error || !name.trim()}
                            >
                                {initialName ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default ListFormModal;