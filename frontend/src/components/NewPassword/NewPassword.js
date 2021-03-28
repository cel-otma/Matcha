import React from 'react'
import Navbar from "../login/navbar";
import FormNewPasswd from "./FormNewPasswd"

export default function NewPassword() {
    return (
        <div className="main">
            <Navbar />
            <div className="container">
                <FormNewPasswd />
            </div>
        </div>
    )
}
