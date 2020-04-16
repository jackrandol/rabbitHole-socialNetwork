// src/Welcome.js
import React from "react";
import Registration from "./Registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import Reset from "./reset";

export default function Welcome() {
  return (
    <div>
      <img className="backgroundHole" src="/logo2.png" />
      <div className="circle">
        <HashRouter>
          <div>
            <h1>Let&apos;s go down the rabbit hole</h1>
            <Route exact component={Registration} path="/" />
            <Route component={Login} path="/login" />
            <Route component={Reset} path="/reset" />
          </div>
        </HashRouter>
      </div>
    </div>
  );
}
