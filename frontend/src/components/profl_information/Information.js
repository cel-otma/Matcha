 // eslint-disable-next-line
import React, {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Axios from 'axios';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import city1 from "../city.json"
import City from "../City"
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
      value: '1',
      label: 'Female',
    },
    {
      value: '2',
      label: 'Male',
    },
    
    {
       value: '3',
       label: 'All',
     },
  ];

export default function Information(props) {
    const [gender, setCurrency] = useState("");
    const [lookingfor, setCurrency1] = useState("");
    const [city, setcity] = useState("Khouribga");
    const [birthday, setdate] = useState('2021-12-02');
    const [desc, setdesc] = useState();

    function getData(result) {
      if (result.data.success) {
        changeError ({type: "success", msg: result.data.message, state:true});
          props.update();
      }else {
        changeError ({type: "error", msg: result.data.message, state:true});
        // alert(result.data.message);
        if( result.data.message === "Already have information !!")
        props.update();
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
      if (birthday == undefined || birthday == '') {
        changeError ({type: "error", msg: "Birthday empty", state:true});
        // eslint-disable-next-line 
      }else if (city == undefined || city == '') {
        changeError ({type: "error", msg: "City empty", state:true});
        // eslint-disable-next-line 
      }else if (lookingfor == undefined || lookingfor == ''
      || lookingfor > 3 || lookingfor < 1) {
        changeError ({type: "error", msg: "Lookingfor empty", state:true});
        // eslint-disable-next-line 
      }else if (gender == undefined || gender == ''
      || gender > 2 || gender < 1) {
        changeError ({type: "error", msg: "Gender empty", state:true});
        // eslint-disable-next-line 
      }else if (desc == undefined || desc == '') {
        changeError ({type: "error", msg: "Description empty", state:true});

      }
      else {
        Axios.post("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/infos"
        , {city:city, birthday : birthday, gendre : gender, sexpref : lookingfor, desc : desc}, 
        {
          headers : {
            Authorization : localStorage.getItem('Authorization')
          }
        }).then(getData);
            // changeError({type:"success",msg:"Your informations has been sended" ,state:true})
      }
        
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
      </div>
      <div className="ContentInput">
              <button id="Validet" onClick={valider}>Validet</button>
        </div>
      </div>
    </div>
</>
)
}
