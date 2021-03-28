import React, {useState}from 'react'
import femaleavatar from "../../icon/female-avatar.svg";
import './login.css'
import {Link} from 'react-router-dom';
import Axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import config from "../../config";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Formcontent () {

    const [error,changeError] =  useState({
        type:"success",
        msg:"",
        state:false,
    });
    const handleClose = () => {
        changeError({type:"error",msg:"",state:false});
      };
    const [firstname,setfirstname] = useState('')
    const [lastname,setlastname] = useState('')
    const [login,setlogin] = useState('')
    const [email,setemail] = useState('')
    const [password,setpassword] = useState('')
    const [rpassword,setrpassword] = useState('')
    function signup(){
        function getdata(data)
        {
            if (data.data.success) {
                changeError ({type: "success", msg: "You're account is created successfully, please Validate your email", state:true});
            }else if (data.data.error) {
                changeError ({type: "error", msg: data.data.message, state:true});
            }
            // alert(data.data.success + "/" + data.data.error  + "/" + data.data.message)
        }
        // eslint-disable-next-line 
        if(login == '' || firstname == '' || lastname == '' || email == '' || password == '' || rpassword == ''){
            changeError ({type: "error", msg: "Fill  all areas", state:true});
        }
        else if (/[^A-Za-z0-9]+/.test(login) || login.length < 4){
            changeError ({type: "error", msg: (login.length < 4) ? "Username too short" : "Username accept alphabet and number", state:true});
            // alert((login.length < 4) ? "login too short" : "login accept alphabet and number");
        }
        else if (/[^A-Za-z]+/.test(firstname)) {
            changeError ({type: "error", msg: "Firstname accept alphabet", state:true});
        }
        // eslint-disable-next-line 
        else if (!/^([A-Za-z]+[\ ]{0,1}[A-Za-z]*)$/.test(lastname)) {
            changeError ({type: "error", msg: "Lastname accept alphabet and only 1 space", state:true});
        }
        // eslint-disable-next-line 
        else if (!/^[A-Za-z0-9\.]+\@[A-Za-z0-9]+\.[A-Za-z0-9]+$/.test(email)) {
            changeError ({type: "error", msg: "Email invalid", state:true});
        }
        // eslint-disable-next-line 
        else if (password !== rpassword) {
            changeError ({type: "error", msg: "Passwords doesn't match", state:true});
        }
        else if (!/[A-Z]+/.test(password) || !/[a-z]+/.test(password) || !/[0-9]+/.test(password) || !/[\W]+/.test(password)) {
            changeError ({type: "error", msg: "Password must contain uppercase letter, lowercase letter, number and special character", state:true});
        }
        else if (password.length < 8){
            changeError ({type: "error", msg: "Password must contain 8 caracter", state:true});
        }
        else{
            Axios.post("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/users/signup",{fname:firstname, lname:lastname, login: login, email : email, passwd : password, rpasswd : rpassword}).then(getdata)
            // changeError({type:"success",msg:"Your accent has been created check your email" ,state:true}) 
        }
            
    }
   return(
           <div className="form-cont">
               <div className="inner-form">
                   <h2>Create Account</h2>
                   <img src={femaleavatar} alt = "" />
                   <Snackbar open={error.state} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={error.type}>
                                {error.msg}
                            </Alert>
                    </Snackbar>
                   <div className="input-area">
                       <div>
                               <i className="fas fa-user"></i>
                               <input type="text" name="firstname" value={firstname} placeholder="First name" onChange={(event)=>setfirstname(event.target.value)}/>
                           </div>
                           <div>
                               <i className="fas fa-user"></i>
                               <input type="text" name="lastname" value={lastname} placeholder="Last name" onChange={(event)=>setlastname(event.target.value)}/>
                           </div>
                           <div>
                               <i className="fas fa-envelope"></i>
                               <input type="email"  name="email" value={email} placeholder="Email" onChange={(event)=>setemail(event.target.value)}/>
                           </div>
                           <div>
                           <i className="fas fa-user"></i>
                               <input type="text" name="login" value={login} placeholder="Username" onChange={(event)=>setlogin(event.target.value)}/>
                           </div>
                           <div>
                               <i className="fas fa-lock"></i>
                               <input type="password" name="password" value={password} placeholder="Password" onChange={(event)=>setpassword(event.target.value)}/>
                           </div>
                           <div>
                               <i className="fas fa-lock"></i>
                               <input type="password" name="rpassword" value={rpassword} placeholder="Repeat Password" onChange={(event)=>setrpassword(event.target.value)}/>
                           </div>
                           <button className="btn" onClick={signup}>Register</button>
                           <span>have account? <Link to="/singin">Connect Here</Link></span>
                   </div>
               </div>
           </div>
   )
}
export default Formcontent