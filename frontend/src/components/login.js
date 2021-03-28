import React from "react";
import Sidebar from "./login/sidebar.js";
import Content from "./login/content.js";
import Navbar from "./login/navbar";
function Login() {
  return (
    <div className="main">
      <Navbar />

      <div className="container">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}
export { Login };
