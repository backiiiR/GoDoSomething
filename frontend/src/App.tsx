import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import ListPage from "./pages/ListPage";
import Layout from "./components/Layout.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/lists/:id" element={<ListPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
