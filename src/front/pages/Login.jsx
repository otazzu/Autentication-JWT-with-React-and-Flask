import React, { useState, useEffect } from "react";
import { userService } from '../services/APIUser';
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";

export const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const [logoutMsg, setLogoutMsg] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user) {
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            window.dispatchEvent(new Event('userChanged'));
            timerMsg()
        }
    }, [])

    const timerMsg = () => {
        setLogoutMsg("Sesión cerrada correctamente.");
        setTimeout(() => {
            setLogoutMsg("")
        }, 3000)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")
        setLoading(true)
        const result = await userService.LoginUser({ email, password })
        setLoading(false)
        if (result.success) {
            navigate("/welcome")
        } else {
            setError(result.error)
        }
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Login</h1>
            {logoutMsg && <div className="alert alert-info">{logoutMsg}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card">
                <div className="card-body">
                    {loading ? <div className="text-center my-3"><Spinner /></div> : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={event => setEmail(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <Link to="/" className="btn btn-warning">← Regresar al registro</Link>
            </div>
        </div>
    )
}