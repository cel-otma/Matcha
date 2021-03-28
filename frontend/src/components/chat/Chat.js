import React, { useEffect, useState } from "react";
import "./chat.css";
import UserSearch from "../home/UserSearch";
import PeopleList from "./people-list";
import ContentChat from "./ContentChat";
import config from "../../config";
import axios from "axios";
import userprofil from "../profl_information/img/userprofil.jpg";

function Chat(props) {
  const [information, changeIformation] = useState([]);
  let [message, changemessage] = useState([]);
  let [current, setCurrent] = useState(0);

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

  useEffect(() => {
    if (information.length === 0) {
      axios
        .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/inbox/users", {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        })
        .then((result) => {
          if (result.data.length) {
            axios
              .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/inbox/messages?user_id=" + parseInt(result.data[0].user_id), {
                headers: {
                  Authorization: localStorage.getItem("Authorization"),
                },
              })
              .then((result) => {
                changemessage(() => {
                  const array = [];
                  for (let i = 0; i < result.data.data.length; i++)
                    array.push({
                      date: timeSince(new Date(result.data.data[i].created_dat)),
                      message: result.data.data[i].message,
                      user_id: result.data.data[i].user_id,
                      msg_id : result.data.data[i].inbox_id
                    });
                  return array;
                });
              });
            changeIformation(() => {
              let arr = [];
              for (let i = 0; i < result.data.length; i++)
                arr.push({
                  login: result.data[i].login,
                  firstname: result.data[i].first_name,
                  lastname: result.data[i].last_name,
                  image: result.data[i].img !== undefined ? "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + config.SERVER_IMGS + result.data[i].img : userprofil,
                  user_id: result.data[i].user_id,
                  status : result.data[i].status
                });
              return arr;
            });
          }
        });
    } else
      axios
        .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/inbox/messages?user_id=" + parseInt(information.length !== 0 ? information[current].user_id : 0), {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        })
        .then((result) => {
          changemessage(() => {
            const array = [];
            for (let i = 0; i < result.data.data.length; i++)
              array.push({
                date: timeSince(new Date(result.data.data[i].created_dat)),
                message: result.data.data[i].message,
                user_id: result.data.data[i].user_id,
                msg_id : result.data.data[i].inbox_id
              });
            return array;
          });
        });
    // eslint-disable-next-line
  }, [current]);


  return (
    <>
      <UserSearch setlength={props.setlength} length={props.length}/>
      <div className="containerchat clearfix">
        <PeopleList information={information} setCurrent={setCurrent} />
        <ContentChat current={information[current]} information={information} messages={message} changemessage={changemessage}  timeSince={timeSince}/>
      </div>
    </>
  );
}
export default Chat;
