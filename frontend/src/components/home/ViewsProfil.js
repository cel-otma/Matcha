import React from 'react'
import manar from "../ProfilEdit/img/manar.jpg"
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import UserSearch from "../home/UserSearch"
import imge from "../profl_information/img/avatar3.png"
import back from "../home/img/profilImage.jpeg"
import StarIcon from '@material-ui/icons/Star';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ReportIcon from '@material-ui/icons/Report';
import BlockIcon from '@material-ui/icons/Block';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Rating from '@material-ui/lab/Rating';

function ViewsProfil() {
    const [value, setValue] = React.useState(0);
    return (
        <div className="TopContent">
        < UserSearch />
        <div className="AllContent">
        <div className="LeftContent">
            {/* <CardProfil /> */}

            <div className="cardProfil" >
                <img className="imageProfil2" src={back}></img>
                    <div className="image">
                        <img src={manar}></img>
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
            <div>
                <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    />
            </div>
                    
        </div>

        </div>
        <div className="RigthContent">
        <div>
            <h1>Edit Information</h1>
        </div>
            <div className="EditContentInformation">
            <div className="ContentInput">
                <TextField
                    className="info"
                    label="Last Name"
                    variant="outlined"
                    name="LastName"
                    disabled="true"
                />
                <TextField
                    className="info"
                    label="First Name"
                    variant="outlined"
                    name="LastName"
                    disabled="true"
                />
            </div>
       
            <div className="ContentInput">
                <TextField
                    className="info"
                    label=" Email"
                    variant="outlined"
                    name="LastName"
                    disabled="true"
                />
                <TextField
                    className="info"
                    label="Username"
                    variant="outlined"
                    name="LastName"
                    disabled="true"
                />
            </div>
            <div className="ContentInput">
                <TextField
                className="info"
                label=" City"
                variant="outlined"
                name="LastName"
                disabled="true"
                />
                <TextField
                    id="date"
                    label="Birthday"
                    type="date"
                    defaultValue="2017-05-24"
                    disabled="true"
                />
            </div>
            <div className="ContentInput">
                <FormLabel component="legend"  >Looking For</FormLabel>
                <RadioGroup aria-label="gender" name="gender1" >
                    <FormControlLabel value="female" control={<Radio />} label="Female" disabled="true" />
                    <FormControlLabel value="male" control={<Radio />} label="Male" disabled="true"/>
                    <FormControlLabel  value="Mix" control={<Radio />} label="Mix" disabled="true"/>
                </RadioGroup>
                <div style={{display:"flex",alignItems:"center"}}>
                                <FormLabel component="legend" style={{marginRight:'70px'}}> Gender</FormLabel>
                <RadioGroup aria-label="gender" name="gender1" >
                    <FormControlLabel value="female" control={<Radio />} label="Female" disabled="true" />
                    <FormControlLabel value="male" control={<Radio />} label="Male"  disabled="true"/>
                </RadioGroup>
                </div>

            </div>
            <div className="ContentInput">
                <TextareaAutosize className="textarea"
                    placeholder="Bio"
                    disabled="true"
                />
            </div>
            <div className="ContentInput" disabled="true" style={{width:'100%', height:'150px'}}>
                <label>List interests</label>
                <p> #jbijkb #jbhfiofg #jbdfijubi #uhdfiubhi #jbibi #uhbdfubh

                </p>
            </div>
            <div className="ContentInput">
                <label>Your Images</label>
                {/* <UploadImage /> */}
                <div className="imageUpload">
                    <div className="image_select">
                        <img src={imge} ></img>
                    </div>
                    <div className="image_select">
                        <img src={imge} ></img>
                    </div>
                    <div className="image_select">
                        <img src={imge} ></img>
                    </div>
                    <div className="image_select">
                        <img src={imge} ></img>
                    </div>
                </div>
            </div>
            </div>
            
        </div> 
        </div>
        
    </div>
    )
}
export default ViewsProfil
