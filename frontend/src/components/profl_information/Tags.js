import React, {useState} from 'react'
import {Select} from "../profl_information/select"
import Axios from 'axios';
import config from "../../config";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import interest from "../interests.json"

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Tags() {
    const [tag, settag] = useState([]);
    function getData(result) {
        if (result.data.success) {
          changeError ({type: "success", msg: "tags is added successfully", state:true});
          window.location.href = "/"
        }else {
          changeError ({type: "error", msg: result.data.message, state:true});
        }
      }
      
      const [error,changeError] =  useState({
        type:"success",
        msg:"",
        state:false,
    });
    const handleClose = () => {
        changeError({type:"error",msg:"",state:false});
      };

      function valider(){
        // eslint-disable-next-line 
        if (tag == undefined || tag == '') {
          changeError ({type: "error", msg: "Tags empty", state:true});
        }
        else {
          let tags = String(tag).split(',');
          Axios.post("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/tags"
          , {tags: JSON.stringify(tags)},
          {
            headers : {
              Authorization : localStorage.getItem('Authorization')
            }
          }).then(getData);
        }
      }
    return (
        <div>
          <Snackbar open={error.state} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={error.type}>
                        {error.msg}
                    </Alert>
            </Snackbar>
            <Select
            list={interest.data}
            active={tag}
            change = {(value)=>{settag(value)}}
            />
            <div className="ContentInput">
            <button id="Validet" onClick={valider}>Validet</button>
            </div>
        </div>
    )
}
