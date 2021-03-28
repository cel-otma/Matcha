import React, { useState } from "react";
import ContentHome from "./ContentHome";
import UserSearch from "./UserSearch";
import Filtring from "./Filtring";
import config from "../../config";
import axios from "axios";
import userprofil from "../profl_information/img/userprofil.jpg";

function Index(props) {
  const [filter, setfilter] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [information, changeIformation] = useState([]);
  const [age, setAge] = useState([0, 100]);
  const [location, setLocation] = useState([0, 12700]);
  const [rating, setRating] = useState([0, 5]);
  const [sortType, setsort] = useState(4);
  const [ctags, setctags] = useState([0, 100]);
  const [intereststags, setIntereststags] = useState([]);
  let [postlimit, setpostlimit] = useState(0);
  let [postlength, setpostlength] = useState(0);

  function filterClick() {
    axios
      .get(
        "http://" +
          config.SERVER_HOST +
          ":" +
          config.SERVER_PORT +
          "/posts/?minAge=" +
          age[0] +
          "&maxAge=" +
          age[1] +
          "&minLoc=" +
          location[0] +
          "&maxLoc=" +
          location[1] +
          "&minCtags=" +
          ctags[0] +
          "&maxCtags=" +
          ctags[1] +
          "&minFameRat=" +
          rating[0] +
          "&maxFameRat=" +
          rating[1] +
          "&sortType=" +
          sortType +
          "&intereststags=" +
          JSON.stringify(intereststags) +
          "&searchString=" +
          searchString,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      )
      .then((result) => {
        if (result.data.success) {
          setpostlength(result.data.length);
          changeIformation(() => {
            const arr = [];
            for (let i = 0; i < result.data.data.length; i++)
              arr.push({
                login: result.data.data[i].infos[0].login,
                firstname: result.data.data[i].infos[0].first_name,
                lastname: result.data.data[i].infos[0].last_name,
                desc: result.data.data[i].infos[0].desc,
                gender: result.data.data[i].infos[0].gendre,
                city: result.data.data[i].infos[0].city,
                date: result.data.data[i].infos[0].birthday,
                commontags : result.data.data[i].commontags,
                image:
                  result.data.data[i].image !== undefined ? "http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + config.SERVER_IMGS + result.data.data[i].image : userprofil,
                position: parseInt(result.data.data[i].awaykm),
                fameRating: result.data.data[i].fameRat,
              });
            return arr;
          });
        }
      });
      setpostlimit(20);
  }

  return (
    <div>
      <UserSearch filtring={setfilter} searchString={searchString} setSearchString={setSearchString}
      filter={filter} setlength={props.setlength} length={props.length}/>
      {filter === 1 ? <Filtring searchString={searchString} filterClick={filterClick} changeIformation={changeIformation} 
        age={age} setAge={setAge}
        location={location} setLocation={setLocation}
        rating={rating} setRating={setRating}
        sortType={sortType} setsort={setsort}
        ctags={ctags} setctags={setctags}
        intereststags={intereststags} setIntereststags={setIntereststags}
      /> : null}
      <ContentHome information={information} changeIformation={changeIformation} 
        age={age} setAge={setAge}
        location={location} setLocation={setLocation}
        rating={rating} setRating={setRating}
        sortType={sortType} setsort={setsort}
        ctags={ctags} setctags={setctags}
        intereststags={intereststags} setIntereststags={setIntereststags}
        searchString={searchString} postlimit={postlimit} setpostlimit={setpostlimit}
        postlength={postlength} setpostlength={setpostlength}
      />
    </div>
  );
}
export default Index;
