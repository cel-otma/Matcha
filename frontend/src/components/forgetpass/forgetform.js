import React, {useState} from 'react'
import forgetpassword from "../../icon/forgot_password.svg";
import "../style.css";
// eslint-disable-next-line 
import {Link} from 'react-router-dom';
import Axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import config from "../../config";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}



function Forgetform() {

    const [email, setemail] = useState('')

    const [error,changeError] =  useState({
        type:"success",
        msg:"",
        state:false,
    });
    const handleClose = () => {
        changeError({type:"error",msg:"",state:false});
      };

    function send(){
        function getdata(result) {
            if (result.data.success) {
              changeError ({type: "success", msg: result.data.message, state:true});
                    window.location.href= "/Singin"
            }else {
              changeError ({type: "error", msg: result.data.message, state:true});
            }
          }
        // eslint-disable-next-line 
        if(email == '' ){
            changeError ({type: "error", msg: "Empty email", state:true});
            // eslint-disable-next-line 
        }else if (!/^[A-Za-z0-9.]+\@[A-Za-z0-9]+\.[A-Za-z0-9]+$/.test(email)){
            changeError ({type: "error", msg: "Email invalid", state:true});
        }
        else{
            Axios.post("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/users/reset/password",{email:email}
            ).then(getdata)
            // changeError({type:"success",msg:"Please check your email" ,state:true}) 
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
                    <h3 style={{color:'white', fontSize:'25px'}}> Forget Password</h3>
                    <img src={forgetpassword} alt="" />
                    <div className="input-area">
                            <div>
                                <i className="fas fa-configelope"></i>
                                <input type="email" placeholder="Email" value={email} name="email" onChange={(event)=>setemail(event.target.value)}/>
                            </div>
                            <button className="btn" onClick={send}>Send</button>
                    </div>
                </div>
            </div>
    )
}
export default Forgetform