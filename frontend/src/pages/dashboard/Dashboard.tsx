import { useAuth } from "../../hooks/useAuth";  
export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.name}!</p>
            <button onClick={logout}>Logout</button>
        </div>
    )
}