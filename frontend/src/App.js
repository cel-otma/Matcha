import React, { useState, useEffect } from "react";
import "./App.css";
import { Login } from "./components/login.js";
import Register from "./components/register.js";
import Forget from "./components/forgetpass/forget";
import Information from "./components/profl_information/profil_info";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Index from "./components/home";
import EditProfil from "./components/ProfilEdit/EditProfil";
import ViewsProfil1 from "./components/ProfilEdit/viewsProfil1";
import Chat from "./components/chat/Chat";
import Notification from "./components/notification/Notification";
import Freinds from "./components/Freinds/Freinds";
import NewPassword from "./components/NewPassword/NewPassword";
import History from "./components/History/History";
import NotFound from "./components/NotFound";

import { useHistory } from "react-router-dom";
import axios from "axios";
import config from "./config";
import io from 'socket.io-client';

let sock = io.connect(`http://${config.SERVER_HOST}:${config.SERVER_PORT}`);

function Allcomponent() {
  // const [isloged, setloged] = useState(false);
  const history = useHistory();
  const [steps, setstep] = useState(0);
  const [UpdateAllntfs, setupntfs] = useState(0);
  let [length, setlength] = useState(0);
  
  const user = localStorage.getItem("login");

  let updatentfs_length = () => {
    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/notifications?limit=0", {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success)
          setlength(respond.data.data[0] !== undefined ? respond.data.invue_length : 0);
      });
  }

  let socketon = () => {
    if (sock !== undefined) {
      sock.on('connect', (socket) => {
        if (localStorage.getItem('Authorization') !== undefined)
          sock.emit('Authorization', localStorage.getItem('Authorization'));
        sock.emit('isdisconnect', {
          'Authorization' : localStorage.getItem('Authorization')
        });
      });
    
      sock.on('upntfs', (msg) => {
        setupntfs(1);
        updatentfs_length();
      });
    }
  }

  useEffect(() => {
    socketon();
    axios
    .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/posts", {
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      },
    })
    .then((result) =>{
        if (result.data.error === "You've to complete your infos before visiting this page") {
          history.push("/steps");
        }
      });
      // eslint-disable-next-line
  }, []);

  function RedirectLogin() {
    history.push("/Singin");
    return null;
  }
  function RedirectHome() {
    history.push("/");
    return null;
  }
  return (
    <Switch>
     
      <Route path="/Singin" exact={true}>
        {user ? <RedirectHome /> : <Login />}
      </Route>
      <Route path="/Singup" exact={true}>
        {user ? <RedirectHome /> : <Register />}
      </Route>
      <Route path="/NewPassword" exact={true}>
        {user ? <RedirectHome /> : <NewPassword />}
        {/* <NewPassword /> */}
      </Route>
      <Route path="/forget" exact={true}>
        {user ? <RedirectHome /> : <Forget />}
      </Route>
      <Route path="/steps" exact={true}>
        {!user && steps ? <RedirectLogin /> : <Information complete={setstep} setlength={setlength} length={length}/>}
        {/* <Information /> */}
      </Route>
      <Route path="/" exact={true}>
        {!user ? <RedirectLogin /> : <Index setlength={setlength} length={length} />}
      </Route>
      <Route path="/message" exact={true}>
        {!user ? <RedirectLogin /> : <Chat setlength={setlength} length={length}/>}
      </Route>
      <Route path="/EditProfil/:username">
        {/* {!user ? <RedirectLogin /> : <EditProfil />} */}
        <EditProfil setlength={setlength} length={length}/>
      </Route>
      <Route path="/notification" exact={true}>
        {!user ? <RedirectLogin /> : <Notification UpdateAllntfs={UpdateAllntfs} setupntfs={setupntfs} setlength={setlength} length={length}/>}
      </Route>
      <Route path="/ViewsProfil/:username">{!user ? <RedirectLogin /> : <ViewsProfil1 setlength={setlength} length={length} />}</Route>
      <Route path="/Freinds" exact={true}>
        {!user ? <RedirectLogin /> : <Freinds setlength={setlength} length={length}/>}
      </Route>
      <Route path="/History" exact={true}>
        {!user ? <RedirectLogin /> : <History setlength={setlength} length={length}/>}
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );

  // return (
  //   <Switch>
  //     <Route path="/Singin" exact={true}>
  //       {isloged ? <RedirectHome /> : <Login />}
  //     </Route>
  //     <Route path="/Singup" exact={true}>
  //       {isloged ? <RedirectHome /> : <Register />}
  //     </Route>
  //     <Route path="/NewPassword" exact={true}>
  //       {/* {isloged ? <RedirectHome /> : <NewPassword />} */}
  //       <NewPassword />
  //     </Route>
  //     <Route path="/forget" exact={true}>
  //       {isloged ? <RedirectHome /> : <Forget />}
  //     </Route>
  //     <Route path="/profil" exact={true}>
  //       {!isloged && steps ? (
  //         <RedirectLogin />
  //       ) : (
  //         <Information complete={setstep} />
  //       )}
  //       {/* <Information /> */}
  //     </Route>
  //     <Route path="/" exact={true}>
  //       {!isloged ? <RedirectLogin /> : <Index />}
  //     </Route>
  //     <Route path="/message" exact={true}>
  //       {!isloged ? <RedirectLogin /> : <Chat />}
  //     </Route>
  //     <Route path="/EditProfil/:username">
  //       {/* {!isloged ? <RedirectLogin /> : <EditProfil />} */}
  //       <EditProfil />
  //     </Route>
  //     <Route path="/notification" exact={true}>
  //       {!isloged ? <RedirectLogin /> : <Notification />}
  //     </Route>
  //     <Route path="/ViewsProfil/:username">
  //       {!isloged ? <RedirectLogin /> : <ViewsProfil1 />}
  //     </Route>
  //     <Route path="/Freinds" exact={true}>
  //       {!isloged ? <RedirectLogin /> : <Freinds />}
  //     </Route>
  //     <Route path="/History" exact={true}>
  //       {!isloged ? <RedirectLogin /> : <History />}
  //     </Route>
  //     <Route>
  //       <NotFound />
  //     </Route>
  //   </Switch>
  // );
}
function App() {
  return (
    <div className="App">
      <Router>
        <Allcomponent />
      </Router>
    </div>
  );
}

export default App;
