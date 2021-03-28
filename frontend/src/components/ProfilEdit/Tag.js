import React from 'react'

function Tag(props) {
    
    return (
            <div className="gallery">
                <label>Tags: </label>
                <div className="tags" > 
                    {props.user.activetags.map((value, key)=>
                            <p key={key}>#{value}</p>
                    )
                    }
                </div>
            </div>
    )
}
export default Tag