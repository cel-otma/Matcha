import React, { useState, useEffect } from "react";
import ListNotification from "./ListNotification";
import UserSearch from "../home/UserSearch";
import axios from "axios";
import userprofil from "../profl_information/img/userprofil.jpg";
import config from "../../config";
import useInfiniteScroll from "react-infinite-scroll-hook";
import {useLocation} from 'react-router-dom';

export default function Notification(props) {
  const [information, changeIformation] = useState([]);
  const [allnotification, setallnotification] = useState();
  let location = useLocation();
  let [ntfslength, setntfslength] = useState(0);

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

  let deletethis = (nts_id) => {
    axios
      .delete("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/notifications", {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
        data: {
          nts_id: nts_id,
        },
      })
      .then((result) => {
      });
    changeIformation(information.filter((info) => {
      if (info.nts_id !== nts_id) 
        return true;
      return false;
    }));
  };

  useEffect(() => {
    if (props.UpdateAllntfs === 1
    && location.pathname === '/notification') {
      props.setupntfs(0);
      updatentfs();
    }// eslint-disable-next-line
  }, [props.UpdateAllntfs]);

  let updatentfs = () => {
    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/notifications?g_ntsid=" + ((information[0] !== undefined) ? information[0].nts_id : '0'), {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((result) => {
        let i = 0;
        let data = result.data.data;
        let newdata = [];
        while (i < data.length) {
          newdata.push({
            firstname: data[i].first_name,
            lastname: data[i].last_name,
            login: data[i].login,
            message: data[i].message,
            date: timeSince(new Date(data[i].creat_dat)),
            image:
              data[i].img !== undefined ? "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + config.SERVER_IMGS + data[i].img : userprofil,
            nts_id: data[i].nts_id,
          });
          i++;
        }
        // vuenotifications();
        changeIformation(newdata.concat(information));
      });
  }

  useEffect(() => {
    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/notifications?limit=0", {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((result) => {
        if (result.data.success) {
          setntfslength(result.data.length);
          changeIformation(() => {
            const arr = information;
            setallnotification(result.data.data.length);
            for (let i = 0; i < result.data.data.length; i++)
              arr.push({
                firstname: result.data.data[i].first_name,
                lastname: result.data.data[i].last_name,
                login: result.data.data[i].login,
                message: result.data.data[i].message,
                date: timeSince(new Date(result.data.data[i].creat_dat)),
                image:
                  result.data.data[i].img !== undefined ? "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + config.SERVER_IMGS + result.data.data[i].img : userprofil,
                nts_id: result.data.data[i].nts_id,
              });
            return arr;
          });
        }
      });
    // eslint-disable-next-line
  }, []);

  const [loading, setLoading] = useState(false);

  function handleLoadMore() {
    if (information.length >= ntfslength) return;
    setLoading(true);
    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/notifications?limit=" + information.length, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((result) => {
        if (result.data.success) {
          changeIformation(() => {
            const arr = information;
            setallnotification(result.data.data.length);
            for (let i = 0; i < result.data.data.length; i++)
              arr.push({
                firstname: result.data.data[i].first_name,
                lastname: result.data.data[i].last_name,
                login: result.data.data[i].login,
                message: result.data.data[i].message,
                date: timeSince(new Date(result.data.data[i].creat_dat)),
                image:
                  result.data.data[i].img !== undefined ? "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + config.SERVER_IMGS + result.data.data[i].img : userprofil,
                nts_id: result.data.data[i].nts_id,
              });
            return arr;
          });
        }
      });

    setLoading(false);
  }

  const infiniteRef = useInfiniteScroll({
    loading,
    hasNextPage: true,
    onLoadMore: handleLoadMore,
    scrollContainer: "window",
  });

  return (
    <>
      <UserSearch allnotification={allnotification} setlength={props.setlength} length={props.length}/>
      <div className="chat">
        <h1>Notifications</h1>
        <div className="notification-history" ref={infiniteRef}>
          <ul>
            {information.map((item, index) => (
              <ListNotification key={index} user={item} deletents={deletethis} />
            ))}
            {loading && <div>loading...</div>}
          </ul>
        </div>
      </div>
    </>
  );
}
