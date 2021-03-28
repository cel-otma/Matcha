import React from "react";
import ProfilInformation from "./ProfilInformation";
import UploadImage from "../profl_information/UploadImage";
import EditPasword from "./EditPasword";
import TagseEdit from "./TagseEdit";

export default function SwitchProfil(props) {
  if (props.step === 1) return <UploadImage user={props.user} />;
  else if (props.step === 2) return <ProfilInformation user={props.user} changeIformation={props.changeIformation} />;
  else if (props.step === 3) return <TagseEdit user={props.user} />;
  else if (props.step === 4) return <EditPasword />;
  return "";
}
