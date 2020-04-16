// src/profilepic.test.js

import React from "react";
import ProfilePic from "./profilepic";
import { render, fireEvent } from "@testing-library/react";

test("renders default image when there is no url prop", () => {
  const { container } = render(<ProfilePic />);
  expect(container.querySelector("img").src).toContain("/default.png");
});

test("renders image with specified url prop", () => {
  const { container } = render(<ProfilePic url="/some-url.gif" />);
  expect(container.querySelector("img").src).toContain("/some-url.gif");
});

test("renders image with first and last props in alt", () => {
  const { container } = render(<ProfilePic first="jack" last="randol" />);
  expect(container.querySelector("img").alt).toContain("jack randol");
});

test("onClick prop get called when img is clicked", () => {
  const handleClick = jest.fn();
  const { container } = render(<ProfilePic handleClick={handleClick} />);
  const img = container.querySelector("img");
  fireEvent.click(img);
  expect(handleClick.mock.calls.length).toBe(1);
});
