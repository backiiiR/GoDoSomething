import React from "react";

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center space-x-4">
                <img src="/logo.svg" className="h-8 w-8" alt="Logo" />
                <h1 className="text-2xl font-bold text-gray-900">GoDoSomething</h1>
            </div>
        </header>
    );
};

export default Header;