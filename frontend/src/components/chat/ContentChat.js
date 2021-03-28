import React, { useState } from "react";
import ChatHistory from "./ChatHistory";
import ChatHeader from "./ChatHeader";
import config from "../../config";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useEffect } from "react";
import io from 'socket.io-client';

let sock = io.connect(`http://${config.SERVER_HOST}:${config.SERVER_PORT}`);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function ContentChat(props) {
  const [msg, setmessage] = useState("");
  const [error, changeError] = useState({
    type: "success",
    msg: "",
    state: false,
  });

  const handleClose = () => {
    changeError({ type: "error", msg: "", state: false });
  };

  let getnewmessages = () => {
    if (props.current !== undefined && props.messages !== undefined) {
        axios
          .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/inbox/messages?user_id=" + props.current.user_id + "&g_msgid=" + props.messages.length, {
              headers: {
                Authorization: localStorage.getItem("Authorization"),
              },
            })
            .then((result) => {
              if (result.data.success === true &&
                result.data.data.length) {
                  let newmsgs = [];
                  let data = result.data.data;
                  let i = 0;
                  while (i < data.length) {
                    newmsgs.push({
                        date: props.timeSince(new Date(data[i].created_dat)),
                        message: data[i].message,
                        user_id: data[i].user_id,
                        msg_id : data[i].inbox_id
                    });
                    i++;
                  }
                  props.changemessage(props.messages.concat(newmsgs));
                  const audio =
new Audio('https://proxy.notificationsounds.com/notification-sounds/piece-of-cake-611/download/file-sounds-1153-piece-of-cake.mp3');
                  audio.play();
                }
          });
      }
  }

  sock.on('updateMsg', (msg) => {
    getnewmessages();
  });

  useEffect(() => {
    setTimeout(() => {
      if (document.getElementById("chat-history") && document.getElementById("chat-history").scrollHeight)
        document.getElementById("chat-history").scrollTop = document.getElementById("chat-history").scrollHeight;
    }, 1000);
  }, []);

  function send() {
    axios
      .post(
        "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/inbox",
        { login: props.current.login, msg: msg },
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      )
      .then((result) => {
        if (result.data.success) {
          setmessage('');
          props.changemessage([...props.messages,
          {date: props.timeSince(new Date(Date.now())), 'message' : msg, user_id: result.data.user_id, 'msg_id' : (props.messages[0] !== undefined) ? (props.messages.length + 1) : 1}]);
          sock.emit('msg', '');
          sock.emit('upntfs', '');
        } 
      });
  }
  return (
    <div className="chat" id="chat">
      {props.current && props.current.login ? (
        <>
          <Snackbar open={error.state} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={error.type}>
              {error.msg}
            </Alert>
          </Snackbar>
          <ChatHeader current={props.current} information={props.information} />
          <div className="chat-history" id="chat-history">
            <ul>
              <ChatHistory check="me" current={props.current} message={props.messages} />
            </ul>
          </div>
          <div className="chat-message clearfix">
            <textarea
              nameprofil="message-to-send"
              id="message-to-send"
              placeholder="Type your message"
              rows={3}
              value={msg}
              onChange={(event) => setmessage(event.target.value)}
            />
            <button
              className="send"
              onClick={() => {
                send();
              }}
            >
              Send
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
