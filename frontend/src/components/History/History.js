import React, { useState, useEffect } from "react";
import ListHistory from "./ListHistory";
import UserSearch from "../home/UserSearch";
import config from "../../config";
import axios from "axios";
import userprofil from "../profl_information/img/userprofil.jpg";
import useInfiniteScroll from "react-infinite-scroll-hook";

export default function History(props) {
  const [information, changeIformation] = useState([]);
  let [histlength, sethist] = useState(0);

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

  let deletethis = (history_id) => {
    axios
      .delete("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/history", {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
        data: {
          history_id: history_id,
        },
      })
      .then((result) => {});
      changeIformation(information.filter((info) => {
        if (info.history_id !== history_id) 
          return true;
        return false;
      }));
  };

  useEffect(() => {
    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/history?limit=0", {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((result) => {
        sethist(result.data.length);
        changeIformation(() => {
          const arr = information;
          for (let i = 0; i < result.data.data.length; i++)
            arr.push({
              firstname: result.data.data[i].infos.first_name,
              lastname: result.data.data[i].infos.last_name,
              login: result.data.data[i].infos.login,
              message: result.data.data[i].message,
              date: timeSince(new Date(result.data.data[i].created_dat)),
              image:
                result.data.data[i].image !== undefined
                  ? "http://" +
                    config.SERVER_HOST +
                    ":" +
                    config.SERVER_PORT +
                    config.SERVER_IMGS +
                    result.data.data[i].image
                  : userprofil,
              history_id: result.data.data[i].history_id,
            });
          return arr;
        });
      });
    // eslint-disable-next-line
  }, []);

  const [loading, setLoading] = useState(false);

  function handleLoadMore() {
    if (information.length >= histlength) return;
    setLoading(true);
    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/history?limit=" + information.length, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((result) => {
        changeIformation(() => {
          const arr = information;
          for (let i = 0; i < result.data.data.length; i++)
          arr.push({
            firstname: result.data.data[i].infos.first_name,
            lastname: result.data.data[i].infos.last_name,
            login: result.data.data[i].infos.login,
            message: result.data.data[i].message,
            date: timeSince(new Date(result.data.data[i].created_dat)),
            image:
              result.data.data[i].image !== undefined
                ? "http://" +
                  config.SERVER_HOST +
                  ":" +
                  config.SERVER_PORT +
                  config.SERVER_IMGS +
                  result.data.data[i].image
                : userprofil,
            history_id: result.data.data[i].history_id,
          });
        return arr;
        });
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
    <div>
      <UserSearch setlength={props.setlength} length={props.length}/>
      <div className="chat">
        <h1>History Activies</h1>
        <div className="notification-history" ref={infiniteRef}>
          <ul>
            {information.map((item, index) => (
              <ListHistory key={index} user={item} deletents={deletethis} />
            ))}
            {loading && <div>loading...</div>}
          </ul>
        </div>
      </div>
    </div>
  );
}
