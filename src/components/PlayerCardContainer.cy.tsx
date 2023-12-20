import { User, Align } from "../types";
import MockRouter from "../testUtils/MockRouter";
import { SessionProvider } from "next-auth/react";
import { generateRandomUser } from "../testUtils";
import { PlayerCardContainer } from "./PlayerCardContainer";

describe("PlayerCardContainer", () => {
  const basePath = "http://test";
  let user: User;
  const fakeUserId = "26de07da-37eb-4ca5-a9b4-2c90bbc7fd1b";
  beforeEach(() => {
    user = generateRandomUser();
  });

  it("should show player name with left alignment", () => {
    mountPlayerCardContainer("left");
    cy.get("[data-cy=avatar-left]").contains(user.username);
  });

  it("should show player name with right alignment", () => {
    mountPlayerCardContainer("right");
    cy.get("[data-cy=avatar-right]").contains(user.username);
  });

  it('should use "me" for name if logged in user is the player', () => {
    mountPlayerCardContainer("right", fakeUserId);
    cy.get("[data-cy=avatar-right]").should("not.contain", user.username);
  });

  function mountPlayerCardContainer(align: Align, userId = "test-user-id") {
    cy.intercept("GET", `/api/users/${userId}`, req =>{
      req.reply({ ...user, id: userId })
    }).as("apiUsersCall")

    cy.mount(
      <SessionProvider session={{user: {id: fakeUserId}}}>
        <PlayerCardContainer userId={userId} align={align} />
      </SessionProvider>
    )
  }
});
