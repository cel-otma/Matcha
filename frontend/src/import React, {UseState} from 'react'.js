import React, {UseState} from 'react'
import image from "./img/avatar3.png"
import { useState } from "react"
import DeleteIcon from '@material-ui/icons/Delete';
import Axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import config from "../../config";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
 }

function UploadImage() {
    const [error,changeError] =  useState({
        type:"success",
        msg:"",
        state:false,
    });
    const handleClose = () => {
        changeError({type:"error",msg:"",state:false});
      };
  
      //upload and send image
    const [img , setState] = useState([{src:image,default:0}, {src:image,default:0}, {src:image,default:0}, {src:image,default:0},{src:image,default:0}]);
    function change(){
        // send image profil
        Axios.post("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/images"
        , {img:img.filter(item=>item.default == 1)}, 
        {
           headers : {
              Authorization : localStorage.getItem('Authorization')
           }
        }).then((data)=>{
           if (data.data.success) {
              
              changeError ({type: "success", msg: "Your Image has been sended", state:true});
        }else if (data.data.error) {
              changeError ({type: "error", msg: data.data.message, state:true});
        } 
           
        });
    }
    let imageHandler = (e,index) => {
        const reader = new FileReader();
        reader.onload = () => {
                  if(reader.readyState === 2)
                  {
                     const data = reader.result;
                     const type = data.split(';')[0].split('/')[1];
                     if(type == "jpg" || type == "jpeg" || type == "bmp" || type == "gif" || type == "png")
                     {
                        img[index].src = reader.result;
                        img[index].default = 1
                        setState([...img])
                     }
                  else 
                     changeError ({type: "error", msg: "Choose a valid image", state:true});
                     
                  }
         }
         if(e.target.files[0])
            reader.readAsDataURL(e.target.files[0])
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
                        <div className="col-md-4">
                        <DeleteIcon style={{position:'absolute',top:'10px',left:'30px',fontSize:'40px',  color:"firebrick"}}/>
                            <img src={img[0].src}  onClick={function () {document.getElementsByClassName("my_file1")[0].click()}}></img>
                            <input type="file" className="my_file1" onChange={function (event) {
                                imageHandler(event,0)}}></input>
                        </div>
                        <div className="col-md-4">
                        <DeleteIcon style={{position:'absolute',top:'10px',left:'30px',fontSize:'40px',  color:"firebrick"}}/>
                        <img src={img[1].src}  onClick={function () {document.getElementsByClassName("my_file1")[1].click()}}></img>
                            <input type="file" className="my_file1" onChange={function (event) {
                                imageHandler(event,1)}}></input>
                        </div>
                        <div className="col-md-4">
                        <DeleteIcon style={{position:'absolute',top:'10px',left:'30px',fontSize:'40px',  color:"firebrick"}}/>
                        <img src={img[2].src}  onClick={function () {document.getElementsByClassName("my_file1")[2].click()}}></img>
                            <input type="file" className="my_file1" onChange={function (event) {
                                imageHandler(event,2)}}></input>
                        </div>
                        <div className="col-md-4">
                        <DeleteIcon style={{position:'absolute',top:'10px',left:'30px',fontSize:'40px',  color:"firebrick"}}/>
                        <img src={img[3].src}  onClick={function () {document.getElementsByClassName("my_file1")[3].click()}}></img>
                            <input type="file" className="my_file1" onChange={function (event) {
                                imageHandler(event,3)}}></input>
                        </div>
                    </div>
                </div>
                <div className="ContentInput">
                    <button id="change" onClick={change}>Change</button>
                </div>
            </>
    )
}
export default UploadImage
