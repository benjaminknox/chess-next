import { SessionProvider } from "next-auth/react";
import MockRouter from "../../../../testUtils/MockRouter";
import SelectSide from "../../../../pages/new-game/[uid]/select-side";

describe("SelectSide", () => {
  let testLocation: string;
  const opponent = "test-user-uuid";
  let requestMock;
  const testGameId = "26de07da-37eb-4ca5-a9b4-2c90bbc7fd1b";
  const userId = "26de07da-37eb-4ca5-a9b4-2c90bbc7fd1b";

  beforeEach(() => {
    requestMock = cy.stub();
    cy.intercept("POST", "/api/games", req => {
      requestMock(req.body)
      req.reply({
        _id: "61c5001c2a249c577b24a068",
        white_player: opponent,
        black_player: userId,
        moves: [],
        id: testGameId,
        __v: 0,
      })
    }).as("gamesEndpoint");

    cy.mount(
      <MockRouter asPath={`/game/${opponent}`} push={(path) => {testLocation = path}}>
        <SessionProvider session={{user: {id: userId}}}>
          <SelectSide uid={opponent} />
        </SessionProvider>
      </MockRouter>
    );
  });

  it("should show black player button", () => {
    cy.get("[data-cy=black-player]").should("exist");
  });

  it("should show white player button", () => {
    cy.get("[data-cy=white-player]").should("exist");
  });

  describe("when selecting a color", () => {
    it("should send user to a game board", () => {
      cy.get("[data-cy=white-player]")
        .click()
        .then(() => {
          expect(testLocation).to.equal(`/game/${testGameId}`);
        });
    });

    it("should start a game with current user as white", () => {
      cy.get("[data-cy=white-player]")
        .click()
        .then(() => {
          expect(requestMock).to.be.calledWithMatch({
              white_player: userId,
              black_player: opponent,
          });
        });
    });

    it("should start a game with current user as black", () => {
      cy.get("[data-cy=black-player]")
        .click()
        .then(() => {
          expect(requestMock).to.be.calledWithMatch({
            white_player: opponent,
            black_player: userId,
          });
        });
    });
  });
});
