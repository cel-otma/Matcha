import React from 'react'

function Image(props) {
    return (
        <div className="gallery">
            <div className="row1">
            {props.user.image.map((value, key)=>
            value !== props.user.image[0]?
                <div className="col-md-4" key={key}>
                      {/* eslint-disable-next-line */}
                    <img src={value} />
                </div>
                :""
            )
            }
                </div>
            </div>
    )
}
export default Image