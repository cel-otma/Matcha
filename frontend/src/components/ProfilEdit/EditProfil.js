import React, { useState } from "react";
import "./EditProfil.css";
import UserSearch from "../home/UserSearch";
import userprofil from "../profl_information/img/userprofil.jpg";
import SwitchProfil from "../ProfilEdit/SwitchProfil";
import DeleteIcon from "@material-ui/icons/Delete";
import Axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import config from "../../config";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function EditProfil(props) {
  const { username } = useParams("");
  const history = useHistory();
  let [userrating, setuserRating] = useState(0);
  
  const [information, changeIformation] = useState({
    image: [],
    login: "",
    firstname: "",
    lastname: "",
    desc: "",
    gendre: "",
    sex_pref: "",
    birthday: "",
    city: "",
    activetagstags: [],
    inactivetags: [],
    email: "",
    nbrfollowers: 0,
    following: 0,
  });

  useEffect(() => {
    const user = localStorage.getItem("login");
    if (user !== username) {
      history.push("/");
      return null;
    }
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
            email: respond.data.data[0].email,
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
        if (respond.data.success) {
          changeIformation((oldvalue) => ({
            ...oldvalue,
            ...respond.data.data[0],
            desc: respond.data.data[0].desc,
          }));
        }
      });

    axios
      .get(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/tags?login=${username}`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success) {
          let activetag = [];
          let inactivetag = [];
          for (let i = 0; i < respond.data.data.length; i++) {
            if (respond.data.data[i].state === "active") {
              activetag.push(respond.data.data[i].tag);
            } else {
              inactivetag.push(respond.data.data[i].tag);
            }
          }
          changeIformation((oldvalue) => ({
            ...oldvalue,
            activetags: activetag,
            inactivetags: inactivetag,
          }));
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
      });

    // eslint-disable-next-line
  }, []);

  const [error, changeError] = useState({
    type: "success",
    msg: "",
    state: false,
  });
  const handleClose = () => {
    changeError({ type: "error", msg: "", state: false });
  };

  //upload and send image
  // eslint-disable-next-line
  // const [img , setState] = useState([userprofil]);
  // let lent = information.image.length;
  let imageHandler = (e, index) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        const data = reader.result;
        const type = data.split(";")[0].split("/")[1];
        // eslint-disable-next-line
        if (type === "jpg" || type === "jpeg" || type === "bmp" || type === "gif" || type === "png") {
          // send image profil
          Axios.post(
            "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/images",
            { img: reader.result },
            {
              headers: {
                Authorization: localStorage.getItem("Authorization"),
              },
            }
          ).then((data) => {
            if (data.data.success) {
              information.image[index] = reader.result;
              changeIformation({ ...information });
              changeError({
                type: "success",
                msg: "Your Image has been sended",
                state: true,
              });
            } else if (data.data.error) {
              changeError({
                type: "error",
                msg: data.data.message,
                state: true,
              });
            }
          });
        } else
          changeError({
            type: "error",
            msg: "Choose a valid image",
            state: true,
          });
      }
    };
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };
  function editposition(){
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        function (position) {
          Axios
          .post(
            "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/position",
            {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
            {
              headers: {
                Authorization: localStorage.getItem("Authorization"),
              },
            }
          )
          .then((result) => {
          });
        });
      }
  }

  const [step, changeStep] = useState(1);
  function deleteimage(index) {
    const name = index.match(/([\w]+\.{1}[\w]+)$/)[0];

    function getdata(data) {
      if (data.data.success) {
        changeError({
          type: "success",
          msg: data.data.message,
          state: true,
        });
      } else if (data.data.error) {
        changeError({ type: "error", msg: data.data.message, state: true });
      }
    }

    axios
      .delete(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/images`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
        data: {
          name: name,
        },
      })
      .then(getdata);
  }
  return (
    <div>
      <UserSearch user={information} setlength={props.setlength} length={props.length}/>
      <div className="containerProfil">
        <Snackbar open={error.state} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={error.type}>
            {error.msg}
          </Alert>
        </Snackbar>
        <main>
          <div className="row">

          <button className="editposition" onClick={editposition}>Update Position</button>
            <div className="left col-lg-4">
              <div className="photo-left">
                <DeleteIcon
                  onClick={(e) => deleteimage(information.image[0])}
                  style={{
                    position: "absolute",
                    top: "145px",
                    left: "151px",
                    fontSize: "40px",
                    color: "firebrick",
                  }}
                />
                {/* eslint-disable-next-line */}
                <img
                  onClick={function () {
                    document.getElementsByClassName("my_fil")[0].click();
                  }}
                  src={information.image[0]}
                  className="photoProfil"
                ></img>
                <input
                  type="file"
                  className="my_fil"
                  onChange={function (event) {
                    imageHandler(event, 0);
                  }}
                ></input>
                <div className="active" />
              </div>
              <h4 className="name">{information.login}</h4>
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
              <div></div>
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
                <li
                  onClick={() => {
                    changeStep(4);
                  }}
                >
                  Edit Password
                </li>
              </ul>
              <div className="row2">
                <SwitchProfil step={step} user={information} changeIformation={changeIformation} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default EditProfil;
