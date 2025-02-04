import { Outlet } from "react-router-dom";
import Header from "./Header";
import React from "react";

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-6 py-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;