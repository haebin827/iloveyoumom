import './App.css'
import React from "react";
import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MainPage from "./pages/MainPage.jsx";
import Error404 from "./pages/Error404.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path={'/'} element={<HomePage/>} />
                <Route path={'/main'} element={
                    <ProtectedRoute>
                        <MainPage/>
                    </ProtectedRoute>
                } />
                <Route path={'/404'} element={<Error404/>} />
                <Route path={'*'} element={<Error404/>} />
            </Routes>
        </AuthProvider>
    )
}

export default App;