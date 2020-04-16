// src/Registration.js
import axios from "./axioscopy";
import React from "react";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => console.log("this.state: ", this.state)
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    if (
      this.state.first &&
      this.state.last &&
      this.state.email &&
      this.state.password
    ) {
      axios
        .post(`./registration`, this.state)
        .then(function (resp) {
          console.log("handleSubmit info sent:", resp.data);
          if (resp.data.id) {
            location.replace("/");
          }

          console.log("state after checking!!!!", this.state);
        })
        .catch(function (error) {
          console.log("err in POST /registration:", error);
        });
    }
    if (!this.state.first) {
      this.setState({ errorFirst: "First name field is empty!" });
    }
    if (!this.state.last) {
      this.setState({ errorLast: "Last name field is empty!" });
    }
    if (!this.state.email) {
      this.setState({ errorEmail: "Email field is empty!" });
    }
    if (!this.state.password) {
      this.setState({ errorPassword: "Password field is empty!" });
    }
  }

  render() {
    return (
      <div>
        <h1>Register</h1>

        <p className="errorMessage"> {this.state.errorFirst} </p>
        <p className="errorMessage"> {this.state.errorLast} </p>
        <p className="errorMessage"> {this.state.errorEmail} </p>
        <p className="errorMessage"> {this.state.errorPassword} </p>

        <form>
          <input
            onChange={this.handleChange}
            name="first"
            type="text"
            placeholder="first name"
          />
          <input
            onChange={this.handleChange}
            name="last"
            type="text"
            placeholder="last name"
          />
          <input
            onChange={this.handleChange}
            name="email"
            type="text"
            placeholder="email"
          />
          <input
            onChange={this.handleChange}
            name="password"
            type="password"
            placeholder="password"
          />
          <div className="loginButton" onClick={this.handleSubmit}>
            submit
          </div>
        </form>
        <Link className="loginButton" to="/login">
          Log in
        </Link>
      </div>
    );
  }
}
