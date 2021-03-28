import React, { useState } from "react";
import "./ViewsProfil1.css";
import userprofil from "../profl_information/img/userprofil.jpg";
import UserSearch from "../home/UserSearch";
import Rating from "@material-ui/lab/Rating";
import Switch from "./Switch";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { useEffect } from "react";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import io from 'socket.io-client';
let sock = io.connect(`http://${config.SERVER_HOST}:${config.SERVER_PORT}`);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ViewsProfil(props) {
  let [rating, setRating] = useState(0);
  let [userrating, setuserRating] = useState(0);
  const [step, changeStep] = useState(1);
  const [error, changeError] = useState({
    type: "success",
    msg: "",
    state: false,
  });
  let [latitude, setlatitude] = useState(0);
  let [longitude, setlongitude] = useState(0);
  const handleClose = () => {
    changeError({ type: "error", msg: "", state: false });
  };
  const { username } = useParams();
  const [information, changeIformation] = useState({
    image: [],
    login: "",
    firstname: "",
    lastname: "",
    desc: "",
    gender: "",
    lookingfor: "",
    date: "",
    city: "",
    tags: [],
    nbrfollowers: 0,
    follow: 0,
    following: 0,
    report: "Report"
  });

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
    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/images?login=" + username, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success) {
          let ALLimage = [];
          respond.data.data.forEach((element) => {
            ALLimage.push("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + config.SERVER_IMGS + element.image_path);
          });
          if (respond.data.data.length !== 0) changeIformation((oldvalue) => ({ ...oldvalue, image: ALLimage }));
          else
            changeIformation((oldvalue) => ({
              ...oldvalue,
              image: [userprofil],
            }));
        }
      });
    axios
      .get(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/users?login=${username}`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success) {
          changeIformation((oldvalue) => ({
            ...oldvalue,
            login: respond.data.data[0].login,
            firstname: respond.data.data[0].first_name,
            lastname: respond.data.data[0].last_name,
          }));
        } else window.location.href = "/";
      });

    axios
      .get(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/infos?login=${username}`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success && respond.data.data.length) {
          changeIformation((oldvalue) => ({
            ...oldvalue,
            desc: respond.data.data[0].desc,
            gender: respond.data.data[0].gendre,
            lookingfor: respond.data.data[0].sex_pref,
            date: respond.data.data[0].birthday,
            city: respond.data.data[0].city,
            status : respond.data.data[0].status
          }));
        }else
            window.location.href = '/';
      });
    axios
      .get(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/tags?login=${username}`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        let activetag = [];
        for (let i = 0; i < respond.data.data.length; i++) {
          if (respond.data.data[i].state === "active") {
            activetag.push(respond.data.data[i].tag);
          }
        }

        changeIformation((oldvalue) => ({
          ...oldvalue,
          activetags: activetag,
        }));
      });
    axios
      .get(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/report?login=${username}`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success) {
          changeIformation((oldvalue) => ({
            ...oldvalue,
            report: respond.data.ureport ? "Unreported" : "Reported",
          }));
          (respond.data.ureport) ? (document.getElementById("danger").style.display = "flex") : (document.getElementById("danger").style.display = "none");
        }
      });
    axios
      .get(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/follow/all?login=${username}`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success) {
          changeIformation((oldvalue) => ({
            ...oldvalue,
            nbrfollowers: respond.data.data,
          }));
        }
      });
    axios
      .get(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/follow?to_login=${username}`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success) {
          changeIformation((oldvalue) => ({
            ...oldvalue,
            follow: !respond.data.data ? "follow" : "unfollow",
          }));
        }
      });
    axios
      .get(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/follow/following?login=${username}`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success) {
          changeIformation((oldvalue) => ({
            ...oldvalue,
            following: respond.data.data,
          }));
        }
      });

    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/rating?login=" + username, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((result) => {
        setuserRating(result.data.totalrat);
        setRating(result.data.userrat);
      });

    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/position?login=" + username, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((result) => {
        setlatitude(result.data.data[0].latitude);
        setlongitude(result.data.data[0].longitude);
      });
    // eslint-disable-next-line
  }, []);
  function follow() {
    if (sock !== undefined) {
      sock.emit('upntfs', 'sss');
    }
    axios({
      method: "POST",
      url: `http://${config.SERVER_HOST}:${config.SERVER_PORT}/follow`,
      headers: {
        authorization: localStorage.getItem("Authorization"),
      },
      data: {
        to_login: username,
      },
    }).then((respond) => {
      if (respond.data.success) {
        changeIformation((oldvalue) => ({
          ...oldvalue,
          follow: (information.follow === "follow") ? "Unfollow" : "follow",
          nbrfollowers: (information.follow === "follow") ? information.nbrfollowers + 1 : information.nbrfollowers - 1,
        }));
      } else if (respond.data.error) {
        changeError({
          type: "error",
          msg: respond.data.message,
          state: true,
        });
      }
    });
  }
  function ratingvalue(rat) {
    if (rating === 0) {
      axios
        .post(
          "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/rating",
          { rat: parseInt(rat), login: username },
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        )
        .then((result) => {
            if (result.data.success) {
              setuserRating(rating + 1);
              setRating(parseInt(rat));
              sock.emit('upntfs', 'sss');
            }
            else
              changeError({
                type: "error",
                msg: result.data.message,
                state: true,
            });
        });
    } else {
      axios
        .patch(
          "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/rating",
          { rat: rat, login: username },
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        )
        .then((result) => {
          if (result.data.success)
            setRating(parseInt(rat));
          else
            changeError({
              type: "error",
              msg: result.data.message,
              state: true,
            });
        });
    }
  }

  function Block() {
    axios
      .post(
        "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/blocks",
        { login: username },
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      )
      .then((result) => {
        if (result.data.success) {
          window.location.href = '/';
        } else if (result.data.error) {
          changeError({
            type: "error",
            msg: result.data.message,
            state: true,
          });
        }
      });
  }

  function Report() {
    axios
      .post(
        "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/report",
        { login: username },
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      )
      .then((result) => {
        if (result.data.success) {
          changeIformation((oldvalue) => ({
            ...oldvalue,
            report: information.report === "Reported" ? "Unreported" : "Reported",
          }));
          (information.report === "Reported") ? (document.getElementById("danger").style.display = "flex") : (document.getElementById("danger").style.display = "none");
          changeError({
            type: "success",
            msg: result.data.message,
            state: true,
          });
        } else if (result.data.error) {
          changeError({
            type: "error",
            msg: result.data.message,
            state: true,
          });
        }
      });
  }
  function getposition() {
    window.open(`https://www.google.com/maps/dir//${latitude},${longitude}/@${latitude},${longitude},8z`);
  }

  return (
    <div>
      <Snackbar open={error.state} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={error.type}>
          {error.msg}
        </Alert>
      </Snackbar>
      <UserSearch setlength={props.setlength} length={props.length}/>
      <div className="containerProfil">
        <main>
          <ReportProblemIcon className="danger" id="danger" />
          <div className="row">
            <div className="left col-lg-4">
              <div className="photo-left">
                {/* eslint-disable-next-line  */}
                <img className="photoProfil" id="profileimg" src={information.image[0]} />
                <div className={(information.status !== undefined) ?  'st' + information.status[0].status : 'disconnect'} />
              </div>
              <h4 className="name" id="name">
                {information.login}{" "}
              </h4>
              <p className="info">{(information.status !== undefined) ? timeSince(new Date(information.status[0].modified_dat)) : ''}</p>
              <div className="option1">
                <div>
                  <button
                    onClick={() => {
                      Report();
                    }}
                    style={{
                      backgroundColor: "rgb(186, 25, 0)",
                      border: "none",
                      color: "white",
                      padding: "8px 13px",
                    }}
                  >
                    {information.report}
                  </button>
                </div>
                <div>
                  <button
                    style={{
                      backgroundColor: "rgb(220, 116, 56)",
                      border: "none",
                      color: "white",
                      padding: "8px 13px",
                    }}
                    onClick={() => {
                      Block();
                    }}
                  >
                    Block
                  </button>
                </div>
              </div>
              <LocationOnIcon
                onClick={() => {
                  getposition();
                }}
                style={{
                  fontSize: "47px",
                  marginTop: "10px",
                  color: "#4a851d",
                }}
              />
              <div className="stats row">
                <div className="stat col-xs-4" style={{ paddingRight: "50px" }}>
                  <p className="number-stat">{information.nbrfollowers}</p>
                  <p className="desc-stat">Followers</p>
                </div>
                <div className="stat col-xs-4">
                  <p className="number-stat">{information.following}</p>
                  <p className="desc-stat">Following</p>
                </div>
                <div className="stat col-xs-4" style={{ paddingLeft: "50px" }}>
                  <p className="number-stat">{userrating}</p>
                  <p className="desc-stat">Rating</p>
                </div>
              </div>
              <div>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                    ratingvalue(newValue);
                  }}
                />
              </div>
              <p className="desc">{information.desc}</p>
            </div>
            <div className="right col-lg-8">
              <ul className="nave">
                <li
                  onClick={() => {
                    changeStep(1);
                  }}
                >
                  Gallery
                </li>
                <li
                  onClick={() => {
                    changeStep(2);
                  }}
                >
                  Information
                </li>
                <li
                  onClick={() => {
                    changeStep(3);
                  }}
                >
                  Tags
                </li>
              </ul>
              <span
                onClick={() => {
                  follow();
                }}
              >
                <span className="follow">{information.follow}</span>
              </span>
              <Switch step={step} user={information} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default ViewsProfil;
