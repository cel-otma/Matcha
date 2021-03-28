import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import config from "../../config";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function EditPasword() {


    const [password,setpassword] = useState('')
    const [rpassword,setrpassword] = useState('')
    const [OldPassword, setoldPassword] = useState("")

    function getData(result) {
        if (result.data.success) {
          changeError ({type: "success", msg: "Your Password has been Change", state:true});
                localStorage.removeItem('Authorization')
                localStorage.removeItem('login')
                window.location.href= "/Singin"
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
        if ((password == undefined || password == '') || (rpassword == undefined || rpassword == '') || (OldPassword == undefined || OldPassword == '')) {
          changeError ({type: "error", msg: "Please Fill all areas", state:true});
        }
        // eslint-disable-next-line 
        else if (password !== rpassword) {
            changeError ({type: "error", msg: "Password And Repeat password doesn't match", state:true});
        }
        else if (!/[A-Z]+/.test(password) || !/[a-z]+/.test(password) || !/[0-9]+/.test(password) || !/[\W]+/.test(password)) {
            changeError ({type: "error", msg: "Password must contain uppercase letter, lowercase letter, number and special character", state:true});
        }
        else if (password.length < 8){
            changeError ({type: "error", msg: "Password must contain 8 caracter", state:true});
        }
        else {
          Axios.post("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/users/update/password"
          , {npasswd:password, rpasswd : rpassword, oldpasswd : OldPassword}, 
          {
            headers : {
              Authorization : localStorage.getItem('Authorization')
            }
          }).then(getData);
            //   changeError({type:"success",msg:"Your informations has been sended" ,state:true})
        }
          
      }

    return (
        <>
        <Snackbar open={error.state} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={error.type}>
                    {error.msg}
                </Alert>
        </Snackbar>
            <div className="gallery">
                <div className="row2">
                    <div className="ContentInput">
                    <TextField
                            
                            className="info"
                            label="Old Password"
                            type={'password'}
                            variant="outlined"
                            name="OldPassword"
                            value={OldPassword}
                            onChange={(event)=>setoldPassword(event.target.value)}
                        />
                        <TextField
                            className="info"
                            label="Password"
                            type={'password'}
                            variant="outlined"
                            name="Password"
                            value={password}
                            onChange={(event)=>setpassword(event.target.value)}
                        />
                        <TextField
                            className="info"
                            label="Repeat Password"
                            type={'password'}
                            variant="outlined"
                            name="rpassword"
                            value={rpassword}
                            onChange={(event)=>setrpassword(event.target.value)}
                        />
                    </div>
                    
                </div>    
            </div>
            <div className="ContentInput">
                <button id="change" onClick={valider}>Change</button>
            </div>
        </>
    )
}
export default EditPasword