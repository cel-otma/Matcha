import React, {useEffect, useState} from 'react'
import "../chat/chat.css"
import FreindOnline from './FreindOnline'
import search from '../chat/search';
import config from "../../config";
import axios from "axios";
import userprofil from "../profl_information/img/userprofil.jpg";


export default function FreindsOnlineList(props) {
    function handleChange () {
        search()
    }
  const [information, changeIformation] = useState([]);

    useEffect(() => {
        axios
          .get(
            "http://" +
              config.SERVER_HOST +
              ":" +
              config.SERVER_PORT +
              "/inbox/users",
            {
              headers: {
                Authorization: localStorage.getItem("Authorization"),
              },
            }
          )
          .then((result) => {
            changeIformation(() => {
              const arr = [];
              for (let i = 0; i < result.data.length; i++)
                arr.push({
                  firstname: result.data[i].first_name,
                  lastname: result.data[i].last_name,
                  image:
                    result.data[i].img !== undefined
                      ? "http://" +
                        config.SERVER_HOST +
                        ":" +
                        config.SERVER_PORT +
                        config.SERVER_IMGS +
                        result.data[i].img
                      : userprofil,
                  status : result.data[i].status[0].status
                });
              return arr;
            });
          });
        // eslint-disable-next-line
      }, []);
    return (
            <div className="people-list" id="people-list-freinds">
            <div className="search">
                <div style={{display:"flex", flexWrap:"wrap",justifyContent:"space-around"}}>
                    <h3>Freinds</h3>
                    <button id="black-List" onClick={ () => {
                        document.getElementsByClassName("chat")[0].style.display="block"
                        document.getElementsByClassName("people-list")[0].style.display="none"
                    }}>Black List</button>
                </div>
                <input type="text" id="MyInput"  placeholder="search" onChange={handleChange} />
            {/* <i class="fa fa-arrow-left" onClick={ ()=> {document.getElementsByClassName("people-list")[0].style.display="none"}}></i> */}
            </div>
                <ul className="list" id="myUL">
                    {information.map((item, index) => (
                        <FreindOnline status={item.status} key={index} user={item}  />
                    ))}
                </ul>
            </div>
    )
}
