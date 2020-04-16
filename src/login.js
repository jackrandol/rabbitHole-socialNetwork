import axios from "./axioscopy";
import React from "react";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      errorLogin: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
  }

  handleChange(e) {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => console.log("this.state: ", this.state)
    );
  }

  handleLogIn(e) {
    e.preventDefault();
    if (this.state.email && this.state.password) {
      var me = this;
      axios
        .post(`./login`, this.state)
        .then(function (response) {
          if (response.status == 200) {
            location.replace("/");
          }
        })
        .catch(function (error) {
          console.log("err in POST /registration:", error);
          me.setState({
            errorLogin:
              "Either your email or password was incorrect, or you are not in our database.",
          });
        });
    } else {
      this.setState({
        errorLoginInput: "Please make sure to fill in both fields.",
      });
    }
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <p> {this.state.errorLogin} </p>
        <p> {this.state.errorLoginInput} </p>
        <form>
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
          <div className="loginButton" onClick={this.handleLogIn}>
            log in
          </div>
          <Link className="loginButton" to="/reset">
            Forgot Password?
          </Link>
        </form>
      </div>
    );
  }
}
