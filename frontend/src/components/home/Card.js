import React from "react";
import close from "./img/close.svg";
// import check from "./img/check.svg"
import follow from "./img/follow.svg";
import star from "./img/star.svg";
import position from "./img/position.svg";
import user from "./img/user.svg";
import ageicon from "./img/age.svg";
import hashtag from "./img/hashtag.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import io from 'socket.io-client';

let sock = io.connect(`http://${config.SERVER_HOST}:${config.SERVER_PORT}`);

function Card(props) {
  let today = new Date();
  let age = today.getFullYear() - parseInt(props.user.date, 10);

  function history() {
    setTimeout(() => {
      sock.emit('upntfs', '');
    }, 500);
    axios
      .post(
        "http://" +
          config.SERVER_HOST +
          ":" +
          config.SERVER_PORT +
          "/history/visit",
        {
          login: props.user.login,
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
  return (
    <div className="card">
      {/* eslint-disable-next-line */}
      <img className="imageProfil2" src={props.user.imag}></img>
      <div className="option">
        <div className="closeProfil">
          {/* eslint-disable-next-line */}
          <img src={close}></img>
        </div>
        <div className="check">
          {/* eslint-disable-next-line */}
          <img src={follow}></img>
        </div>
        <div className="star">
          {/* eslint-disable-next-line */}
          <img src={star}></img>
  <span>{parseFloat(props.user.fameRating.toFixed(2))}</span>
        </div>
      </div>
      <div className="image">
        {/* eslint-disable-next-line */}
        <img src={props.user.image}></img>
      </div>
      <div className="titleCard">
        <h1>
          {" "}
          {props.user.firstname} {props.user.lastname}
        </h1>
      </div>
      {/* <div className="des" style={{display:'flex', flexWrap:'wrap', justifyContent:'center', width:'100%'}}> 
                <p>
                #jbjb <p>#jbbiv</p> <p>#hiubgiubgiu</p>
                </p>
            </div> */}
      <div className="des">
        <p>{props.user.desc}</p>
      </div>
      <div className="position">
        {/* eslint-disable-next-line */}
        <img src={position}></img>
        <span>{props.user.position} Km</span>
      </div>
      <div className="gender">
        {/* eslint-disable-next-line */}
        <img src={user}></img>
        <span> {props.user.gender}</span>
      </div>
      <div className="age">
        {/* eslint-disable-next-line */}
        <img src={ageicon}></img>
        <span> {age} </span>
      </div>
      <div className="age">
        {/* eslint-disable-next-line */}
        <img src={hashtag}></img>
        <span> {props.user.commontags} </span>
      </div>
      <div className="rating">
        <div>
          <button className="btnProfil">
            {" "}
            <Link
              onClick={() => 
                history()
              }
              to={"/ViewsProfil/" + props.user.login}
            >
              {" "}
              Voir Profil{" "}
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Card;
