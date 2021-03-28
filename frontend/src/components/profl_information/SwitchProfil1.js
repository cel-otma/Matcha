import React, { useState } from 'react'
import Information from './Information';
import Tags from "../profl_information/Tags"
export default function SwitchProfil1(props) {

    const [nextEtape, setnextEtape] = useState(false)


const goToTag = () =>{
setnextEtape(true);
}

        if (props.step1 === 1) return (<Information update={goToTag} />);
        else if (props.step1 === 2 && nextEtape === true) return (<Tags />);
    return('');
}
