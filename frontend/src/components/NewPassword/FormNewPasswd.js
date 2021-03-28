import React, { useState } from "react";
import recoverpassword from "../../icon/recover password.svg";
import "../style.css";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import config from "../../config";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function FormNewPasswd() {
  const [password, setpassword] = useState("");
  const [rpassword, setrpassword] = useState();

  const [error, changeError] = useState({
    type: "success",
    msg: "",
    state: false,
  });
  const handleClose = () => {
    changeError({ type: "error", msg: "", state: false });
  };
  // eslint-disable-next-line
  // if (URL !== '' && URL !== undefined) {
  //     axios.get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/changepasswd?" + URL).then((respond) => {
  //         if (respond.data.success)
  //         {
  //             changeError({type:"success",msg : respond.data.message, state:true});
  //         }
  //         else
  //             changeError({type:"error",msg : respond.data.message, state:true});
  //     });
  //     window.history.pushState({}, document.title, window.location.href.split('?')[0]);
  //     URL = '';
  // }

  function change() {
    // eslint-disable-next-line
    if (password === "" || rpassword === "" || (password === "" && rpassword === "")) {
      changeError({
        type: "error",
        msg: "Empty password or Repeat password",
        state: true,
      });
      // eslint-disable-next-line
    } else if (password !== rpassword) {
      changeError({
        type: "error",
        msg: "Passwords doesn't match",
        state: true,
      });
    } else if (!/[A-Z]+/.test(password) || !/[a-z]+/.test(password) || !/[0-9]+/.test(password) || !/[\W]+/.test(password)) {
      changeError({
        type: "error",
        msg: "Password must contain uppercase letter, lowercase letter, number and special character",
        state: true,
      });
    } else if (password.length < 8) {
      changeError({
        type: "error",
        msg: "Password must contain 8 caracter",
        state: true,
      });
    } else {
      axios
        .post("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/users/changepasswd?" + window.location.href.split("?")[1], { passwd: password, rpasswd: password })
        .then((respond) => {
          if (respond.data.success) {
            changeError({ type: "success", msg: respond.data.message, state: true });
            window.location = "/singin";
          } else changeError({ type: "error", msg: respond.data.message, state: true });
        });
      // changeError({type:"success",msg:"Your password has been updated " ,state:true})
      //   window.location = "/singin";
    }
  }
  return (
    <div className="form-cont">
      <Snackbar open={error.state} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={error.type}>
          {error.msg}
        </Alert>
      </Snackbar>
      <div className="inner-form">
        <h3 style={{ color: "white", fontSize: "25px" }}>Recover Password</h3>
        <img src={recoverpassword} alt="" />
        <div className="input-area">
          <span>New Password</span>
          <div>
            <i className="fas fa-lock"></i>
            <input type="password" placeholder="New Password" name="password" value={password} onChange={(event) => setpassword(event.target.value)} />
          </div>
          <span>Repeat Password</span>
          <div>
            <i className="fas fa-lock"></i>
            <input type="password" placeholder="Repeat Password" name="rpassword" value={rpassword} onChange={(event) => setrpassword(event.target.value)} />
          </div>
          <button className="btn" onClick={change}>
            recover
          </button>
        </div>
      </div>
    </div>
  );
}
