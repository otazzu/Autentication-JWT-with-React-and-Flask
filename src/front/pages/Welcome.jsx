import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../services/APIUser";


export const Welcome = () => {

    const [error, setError] = useState("")
    const [enable, setEnable] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setEnable(true)
                const response = await userService.ProtectedPage()
                if (!response.success) {
                    setEnable(false)
                    setError(response.error)
                    setTimeout(() => {
                        navigate("/login")
                    }, 3000);

                }
            } catch (error) {

            }

        }
        fetchData()
    }, [])

    return (
        <div>
            {enable ? <div className="text-center mt-5">
                <h1 className="mb-5">Welcome!</h1>
                <Link to="/login" className="btn btn-primary w-50">Log out</Link>
            </div>
                :
                (
                    <div className="d-flex vh-100">
                        <div className="alert alert-danger w-100 m-auto" role="alert">
                            <div className="d-flex justify-content-center">
                                {error}
                            </div>
                        </div>
                    </div>
                )}
        </div>

        // <div className="text-center mt-5">
        //     <h1 className="mb-5">Welcome!</h1>
        //     {error && (
        //         <div className="alert alert-danger" role="alert">
        //             {error}
        //         </div>
        //     )}
        //     <Link to="/login" className="btn btn-primary w-50">Log out</Link>
        // </div>
    )
}