import React from "react";
import axios from "./axioscopy";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import spinningBall from "./threejsscript";
import { Chat } from "./chat";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.finishedUploading = this.finishedUploading.bind(this);
    this.closeUploader = this.closeUploader.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setBio = this.setBio.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    axios.get("/user").then(({ data }) => {
      this.setState(data);
      spinningBall(data.image);
    });
  }

  finishedUploading(url) {
    this.setState({ image: url });
    this.setState({ uploaderVisible: false });
  }

  setBio(bioText) {
    console.log("bio set!!");
    this.setState({ bio: bioText });
  }

  closeUploader() {
    this.setState({ uploaderVisible: false });
  }

  handleClick() {
    this.setState({ uploaderVisible: true });
  }

  logOut() {
    axios.get("/logOut").then(() => {
      console.log("user logged out");
    });
    location.replace("/welcome");
  }

  render() {
    if (!this.state.id) {
      return null;
    }
    return (
      <div>
        <BrowserRouter>
          <div className="leftNav">
            <div className="animatedUserImage"></div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/85/three.min.js"></script>
            <script src="threejsscript.js"></script>

            <div className="hello">Hello {this.state.first}!</div>
            <button className="navButton" onClick={this.logOut}>
              log out
            </button>
            <Link className="navButton" to={`/`}>
              My Profile
            </Link>
            <Link className="navButton" to={`/friends`}>
              Friends
            </Link>
            <Link className="navButton" to={`/users`}>
              Users
            </Link>
            <Link className="navButton" to={`/chat`}>
              Chat
            </Link>
            <h1 className="navTitle">The Rabbit Hole</h1>
          </div>

          <div className="appBoard">
            <Route
              exact
              path="/"
              render={() => (
                <Profile
                  first={this.state.first}
                  last={this.state.last}
                  url={this.state.image}
                  bio={this.state.bio}
                  handleClick={this.handleClick}
                  setBio={this.setBio}
                  id={this.id}
                />
              )}
            />
            <Route
              path="/user/:id"
              render={(props) => (
                <OtherProfile
                  key={props.match.url}
                  match={props.match}
                  history={props.history}
                />
              )}
            />

            {this.state.uploaderVisible && (
              <Uploader
                finishedUploading={this.finishedUploading}
                closeUploader={this.closeUploader}
              />
            )}

            <Route exact path="/users" render={() => <FindPeople />} />

            <Route exact path="/friends" render={() => <Friends />} />
            <Route exact path="/chat" component={Chat} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
