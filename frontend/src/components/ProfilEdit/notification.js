import React from 'react'
import './profil.css'
import notif from "./img/avatar1.png";
function Notification() {
    return (
            <div className="notifi-box" id="box">
                <h2>Notifications <span>17</span></h2>
                <div className="notifi-item">
                  <img src={notif} alt="img" />
                  <div className="text">
                    <h4>Elias Abdurrahman</h4>
                    <p>@lorem ipsum dolor sit amet</p>
                  </div> 
                </div>
            </div>
    )
}
export default Notification