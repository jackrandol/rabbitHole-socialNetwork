import React from "react";

export default function ({ url, first, last, handleClick }) {
  return (
    <img
      className="profilePic"
      onClick={handleClick}
      src={url || "default.png"}
      alt={`${first} ${last}`}
    />
  );
}
