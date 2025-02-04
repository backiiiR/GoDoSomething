import React, {useState} from "react";
import { List } from "../types/List";
import { Link } from "react-router-dom";

interface ListProps {
    list: List;
    onEdit: () => void;
    onDelete: (id: number) => void;
}

const ListItem: React.FC<ListProps> = ({ list, onEdit, onDelete }) => {
    const [isTouched, setIsTouched] = useState(false);

    return (
        <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer group relative"
            onTouchStart={() => setIsTouched(!isTouched)}
             onTouchEnd={() => setIsTouched(!isTouched)}
             onClick={(e) => {
                 if ((e.target as HTMLElement).closest('button')) {
                     e.preventDefault()
                 }
             }}
        >
            <Link
                to={`/lists/${list.id}`}
                className="truncate flex-1 hover:text-blue-600"
            >
                {list.name}
            </Link>
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
                    className="text-gray-400 hover:text-blue-500 p-1"
                >
                    ✏️
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete(list.id);
                    }}
                    className="text-gray-400 hover:text-red-500 p-1"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default ListItem;
