import React, { useEffect, useState } from "react";
import axios from "./axioscopy";

export default function FriendButton({ otherUserId }) {
  const [buttonText, setButtonText] = useState("Make Friend Request");

  useEffect(() => {
    console.log("otherUserId:", otherUserId);

    axios.get(`/initial-friendship-status/${otherUserId}`).then((response) => {
      if (response.data.rowCount == 0) {
        return;
      }

      if (response.data[0].accepted == true) {
        setButtonText("Unfriend");
      }

      if (response.data[0].accepted == false) {
        if (response.data[0].sender_id == otherUserId) {
          setButtonText("Accept Friend Request");
        } else {
          setButtonText("Cancel Friend Request");
        }
      }
    });
  }, []);

  const handleClick = () => {
    if (buttonText == "Make Friend Request") {
      axios.post(`/make-friend-request/${otherUserId}`).then((response) => {
        console.log("post made to /make-friend-request:", response);
        setButtonText("Cancel Friend Request");
      });
    }

    if (buttonText == "Accept Friend Request") {
      axios.post(`/accept-friend-request/${otherUserId}`).then((response) => {
        console.log(response);
        setButtonText("Unfriend");
      });
    }

    if (buttonText == "Cancel Friend Request") {
      axios.post(`/cancel-friendship/${otherUserId}`).then((response) => {
        console.log(response);
        setButtonText("Make Friend Request");
      });
    }

    if (buttonText == "Unfriend") {
      axios.post(`/cancel-friendship/${otherUserId}`).then((response) => {
        console.log(response);
        setButtonText("Make Friend Request");
      });
    }
  };

  return <button onClick={handleClick}>{buttonText}</button>;
}
