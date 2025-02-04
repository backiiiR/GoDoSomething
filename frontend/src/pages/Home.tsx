import React, {useEffect, useState} from "react";
import {createList, deleteList, fetchLists, updateList} from "../api/listApi";
import {List} from "../types/List";
import ListItem from "../components/ListItem.tsx";
import ListFormModal from "../components/ListFormModal.tsx";

const Home: React.FC = () => {
    const [lists, setLists] = useState<List[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingList, setEditingList] = useState<List | null>(null);

    const handleCreateList = async (name: string) => {
        try {
            const newList = await createList(name);
            setLists([...lists, newList]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsModalOpen(false);
        }
    };

    const handleUpdateList = async (name: string) => {
        if (!editingList) return;

        const id = editingList.id;

        try {
            const updatedList = await updateList(id, name);
            setLists(lists.map((list) => (list.id === id ? updatedList : list)));
        } catch (error) {
            console.error(error);
        } finally {
            setEditingList(null);
        }
    };

    const handleDeleteList = async (id: number) => {
        try {
            await deleteList(id);
            setLists(lists.filter((list) => list.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLists()
            .then(setLists)
            .catch(console.error);
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
                        >
                            New List
                        </button>
                    </div>
                    <div className="space-y-2">
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
