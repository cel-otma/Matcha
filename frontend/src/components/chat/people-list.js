import React from "react";
import "./chat.css";
import FreindsChat from "./FreindsChat";
import search from "./search";

export default function PeopleList(props) {
  function handleChange() {
    search();
  }

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " Years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " Months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " Days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " Hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " Minutes";
    }
    return Math.floor(seconds) + " Seconds";
  }

  return (
    <div className="people-list" id="people-list">
      <div className="search">
        <input id="MyInput" type="text" placeholder="search" onChange={handleChange} />
        <i
          className="fa fa-arrow-left"
          onClick={() => {
            document.getElementsByClassName("people-list")[0].style.display = "none";
          }}
        ></i>
      </div>
      <ul className="list" id="myUL">
        {props.information.map((item, index) => (
          <FreindsChat status={(item.status !== undefined) ?
  item.status[0].status : 'offline'} lastseen={(item.status !== undefined) ?
    timeSince(new Date(item.status[0].modified_dat)) : ''} key={index} user={item} index={index} setCurrent={props.setCurrent} />
        ))}
      </ul>
    </div>
  );
}
