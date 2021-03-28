import React from 'react'

export default function MyMessage(props) {
    return (
        <div>
             <li className="clearfix">
              <div className="message-data align-right">
    <span className="message-data-time">{props.message.date}</span> &nbsp; &nbsp;
                <span className="message-data-nameprofil"></span> <i className="fa fa-circle me" />
              </div>
              <div className="message other-message float-right">
                {props.message.message}
              </div>
            </li>
        </div>
    )
}
