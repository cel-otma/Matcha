 // eslint-disable-next-line
import React, { useState } from 'react'
import loginimg from "../../icon/background.svg";
// import "../style.css";
import './login.css'
import {Link} from 'react-router-dom';

function Navbar() {
    return (
             <div className="nav">
                <img src={loginimg} alt="" />
                <div className="navigation">
                    <div className="brand">
                      <h1> Matcha</h1>
                    </div>
                    <div className="toggle">
                        <button onClick={() => {document.querySelector('.nav-menu').style.display='block'}}> 
                        <i className="fas fa-bars"></i></button>
                    </div>
                    <div className="nav-menu">
                        <div className="close">
                            <button onClick={() => {document.querySelector('.nav-menu').style.display='none'}}>
                            <i className="fas fa-window-close"> </i></button>
                        </div>
                        <ul>
                        <Link to="/Singin"> Sing in</Link>
                        <Link to="/Singup"> Sing up</Link>
                        </ul>
                    </div>
                </div>
            </div>
    )
}
export default Navbar
