import React from 'react'
import NotFund from "../icon/NotFund.svg"

export default function NotFound() {
    return (
        <div className="container" style={{display:'flex', flexWrap:'wrap'}}>
            
            <img src={NotFund} style={{position:'absolute', width:'50%', right:'28%'}} alt="ia=mage"></img>
            <h2 id="notFund">Page Not Fund</h2>
        </div>
    )
}
