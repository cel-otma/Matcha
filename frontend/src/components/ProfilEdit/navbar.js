import React from 'react'
import notif from "./img/notif.png"
import exit from "./img/exit.png";
import msg from "./img/msg.png";

function Navbar(props) {

    return (
        <div>
        <nav >
          <div className="logo"> 
              Matcha 
          </div>
         <div className="notif">
            <div className="icon" onClick={()=>{
                  props.change((oldValue)=>(oldValue !===''?'':'test'))
                }}>
                  <img src={notif}  /> <span>17</span>
            </div>
            <div className="icon" onClick={()=>{
                  props.change((oldValue)=>(oldValue !===''?'':'test'))
                }}>
                <img src={msg} alt="" /> <span>5</span>
            </div>
            <div className="icon" onClick="toggleNotifi()">
              <img src={exit} alt="" /> 
            </div>
         </div>
        </nav>
      </div>
    )
}
export default Navbar