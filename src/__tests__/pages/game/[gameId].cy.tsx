import { SessionProvider } from "next-auth/react";
import Game from "../../../pages/game/[gameId]";
import { generateRandomUser } from "../../../testUtils";
import MockRouter from "../../../testUtils/MockRouter";

describe("Game", () => {
  it("should show game board", () => {
    process.env.WEBSOCKET_URI = "ws://test-url";

    cy.viewport(800, 800);

    cy.intercept("GET", "api/games/test-game-id", (req) => {
      req.reply({
        _id: "_test-record-id",
        white_player: "white-player-id",
        black_player: "black-player-id",
        moves: [],
        id: "",
        __v: 0,
      });
    });

    cy.intercept("GET", `/api/users/white-player-id`, (req) => {
      req.reply({
        ...generateRandomUser(),
        id: 'white-player-id'
      });
    }).as("white-player");

    cy.intercept("GET", `/api/users/black-player-id`, (req) => {
      req.reply({
        ...generateRandomUser(),
        id: 'black-player-id'
      });
    }).as("white-player");

    cy.mount(
      <SessionProvider session={{ user: { id: "white-player-id" } }}>
        <MockRouter>
          <Game gameId="test-game-id" />
        </MockRouter>
      </SessionProvider>
    );
    cy.get("[data-square] [draggable]").should("have.length", 32);
  });
});
