import React from "react";
import axios from "./axioscopy";
import FriendButton from "./friendbutton";
import Wall from "./wall";

export default class OtherProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    axios
      .get(`/user/${this.props.match.params.id}.json`)
      .then(({ data }) => {
        this.setState(data);
      })
      .catch((error) => {
        console.log("error from other users:", error);
        this.props.history.push("/");
      });
  }

  render() {
    return (
      <div>
        <h1 className="welcomeHeader">
          {" "}
          Profile of {this.state.first} {this.state.last}{" "}
        </h1>
        <img
          className="profilePic"
          src={this.state.image || "default.png"}
          alt={`${this.state.first} ${this.state.last}`}
        />
        <p>Bio: {this.state.bio}</p>
        <FriendButton otherUserId={this.props.match.params.id} />
        <Wall otherUserId={this.props.match.params.id} />
      </div>
    );
  }
}
