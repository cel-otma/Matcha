import React from "react";
import "./chat.css";

export default function FreindsChat(props) {
  return (
    <div className="test" onClick={() => props.setCurrent(props.index)} style={{ cursor: "pointer" }}>
      <li className="clearfix">
        <img src={props.user.image} alt="avatar" />
        <div className="about">
          <div className="nameprofil">
            {props.user.firstname} {props.user.lastname}
          </div>
          <div className="status">
            {(props.status === 'online') ? (
              <div>
                <i className="fa fa-circle online" /> online
              </div>
            ) : (
              <div>
                <i className="fa fa-circle ofline" /> offline
              </div>
            )}
            <p>{'lastseen ' + props.lastseen}</p>
          </div>
        </div>
      </li>
    </div>
  );
}
