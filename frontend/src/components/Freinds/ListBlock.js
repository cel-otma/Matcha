import React, { useEffect, useState } from "react";
import FreindBlocked from "./FreindBlocked";
import config from "../../config";
import axios from "axios";
import userprofil from "../profl_information/img/userprofil.jpg";

export default function ListBlock() {
  const [information, changeIformation] = useState([]);

  let unblocked = (login) => {
    axios
      .delete(
        "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/blocks",
        {
          data: { login: login },
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      )
      .then((result) => {
      });
      changeIformation(information.filter((info) => {
        if (info.login !== login) 
          return true;
        return false;
      }));
  };
  useEffect(() => {
    axios
      .get(
        "http://" +
          config.SERVER_HOST +
          ":" +
          config.SERVER_PORT +
          "/blocks/get",
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      )
      .then((result) => {
        changeIformation(() => {
          const arr = [];
          for (let i = 0; i < result.data.data.length; i++)
            arr.push({
              firstname: result.data.data[i].first_name,
              login: result.data.data[i].login,
              lastname: result.data.data[i].last_name,
              image:
                result.data.data[i].to_img !== undefined
                  ? "http://" +
                    config.SERVER_HOST +
                    ":" +
                    config.SERVER_PORT +
                    config.SERVER_IMGS +
                    result.data.data[i].to_img
                  : userprofil,
            });
          return arr;
        });
      });
    // eslint-disable-next-line
  }, []);
  return (
    <div className="chat" id="chat">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <h3>List Block</h3>
        <button
          id="Freinds-List"
          onClick={() => {
            document.getElementsByClassName("people-list")[0].style.display =
              "block";
            document.getElementsByClassName("chat")[0].style.display = "none";
          }}
        >
          Freinds List
        </button>
      </div>
      <div className="notification-history">
        <ul>
          {information.map((item, index) => (
            <FreindBlocked key={index} user={item} unblocked={unblocked} />
          ))}
        </ul>
      </div>
    </div>
  );
}
