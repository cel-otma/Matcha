import React from 'react'
import Navbar from "./login/navbar";
import Sidebar from './login/sidebar.js';
import Formcontent from "./login/formcontent";

 function Register() {

    return (
        <div className="main">
           <Navbar /> 
           <div className="container">
                <Sidebar />
                <Formcontent />
           </div>
        </div>
    )
}
export default Register