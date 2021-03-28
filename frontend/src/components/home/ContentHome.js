import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./ContentHome.css";
import userprofil from "../profl_information/img/userprofil.jpg";
// eslint-disable-next-line
import axios from "axios";
import useInfiniteScroll from "react-infinite-scroll-hook";
import config from "../../config";

function ContentHome(props) {
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line
  useEffect(() => {
    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/posts?limit=0" + 
      "&minAge=" +
      props.age[0] +
      "&maxAge=" +
      props.age[1] +
      "&minLoc=" +
      props.location[0] +
      "&maxLoc=" +
      props.location[1] +
      "&minCtags=" +
      props.ctags[0] +
      "&maxCtags=" +
      props.ctags[1] +
      "&minFameRat=" +
      props.rating[0] +
      "&maxFameRat=" +
      props.rating[1] +
      "&sortType=" +
      props.sortType +
      "&intereststags=" +
      JSON.stringify(props.intereststags) +
      "&searchString=" +
      props.searchString, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((result) => {
        if (result.data.success) {
          props.setpostlength(result.data.length);
          // eslint-disable-next-line
          // props.postlength = result.data.length;
          props.changeIformation(() => {
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
      props.setpostlimit(20);
    // eslint-disable-next-line
  }, []);

  function handleLoadMore() {
    setTimeout(() => {
      if ((props.postlimit >= props.postlength)
        && (props.postlimit > 20 || props.postlength)) return;
      setLoading(true);
      axios
        .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/posts?limit=" + props.postlimit + 
        "&minAge=" +
        props.age[0] +
        "&maxAge=" +
        props.age[1] +
        "&minLoc=" +
        props.location[0] +
        "&maxLoc=" +
        props.location[1] +
        "&minCtags=" +
        props.ctags[0] +
        "&maxCtags=" +
        props.ctags[1] +
        "&minFameRat=" +
        props.rating[0] +
        "&maxFameRat=" +
        props.rating[1] +
        "&sortType=" +
        props.sortType +
        "&intereststags=" +
        JSON.stringify(props.intereststags) +
        "&searchString=" +
        props.searchString, {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        })
        .then((result) => {
          if (result.data.success) {
            props.changeIformation(() => {
              const arr = props.information;
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
      props.setpostlimit(parseInt(props.postlimit) +
      20);
      setLoading(false);
    }, 500);
  }

  const infiniteRef = useInfiniteScroll({
    loading,
    hasNextPage: true,
    onLoadMore: handleLoadMore,
    scrollContainer: "window",
  });

  return (
    <div className="ContentHome" ref={infiniteRef}>
      {props.information.map((item, index) => (
        <Card key={index} user={item} />
      ))}
      {loading && <div>loading...</div>}
    </div>
  );
}
export default ContentHome;
