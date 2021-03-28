import React from 'react'
import UserSearch from "../home/UserSearch"
import ListBlock from './ListBlock'
import FreindsOnlineList from './FreindsOnlineList'

export default function Freinds(props) {

    return (
        <div>
            <UserSearch setlength={props.setlength} length={props.length}/>
            <div className="containerchat clearfix">
                
            <FreindsOnlineList />
            <ListBlock />
            </div>
        </div>
    )
}
