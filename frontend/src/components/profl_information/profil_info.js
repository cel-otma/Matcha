import React, { useEffect, useState } from "react";
import Content from "./profil_content";
import UserSearch from "../home/UserSearch";
import axios from "axios";
import config from "../../config";

function Information(props) {
  // eslint-disable-next-line
  let [latitude, setlatitude] = useState(0);
  // eslint-disable-next-line
  let [longitude, setlongitude] = useState(0);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        function (position) {
          sendposition(position.coords.latitude, position.coords.longitude);
        });
    }
    function sendposition(lat, long) {
      axios
        .post(
          "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/position",
          {
            lat: lat,
            lon: long,
          },
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        )
        .then((result) => {
        });
    }

    axios
      .get(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/auth`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success) {
          axios
            .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/infos?login=" + localStorage.getItem("login"), {
              headers: {
                Authorization: localStorage.getItem("Authorization"),
              },
            })
            .then((respond) => {
              if (respond.data.data.length) {
                axios
                  .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/tags?login=" + localStorage.getItem("login"), {
                    headers: {
                      Authorization: localStorage.getItem("Authorization"),
                    },
                  })
                  .then((respond) => {
                    if (respond.data.data.length) {
                      props.complete(1);
                      window.location.href = "/";
                    }
                  });
              }
            });
        } else window.location.href = "/Singin";
      });
    // eslint-disable-next-line
  }, []);
  return (
    <div className="main">
      <UserSearch setlength={props.setlength} length={props.length}/>
      <Content />
    </div>
  );
}
export default Information;
