import React from 'react'

export default function ListHistory(props) {
    function go(){
        window.location.href = "/ViewsProfil/" + props.user.login;
      }
    return (
        <div className="chat-header clearfix" >
         <img src={props.user.image} alt="avatar" style={{cursor:"pointer"}} onClick={() => {go(); }}/>
        <div className="chat-about">
            <div className="chat-with">{props.user.firstname} {props.user.lastname}</div>
            <div className="chat-num-messages">{props.user.message}</div>
        </div>
        <div className="time">  {props.user.date}</div>
        <button type="button" className="deleteNotification" onClick={() => {
          props.deletents(props.user.history_id);
        }}
        >
            Delete
            </button>
    </div>
    )
}
