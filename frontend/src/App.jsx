import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import KanbanBoard from "./pages/KanbanBoard";

export default function App() {
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <KanbanBoard />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}
