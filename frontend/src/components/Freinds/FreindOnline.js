import React from 'react'

export default function FreindOnline(props) {
    return (
      <>
          <li className="clearfix">
            <img src={props.user.image} alt="avatar" />
            <div className="about">
                <div className="nameprofil">{props.user.firstname} {props.user.lastname}</div>
                <div className="status">
                {<div><i className={"fa fa-circle " + props.status} />{props.status}</div>
                //  : <div><i className="fa fa-circle ofline" />offline</div>
                 } 
                </div>
            </div>
        </li>
      </>
    )
}
