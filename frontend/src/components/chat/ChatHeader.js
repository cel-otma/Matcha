import React from "react";

export default function ChatHeader(props) {
  const { firstname, lastname, image } = props.information.length > 0 ? props.current : { firstname: "", lastname: "", image: "", user_id: 0 };
  return (
    <div className="chat-header clearfix" id="chat-header">
      <i
        className="fa fa-list"
        id="back"
        onClick={() => {
          document.getElementsByClassName("people-list")[0].style.display = "block";
        }}
      >
        {" "}
      </i>
      <img src={image} alt="avatar" />
      <div className="chat-about">
        <div className="chat-with">
          Chat with {firstname} {lastname}
        </div>
        {/* <div className="chat-num-messages">already 1 902 messages</div> */}
      </div>
      <i className="fa fa-star" />
    </div>
  );
}
