import React from "react";
import ProfilePic from "./profilepic";
import Bioeditor from "./bioeditor";
import Wall from "./wall";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <h1 className="welcomeHeader">
          Welcome, {this.props.first} {this.props.last}
        </h1>

        <div className="profile">
          <ProfilePic
            first={this.props.first}
            last={this.props.last}
            url={this.props.url}
            bio={this.props.bio}
            handleClick={this.props.handleClick}
          />

          <Bioeditor bio={this.props.bio} setBio={this.props.setBio} />
        </div>
      </div>
    );
  }
}
