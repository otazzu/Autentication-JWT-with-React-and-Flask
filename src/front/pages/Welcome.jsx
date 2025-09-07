import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../services/APIUser";


export const Welcome = () => {

    const [error, setError] = useState("")
    const [enable, setEnable] = useState(true)
    const [mail, setMail] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [navigate])

    const fetchData = async () => {
        try {
            setEnable(true)
            const response = await userService.ProtectedPage()
            if (!response.success) {
                setEnable(false)
                setError(response.error)
                countDown()
            }
            const catParam = "@"
            const cutMail = response.data.email.split(catParam)
            const name = cutMail[0]
            setMail(name)
            console.log(mail)

        } catch (error) {
            console.log(error)
        }

    }

    const countDown = () => {
        setTimeout(() => {
            navigate("/login")
        }, 3000)
    }

    return (
        <div>
            {enable ?
                <div className="text-center mt-5">
                    <h1 className="mb-5">Bienvenido!</h1>
                    <h2 className="text-info p-3">{mail}</h2>
                    <Link to="/login" className="btn btn-primary w-50">Log out</Link>
                </div>
                :
                (
                    <div className="d-flex flex-column vh-100">
                        <div className="my-auto">
                            <div className="alert alert-danger w-100" role="alert">
                                <div className="d-flex justify-content-center">
                                    {error}
                                </div>
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <p className="my-0 mx-2">Redirigiendo al login</p>
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}