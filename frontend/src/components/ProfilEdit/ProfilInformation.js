// eslint-disable-next-line 
import React, {useState} from 'react'
// eslint-disable-next-line 
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import MenuItem from '@material-ui/core/MenuItem';
import city1 from "../city.json"
import City from "../City"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Axios from 'axios';
import config from "../../config";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
const currencies = [
    {
      value: '2',
      label: 'Male',
    },
    {
      value: '1',
      label: 'Female',
    },
  ];
  const currencies1 = [
    {
      value: '2',
      label: 'Male',
    },
    {
      value: '1',
      label: 'Female',
    },
    {
       value: '3',
       label: 'All',
     },
  ];

function ProfilInformation(props) {
    const [gender, setCurrency] = useState((props.user.gendre === 'female') ? 1 : 2);
    let loklfor = (props.user.sex_pref === 'female') ? 1 : (props.user.sex_pref === 'male') ? 2 : 3;
    const [lookingfor, setCurrency1] = useState(loklfor);
    const [city, setcity] = useState(props.user.city);
    const [birthday, setdate] = useState(props.user.birthday);
    const [desc, setdesc] = useState(props.user.desc);
    const [firstname,setfirstname] = useState(props.user.firstname)
    const [lastname,setlastname] = useState(props.user.lastname)
    const [login,setlogin] = useState(props.user.login)
    const [email,setemail] = useState(props.user.email)
   

    function getData(result) {
        if (result.data.success) {
          changeError ({type: "success", msg: result.data.message, state:true});
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
          Axios.patch("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/infos"
          , { city:city, birthday : birthday, gendre : gender, sexpref : lookingfor, desc : desc}, 
          {
            headers : {
              Authorization : localStorage.getItem('Authorization')
            }
          }).then(getData);
          Axios.patch("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/users"
          , {fname:firstname, lname:lastname, email : email, login: login}, 
          {
            headers : {
              Authorization : localStorage.getItem('Authorization')
            }
          }).then(getData);
              // changeError({type:"success",msg:"Your informations has been sended" ,state:true})
              // }

          
      }

    return (
        <>
        <Snackbar open={error.state} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={error.type}>
                {error.msg}
            </Alert>
        </Snackbar>
        <div className="row gallery">
          <div className="row2">
            <div className="Information">
                <TextField
                    className="info"
                    label="Last Name"
                    variant="outlined"
                    name="lastname"
                    value={lastname}
                    onChange={(event)=>setlastname(event.target.value)} 
                    
                />
                <TextField
                    className="info"
                    label="First Name"
                    variant="outlined"
                    name="firstname"
                    value={firstname}
                    onChange={(event)=>setfirstname(event.target.value)} 
                />
            </div>
            <div className="Information">
                <TextField
                    className="info"
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={email}
                    onChange={(event)=>setemail(event.target.value)} 
                />
                <TextField
                    className="info"
                    label="Username"
                    variant="outlined"
                    name="login"
                    value={login}
                    onChange={(event)=>setlogin(event.target.value)}
                />
            </div>
                <div className="information">
                    <div className="col-md-4">
                        <City 
                            city={city1} 
                            cityOwner={city1.indexOf(city)}
                            change={setcity}
                        />
                    </div>
                
                    <div className="col-md-4">
                        <TextField
                            id="outlined-select-currency"
                            select
                            label="Gender"
                            value={gender}
                            name="gender"
                            onChange={(event) => {
                                setCurrency(event.target.value);}}
                            variant="outlined">
                            {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>  
                </div>
                
                <div className="information">
                    <div className="col-md-4">
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Looking For:"
                        value={lookingfor}
                        name="lookingfor"
                        onChange={(event) => {
                            setCurrency1(event.target.value);}}
                        variant="outlined">
                        {currencies1.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    </div> 
                    <div className="col-md-4">
                        <TextField
                            id="date"
                            label="Birthday"
                            type="date"
                            name="birthday"
                            value={birthday}
                            onChange={(event)=>setdate(event.target.value)}   
                        />
                    </div> 
                </div>
                <div className="information">
                    <div className="col-md-4">
                        <TextareaAutosize style={{width:"100%", height:"100px", textAlign:"center"}}
                            id="biography"
                            name="desc"
                            value={desc}
                            onChange={(event)=>setdesc(event.target.value)}
                        />
                    </div> 
                </div>
                <div className="ContentInput">
                    <button id="change" onClick={valider}>Change</button>
                </div>
            
           </div>
        </div>
        </>
    )
}
export default ProfilInformation