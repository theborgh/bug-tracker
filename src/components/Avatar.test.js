import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./Avatar";

describe("Avatar", () => {
  it("renders without crashing", () => {
    render(
      <Avatar title={"anonymous"}>
        <AvatarImage src={""} />
        <AvatarFallback>{"Test Name"}</AvatarFallback>
      </Avatar>
    );

    const avatarElement = screen.getByTitle("anonymous");

    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement).toHaveTextContent("Test Name");
    expect(avatarElement).toHaveClass(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full"
    );
  });
});
