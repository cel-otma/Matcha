import React, {useState}  from'react'
import manar from "./img/manar.jpg"
import StarIcon from '@material-ui/icons/Star';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ReportIcon from '@material-ui/icons/Report';
import BlockIcon from '@material-ui/icons/Block';
import FavoriteIcon from '@material-ui/icons/Favorite';
import back from "../home/img/profilImage.jpeg"
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

 function CardProfil() {
    const [img , setState] = useState([manar]);
    let imageHandler = (e,index) => {
    const reader = new FileReader();
    reader.onload = () =>{
        if(reader.readyState === 2){
            img[index] = reader.result
            setState([...img])
        }
    }
    reader.readAsDataURL(e.target.files[0])
    }
    return (
        <>
            <div className="cardProfil" >
            <img className="imageProfil2" src={back}></img>
                
                <div className="image">
                    {/* <img src={manar}></img> */}
                        <img src={img[0]} id="image" onClick={function () {document.getElementsByClassName("my_fil")[0].click()}}></img>
                        <input type="file" className="my_fil" onChange={function (event) {
                        imageHandler(event,0)}}></input>
                        <DeleteForeverIcon className="deletIcon"/>
                </div>
                <div className="titleCardProfil">
                    <h1> </h1>
                </div>
                <div className="FriendsViews">
                    <div className="Friends">
                        <SupervisorAccountIcon />
                        <span>200</span>
                    </div>
                    <hr></hr>
                    <div className="Views">
                    <StarIcon style={{color:'#ffb400'}}/>
                        <span>185</span>
                    </div>
                </div>
                
                <div className="des"> 
                    <p>
                    Un profil personnel ou une accroche en outer un titre ou un résumé personnel sur son CV. 
                    </p>
                </div>
                <div className="option">
                <div style={{color:'brown'}}> <ReportIcon/> </div>
                <div style={{color:'orange'}}> <BlockIcon/> </div>
                <div style={{color:'red'}}> <FavoriteIcon/> </div>
                </div>
            </div>
        </>
    )
}
export default CardProfil