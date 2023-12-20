import { uuid } from "uuidv4";
import { Server } from "mock-websocket";
import { SinonStub } from "cypress/types/sinon";
import { BoardContainer } from "./BoardContainer";
import { generateRandomUser } from "../testUtils";
import { SessionProvider } from "next-auth/react";

// TODO: This only runs successfully the first time, otherwise these are flaky.
//       a refactor of these tests are needed
describe.skip("Board", () => {
  let store: any;
  const basePath = "https://test-id";
  let websocketBasePath: string;
  let fetchStub: Cypress.Agent<SinonStub>;
  const fakeUserId = "26de07da-37eb-4ca5-a9b4-2c90bbc7fd1b";
  const game: {
    _id: string;
    white_player: string;
    black_player: string;
    moves: { move: string; move_number: number }[];
    id: string;
    __v: number;
  } = {
    _id: "_test-record-id",
    white_player: fakeUserId,
    black_player: "black-player-id",
    moves: [],
    id: "",
    __v: 0,
  };

  const setGameId = (gameId: string = uuid()) => {
    game.id = gameId;
  };

  const whitePlayer = {
    ...generateRandomUser(),
    id: game.white_player,
  };

  const blackPlayer = {
    ...generateRandomUser(),
    id: game.black_player,
  };

  let mockServer: Server;

  beforeEach(() => {
    cy.viewport(800, 800);

    fetchStub = cy.stub();

    cy.intercept("GET", "api/games/*", (req) => {
      fetchStub(game);
      req.reply(game);
    });

    cy.intercept("GET", `/api/users/${whitePlayer.id}`, (req) => {
      fetchStub(game);
      req.reply(whitePlayer);
    }).as("white-player");

    cy.intercept("GET", `/api/users/${blackPlayer.id}`, (req) => {
      fetchStub(game);
      req.reply(blackPlayer);
    }).as("white-player");

    websocketBasePath = `ws://test-url`;
    process.env.WEBSOCKET_URI = websocketBasePath;

    mockServer = new Server(`${websocketBasePath}/games/${game.id}`);
  });

  describe("when loading board for the first time", () => {
    beforeEach(() => {
      setGameId();
      const testMove1 =
        "rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR b KQkq - 0 1";
      const testMove2 =
        "rnbqkbnr/pppp1ppp/4p3/8/8/6P1/PPPPPP1P/RNBQKBNR w KQkq - 0 2";

      cy.mount(<TestBoardContainer />);
    });

    it("should show board in start position", () => {
      cy.get("[data-square] [draggable]").should("have.length", 32);
      expect(fetchStub).to.be.calledThrice;
    });

    describe("when the move is valid", () => {
      // TODO: figure out how to mock drag events with react-chessboard
      it.skip("should update the board after move", () => {
        cy.get("[data-square] [draggable]").should("have.length", 32);

        cy.get("[data-square=g2] div[draggable=true]").then(($draggable) => {
          cy.get("[data-square=g3]").then(($droppable) => {
            const dataTransfer = { dataTransfer: new DataTransfer() };

            cy.wrap($draggable).trigger("dragstart", dataTransfer);
            cy.wrap($droppable)
              .trigger("drop", dataTransfer)
              .trigger("mouseup", { force: true });
          });
        });

        cy.get("[data-square=g3] div[draggable=true]").should("exist");
      });
    });

    // TODO: figure out how to mock drag events with react-chessboard
    describe.skip("when the move is invalid", () => {
      it("should not allow the board when black player moves white", () => {
        cy.get("[data-square] [draggable]").should("have.length", 32);

        cy.get("[data-square=g2] div[draggable=true]").then(($draggable) => {
          cy.get("[data-square=g3]").then(($droppable) => {
            const dataTransfer = { dataTransfer: new DataTransfer() };

            cy.wrap($draggable).trigger("dragstart", dataTransfer);
            cy.wrap($droppable)
              .trigger("drop", dataTransfer)
              .trigger("mouseup", { force: true });
          });
        });

        cy.get("[data-square=e7] div[draggable=true]").then(($draggable) => {
          cy.get("[data-square=e6]").then(($droppable) => {
            const dataTransfer = { dataTransfer: new DataTransfer() };

            cy.wrap($draggable).trigger("dragstart", dataTransfer);
            cy.wrap($droppable)
              .trigger("drop", dataTransfer)
              .trigger("mouseup", { force: true });
          });
        });

        cy.get("div[data-square=e6] [draggable]").should("not.exist");
      });
    });
  });

  describe("when loading an existing board", () => {
    beforeEach(() => {
      const g = {
        ...game,
        moves: [
          {
            move: "rnbqkbnr/pp3ppp/8/3pp3/8/5P2/PPPPK1PP/RNBQ1BNR w kq - 0 5",
            move_number: 3,
          },
        ],
      };

      cy.intercept("GET", "api/games/*", (req) => {
        fetchStub(g);
        req.reply(g);
      }).as("last-game");

      setGameId();
      cy.mount(<TestBoardContainer />);
    });

    it("should load the last turn taken", () => {
      cy.get("[data-square] [draggable]").should("have.length", 30);
      cy.get("div[data-square=e5] [draggable]").should("exist");
    });

    it("should load the last turn taken", () => {
      cy.get("[data-square] [draggable]").should("have.length", 30);
      cy.get("div[data-square=e5] [draggable]").should("exist");
    });

    it("should move the board when the other player moves", () => {
      mockServer.send("8/8/K7/8/6k1/8/8/8 w - - 0 1");

      cy.get("[data-square] [draggable]").should("have.length", 2);
    });

    it("should show the user avatars", () => {
      cy.get("[data-cy=avatar-left]").contains(blackPlayer.username);
      cy.get("[data-cy=avatar-right]").contains("me");
    });
  });

  describe("when loading the last game", () => {
    const returnedGameId = "the-returned-game-id";
    const move = "rnbqkbnr/pp3ppp/8/3pp3/8/5PP1/PPPPK2P/RNBQ1BNR b kq - 0 5";

    beforeEach(() => {
      setGameId("latest");
      cy.mount(<TestBoardContainer />);
    });

    // TODO: figure out how to mock drag events with react-chessboard
    it.skip("should call move with returned game id", () => {
      cy.get("[data-square=g2] div[draggable=true]").then(($draggable) => {
        cy.get("[data-square=g3]").then(($droppable) => {
          const dataTransfer = { dataTransfer: new DataTransfer() };

          cy.wrap($draggable).trigger("dragstart", dataTransfer);
          cy.wrap($droppable)
            .trigger("drop", dataTransfer)
            .trigger("mouseup", { force: true });
        });
      });

      cy.get("[data-square=f3] div[draggable=true]")
        .should("exist")
        .then(() => {
          expect(fetchStub).to.be.calledWithMatch(returnedGameId);
        });
    });
  });

  function TestBoardContainer(config: Partial<ConfigsResponse>) {
    const defaultConfig: ConfigsResponse = {
      values: {
        apiBasePath: basePath,
        websocketBasePath,
      },
      loading: false,
      failed: false,
    };

    const configsForUse: ConfigsResponse = {
      ...defaultConfig,
      ...config,
    };

    return (
      <SessionProvider session={{ user: { id: fakeUserId } }}>
        <BoardContainer gameId={game.id} />
      </SessionProvider>
    );
  }
});
