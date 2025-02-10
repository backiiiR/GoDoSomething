import React, {useEffect, useState} from "react";
import {createList, deleteList, fetchLists, updateList} from "../api/listApi";
import {List} from "../types/List";
import ListItem from "../components/ListItem.tsx";
import ListFormModal from "../components/ListFormModal.tsx";

const Home: React.FC = () => {
    const [lists, setLists] = useState<List[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingList, setEditingList] = useState<List | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCreateList = async (name: string) => {
        try {
            setIsProcessing(true);
            const newList = await createList(name);
            setLists([...lists, newList]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
            setIsModalOpen(false);
        }
    };

    const handleUpdateList = async (name: string) => {
        if (!editingList) return;

        const id = editingList.id;

        try {
            setIsProcessing(true);
            const updatedList = await updateList(id, name);
            setLists(lists.map((list) => (list.id === id ? updatedList : list)));
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
            setEditingList(null);
        }
    };

    const handleDeleteList = async (id: number) => {
        try {
            setIsProcessing(true);
            await deleteList(id);
            setLists(lists.filter((list) => list.id !== id));
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchLists()])
            .then((r) => {
                setLists(r[0]);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
                console.error("Failed to fetch lists");
            })
    }, []);

    return (
        <>
            <div className="w-full md:w-2/3 lg:w-2/4">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Your Lists</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'New List'}
                        </button>
                    </div>
                    <div className="space-y-2">
                        {isLoading ? (
                            <div className="text-center text-gray-500">Loading...</div>
                        ) : (
                            <>
                                {lists.map((list) => (
                                    <ListItem
                                        key={list.id}
                                        list={list}
                                        onEdit={() => {
                                            setEditingList(list);
                                            setIsModalOpen(true);
                                        }}
                                        onDelete={handleDeleteList}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <ListFormModal
                open={isModalOpen || !!editingList}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingList(null)
                }}
                onSubmit={editingList ? handleUpdateList : handleCreateList}
                initialName={editingList?.name}
            />
        </>
    );
};

export default Home;
