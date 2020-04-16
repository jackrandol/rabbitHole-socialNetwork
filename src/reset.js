import React from "react";
import axios from "./axioscopy";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDisplay: 1,
    };
    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSecretCode = this.handleSecretCode.bind(this);
    this.handlePasswordField = this.handlePasswordField.bind(this);
    this.handleNewPasswordSubmit = this.handleNewPasswordSubmit.bind(this);
  }

  handleEmailInput(e) {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => console.log("this.state: ", this.state)
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    var me = this;
    axios
      .post("/reset", this.state)
      .then(function (response) {
        console.log(response);
        me.setState({ currentDisplay: 2 });
      })
      .catch((error) => {
        console.log("error in post to /reset", error);
        this.setState({ error: "Something went wrong, please try again." });
      });
  }

  handleSecretCode(e) {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => console.log("this.state: ", this.state)
    );
  }

  handlePasswordField(e) {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => console.log("this.state: ", this.state)
    );
  }

  handleNewPasswordSubmit(e) {
    e.preventDefault();
    console.log("clicked submit new password");
    console.log(this.state);
    var me = this;
    axios
      .post("/resetPassword", this.state)
      .then((response) => {
        console.log(response);
        me.setState({ currentDisplay: 3 });
      })
      .catch((error) => {
        console.log("error in post to /reset", error);
        this.setState({
          errorNewPWSubmit: "Invalid code, please double check your code!",
        });
      });
  }

  render() {
    const { currentDisplay } = this.state;
    return (
      <div>
        {currentDisplay == 1 && (
          <div>
            <h2>
              Please enter your email if you would like to reset your password
            </h2>
            <p>{this.state.error}</p>
            <input
              onChange={this.handleEmailInput}
              name="email"
              type="text"
              placeholder="email"
            />
            <button onClick={this.handleSubmit}>submit</button>
          </div>
        )}
        {currentDisplay == 2 && (
          <div>
            <h2>
              You will receive an email with a secret code. Please enter that
              code here and choose a new password.
            </h2>
            <p>{this.state.errorNewPWSubmit}</p>
            <input
              onChange={this.handleSecretCode}
              name="code"
              type="text"
              placeholder="secret code"
            />
            <input
              onChange={this.handlePasswordField}
              name="newpassword"
              type="password"
              placeholder="new password"
            />
            <button onClick={this.handleNewPasswordSubmit}>
              save new password
            </button>
          </div>
        )}
        {currentDisplay == 3 && (
          <div>
            <h2>Your password has been updated!!!!!!</h2>
            <Link to="/login">Log in</Link>
          </div>
        )}
      </div>
    );
  }
}
