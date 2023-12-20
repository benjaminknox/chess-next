import { User } from "../../../types";
import MockRouter from "../../../testUtils/MockRouter";
import { generateUsersList } from "../../../testUtils";
import SelectOpponent from "../../../pages/new-game/select-opponent";

describe("SelectOpponent", () => {
  let store: any;
  let fetchMock: any;
  let testLocation: string;
  const basePath = "http://test";
  const websocketBasePath = "ws://test-url";

  const testUserList: Partial<User>[] = generateUsersList();
  const opponent = testUserList[2].id;

  beforeEach(() => {

    cy.intercept('GET', '/api/users', {statusCode: 200, body: testUserList}).as("apiUser")

    cy.mount(
      <MockRouter push={(path) => {testLocation = path}}>
        <SelectOpponent />
      </MockRouter>
    )
  });

  it("should show user select", () => {
    cy.get('[data-cy="user-list-select"]').should("exist");
  });

  describe("when a user is selected", () => {
    it("should move to next route", () => {
      cy.get("[data-cy=user-list-select]").click();
      cy.get("[data-cy=user-2]").click();
      cy.get("[data-cy=user-list-submit]")
        .click()
        .then(() => {
          expect(testLocation).to.equal(
            `/new-game/${opponent}/select-side`
          );
        });
    });
  });
});
