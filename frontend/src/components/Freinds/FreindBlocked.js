import React from 'react'

export default function FreindBlocked(props) {
    return (
        <div className="chat-header clearfix">
            <img src={props.user.image} alt="avatar" />
            <div className="chat-about">
                <div className="chat-with"> {props.user.firstname} {props.user.lastname}</div>
            </div>
            <button type="button" className="Unblock" 
             onClick={() => {
                props.unblocked(props.user.login);
              }}
            >Unblocked</button>
        </div>
    )
}
