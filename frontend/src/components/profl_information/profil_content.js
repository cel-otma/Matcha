// eslint-disable-next-line 
import React, {useState} from 'react'
import "../ProfilEdit/EditProfil.css"
import userprofil from "../profl_information/img/userprofil.jpg"
import SwitchProfil1 from  "./SwitchProfil1"
import DeleteIcon from '@material-ui/icons/Delete';
import Axios from 'axios';
import config from "../../config";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
   return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Profil_content() {

   const [error,changeError] =  useState({
      type:"success",
      msg:"",
      state:false,
  });
  const handleClose = () => {
      changeError({type:"error",msg:"",state:false});
    };

    //upload and send image
    // eslint-disable-next-line 
   const [img , setState] = useState([userprofil]);
   const [path, setpath]=useState('');
   let imageHandler = (e,index) => { 
     const reader = new FileReader();
     reader.onload = () => {
               if(reader.readyState === 2)
               {
                  const data = reader.result;
                  const type = data.split(';')[0].split('/')[1];
                  // eslint-disable-next-line 
                  if(type == "jpg" || type == "jpeg" || type == "bmp" || type == "gif" || type == "png")
                  {
                     // send image profil
                     Axios.post("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/images"
                     , {img:reader.result}, 
                     {
                        headers : {
                           Authorization : localStorage.getItem('Authorization')
                        }
                     }).then((data)=>{
                        setpath(data.data.path)

                        if (data.data.success) {
                           document.getElementById('myimg').src = "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + config.SERVER_IMGS + data.data.path;
                           changeError ({type: "success", msg: "Your Image has been sended", state:true});
                        }else if (data.data.error) {
                              changeError ({type: "error", msg: data.data.message, state:true});
                        } 
                        
                     });
                     }
               else 
                  changeError ({type: "error", msg: "Choose a valid image", state:true});
                  
               }
      }
      if(e.target.files[0])
         reader.readAsDataURL(e.target.files[0])
      }

      function deleteimage(index){
        
         const name = path;
         Axios
         .delete(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/images`, {
           headers: {
             Authorization: localStorage.getItem("Authorization"),
           },
           data: {
             name: name,
           },
         })
         .then((data) =>{
            if (data.data.success) {
               document.getElementById("myimg").src = userprofil;
               changeError ({type: "success", msg:  data.data.message, state:true});
            }else if (data.data.error) {
                  changeError ({type: "error", msg: data.data.message, state:true});
            } 
         });
      }


     const [step1,changeStep1] = useState(1);
     
     return (
         <div>
         <div className="containerProfil"> 
         <Snackbar open={error.state} autoHideDuration={6000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity={error.type}>
                     {error.msg}
                  </Alert>
         </Snackbar>
         <main>
               <div className="row">
                  <div className="left col-lg-4">
                     <div className="photo-left">
                        <DeleteIcon style={{position:'absolute',top:'145px',left:'151px',fontSize:'40px', color:"firebrick"}} onClick={()=>deleteimage (img[0])} />
                        {/* eslint-disable-next-line  */}
                        <img src={img[0]} id="myimg" className="photoProfil" onClick={function () {document.getElementsByClassName("my_fil")[0].click()}}></img>
                                 <input   type="file"
                                          className="my_fil" 
                                          onChange={function (event) {
                                          imageHandler(event,0)}}
                                 ></input>
                         <div className="active" />
                        </div>
                  </div>
                  <div className="right col-lg-8">
                     <ul className="nave">
                     <li onClick={ () => {
                        changeStep1(1)
                           }}>Information</li>
                     <li onClick={ () => {
                        changeStep1(2)
                           }}>Tags</li>
                     </ul>
                     <div className="row2">
                     <SwitchProfil1 step1 = {step1}/>
                     {/* <div className="ContentInput">
                           <button id="Validet">Validet</button>
                     </div> */}
                     </div>
                  </div>
               </div>
           </main>
       </div>
       </div>
     )
}
