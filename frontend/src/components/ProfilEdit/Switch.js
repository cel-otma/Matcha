import React from "react";
import Tag from "./Tag";
import ViewsInformation from "./ViewsInfo"
import Image from "./Image"

export default function Switch(props) {
    if(props.step === 1) return(<Image user ={props.user} />);
    else if (props.step === 2) return <ViewsInformation user ={props.user}/>;
    else if (props.step === 3) return <Tag user ={props.user}/>;
    return('');
}
