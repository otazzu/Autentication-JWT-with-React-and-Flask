import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../services/APIUser";


export const Welcome = () => {

    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await userService.ProtectedPage()
                if (!response.success){
                    setError(response.error)
                }
            } catch (error) {
                
            }

        }
        fetchData()
    }, [])

    return (
        <div className="text-center mt-5">
            <h1 className="mb-5">Welcome!</h1>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <Link to="/login" className="btn btn-primary w-50">Log out</Link>
        </div>
    )
}