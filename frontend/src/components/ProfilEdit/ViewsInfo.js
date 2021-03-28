import React from 'react'
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
// eslint-disable-next-line 
import MenuItem from '@material-ui/core/MenuItem';

function ViewsInfo(props) {
    // const [currency, setCurrency] = useState("");
    //      const handleChange = (event) => {
    //      setCurrency(event.target.value);}
    return (
        <div className="row gallery">
          <div className="row2">
            <div className="Information">
                <TextField
                    className="info"
                    label="Last Name"
                    variant="outlined"
                    name="LastName"
                    value={props.user.lastname}
                    disabled
                />
                <TextField
                    className="info"
                    label="First Name"
                    variant="outlined"
                    name="LastName"
                    value={props.user.firstname}
                    disabled
                />
            </div>
            
                <div className="information">
                  <div className="col-md-4">
                    <TextField
                        label="City"
                        variant="outlined"
                        name="city"
                        value={props.user.city}
                        disabled
                    />
                </div>
                
                <div className="col-md-4">
                <TextField
                    
                    label="Gender"
                    value={props.user.gender}
                    disabled
                    variant="outlined"
                />
                </div>  
                </div>
                
                <div className="information">
                <div className="col-md-4">
                <TextField
                    
                    variant="outlined"
                    label="Looking For:"
                    value={props.user.lookingfor}
                    disabled
                />
                </div> 
                <div className="col-md-4">
                <TextField
                    id="date"
                    label="Birthday"
                    type="date"
                    value={props.user.date}
                    disabled
                />
                </div> 
            </div>
            <div className="information">
                    <div className="col-md-4">
                        <TextareaAutosize style={{width:"100%", height:"100px", textAlign:"center"}}
                            id="biography"
                            value={props.user.desc}
                            disabled
                        />
                    </div> 
                </div>
           </div>
        </div>
    )
}
export default ViewsInfo