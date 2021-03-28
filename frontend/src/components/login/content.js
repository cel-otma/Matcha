 import React, { useState } from 'react'
 import femaleavatar from "../../icon/female-avatar.svg";
 import Snackbar from '@material-ui/core/Snackbar';
 import MuiAlert from '@material-ui/lab/Alert';
//  import "../style.css"
 import './login.css'
 import {Link} from 'react-router-dom';
import axios from 'axios';
import config from "../../config";


 function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
// if (localStorage.getItem('Authorization') !== undefined) {
//     window.location = '/home';
// }
function Content () {
    const [error,changeError] =  useState({
        type:"success",
        msg:"",
        state:false,
    });

    const [username,setusername] = useState('')
    const [password,setpassword] = useState('')
    const handleClose = () => {
        changeError({type:"error",msg:"",state:false});
    };
    
    let URL = window.location.href.split('?')[1];
    // eslint-disable-next-line 
    if (URL !== '' && URL !== undefined) {
        axios.get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/confirm?" + URL).then((respond) => {
            if (respond.data.success)
            {
                changeError({type:"success",msg : respond.data.message, state:true});
            }
            else
                changeError({type:"error",msg : respond.data.message, state:true});
        });
        window.history.pushState({}, document.title, window.location.href.split('?')[0]);
        URL = '';
    }

    function login(){
        function getdata(data)
        {
            // eslint-disable-next-line 
            if (data.data.success == true) {
                localStorage.setItem('login', username);
                localStorage.setItem('Authorization', data.data.token);
                axios.get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + '/infos?login=' + localStorage.getItem('login'), {
                    headers : {
                        'Authorization' : localStorage.getItem('Authorization')
                    }
                }).then((respond) => {
                    if (respond.data.data.length) {
                        window.location = "/";
                    }else
                        window.location = "/steps";
                });
            }
            else {
                changeError({type:"error",msg : data.data.message,state:true})
            }
        }
        axios.post("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/users/signin", {login:username,passwd:password}).then((getdata));

}
    return(
            <div className="form-cont">
                <div className="inner-form">
                    <img src={femaleavatar} alt="" />
                    
                    <div className="social-login">
                        <span>Social Login</span>
                        <ul>
                            <Link to="#"><i className="fab fa-facebook-square"></i></Link>
                            <Link to="#"><i className="fab fa-google"></i></Link>
                        </ul>
                    </div>

                    <div className="input-area">
                            <div>
                                <i className="fas fa-user"></i>
                                <input name="login" value={username} type="email" placeholder="Username" onChange={(event)=>setusername(event.target.value)} />
  r                          </div>
                            <div>
                                <i className="fas fa-lock"></i>
                                <input name="password" value={password} type="password" placeholder="Password" onChange={(event)=>setpassword(event.target.value)} />
                            </div>
                            <div>
                                <span>Forget Passwoard? <Link to="/forget">Click Here</Link></span>
                            </div>
                            <button className="btn" onClick={login}>Login</button>
                            <span>Don't have account? <Link to="/singup">Register Here</Link></span>
                        <Snackbar open={error.state} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={error.type}>
                                {error.msg}
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            </div>
    )
}
export default Content