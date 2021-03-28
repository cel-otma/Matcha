import React from 'react'

export default function OtherMessage(props) {
    return (
        <div>
            <li>
              <div className="message-data">
                <span className="message-data-nameprofil"><i className="fa fa-circle online" /> </span>
                <span className="message-data-time">{props.message.date}</span>
              </div>
              <div className="message my-message">
                {props.message.message}
              </div>
            </li>
        </div>
    )
}
