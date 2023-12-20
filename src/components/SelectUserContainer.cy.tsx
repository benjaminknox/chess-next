import { User } from "../types";
import { SinonStub } from "cypress/types/sinon";
import MockRouter from "../testUtils/MockRouter";
import { generateUsersList } from "../testUtils";
import { SelectUserContainer } from "./SelectUserContainer";

describe("SelectUserContiner", () => {
  let fetchMock: any;
  const basePath = "http://test";
  const websocketBasePath = "ws://test-url";
  let selectOpponent: Cypress.Agent<SinonStub>;
  let testUserList: Partial<User>[];
  let userApiCallCount: number;

  beforeEach(() => {
    userApiCallCount = 0;
    selectOpponent = cy.stub();

    testUserList = generateUsersList();

    cy.intercept('GET', '/api/users', {statusCode: 200, body: testUserList}).as("apiUser")

    cy.mount( <MockRouter>
        <SelectUserContainer selectOpponent={selectOpponent} />
      </MockRouter>)
  });

  it("gets the users from api", () => {
    cy.get("[data-cy=user-list-select]").click();
    cy.get("[data-cy=user-4]")
      .should("exist")
      .then(() => {
        cy.wait('@apiUser').its('response.statusCode').should('eq', 200)
      });
  });

  it("shows the user list select", () => {
    cy.get("[data-cy=user-list-select]").should("exist");
  });

  it("shows the user next button", () => {
    cy.get("[data-cy=user-list-submit]").should("exist");
  });

  describe("when user is not selected", () => {
    it("should show disabled next button", () => {
      cy.get("[data-cy=user-list-submit]").should("be.disabled");
    });
  });

  describe("when user is selected", () => {
    it("should show enabled next button", () => {
      cy.get("[data-cy=user-list-select]").click();
      cy.get("[data-cy=user-3]").click();
      cy.get("[data-cy=user-list-submit]").should("be.enabled");
    });

    it("starts a game with the selected user", () => {
      cy.get("[data-cy=user-list-select]").click();
      cy.get("[data-cy=user-2]").click();
      cy.get("[data-cy=user-list-submit]")
        .click()
        .then(() => {
          //@ts-ignore
          expect(selectOpponent).to.be.calledOnce;
        });
    });
  });

});
