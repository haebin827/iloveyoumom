import './App.css'
import './assets/styles/Toast.css'
import React from "react";
import {Route, Routes} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import HomePage from "./pages/HomePage.jsx";
import MainPage from "./pages/MainPage.jsx";
import Error404 from "./pages/errors/Error404.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AuthCallback from "./routes/AuthCallback.jsx";
import PasswordResetCallback from "./routes/PasswordResetCallback.jsx";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import Footer from "./components/layout/Footer.jsx";

function App() {
    return (
        <AuthProvider>
            <Toaster
                position="top-right"
                gutter={12}
                toastOptions={{
                    duration: 3000,
                    className: 'custom-toast',
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#ffffff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#ffffff',
                        },
                    },
                }}
                containerClassName="toast-container"
            />
            <Routes>
                <Route path={'/'} element={<HomePage/>} />
                <Route path={'/register'} element={<RegisterPage/>} />
                <Route path={'/auth/callback'} element={<AuthCallback/>} />
                <Route path={'/password-reset/callback'} element={<PasswordResetCallback/>} />
                <Route path={'/main'} element={
                    <ProtectedRoute>
                        <div className="app-container">
                            <main className="main-content">
                                <MainPage/>
                            </main>
                            <Footer />
                        </div>
                    </ProtectedRoute>
                } />
                <Route path={'/404'} element={
                    <div className="app-container">
                        <main className="main-content">
                            <Error404/>
                        </main>
                        <Footer />
                    </div>
                } />
                <Route path={'*'} element={
                    <div className="app-container">
                        <main className="main-content">
                            <Error404/>
                        </main>
                        <Footer />
                    </div>
                } />
            </Routes>
        </AuthProvider>
    )
}

export default App;