import React from "react";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";

export default function ChatHistory(props) {
  // const [msg, changeMsg] = useState([]);

  return (
    <div>
      {props.current !== undefined
        ? props.message.map((message, index) => {
            if (message.user_id === props.current.user_id)
              return (
                <div key={index}>
                  <OtherMessage message={message} />
                </div>
              );
            else
              return (
                <div key={index}>
                  <MyMessage message={message} />
                </div>
              ); // eslint-disable-next-line
          })
        : 0}
    </div>
  );
}
