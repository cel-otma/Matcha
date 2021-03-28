// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import config from "../../config";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function UploadImage(props) {
  const [error, changeError] = useState({
    type: "success",
    msg: "",
    state: false,
  });
  const handleClose = () => {
    changeError({ type: "error", msg: "", state: false });
  };
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
    <>
      <Snackbar
        open={error.state}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={error.type}>
          {error.msg}
        </Alert>
      </Snackbar>
      <div className="gallery">
        <div className="row1">
          {props.user.image.map((value, key) => {
            if (value !== props.user.image[0]) {
              return (
                <div className="col-md-4" key={key}>
                  <DeleteIcon
                    onClick={(e) => deleteimage(value)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "4px",
                      fontSize: "40px",
                      color: "firebrick",
                    }}
                  />
                  <img src={value} alt="rien" />
                </div>
              );
            }
            return true;
          })}
        </div>
      </div>
    </>
  );
}
export default UploadImage;
