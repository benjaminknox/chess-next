import React from "react";
import { Login } from "./login";

describe("<Login />", () => {
  let onSubmit: () => void;

  beforeEach(() => {
    onSubmit = cy.spy((evt) => {
      evt.preventDefault();
      const myFormData = new FormData(evt.target);

      const formDataObj: Record<string, string> = {};

      myFormData.forEach(
        (value: FormDataEntryValue, key: string) =>
          (formDataObj[`${key}`] = `${value}`)
      );

      return formDataObj;
    });
  });

  describe("when form loads", () => {
    beforeEach(() => {
      cy.mount(<Login onSubmit={onSubmit} />);
    });
    it("shows the login form elements", () => {
      cy.get('[data-cy="login-form-wrapper"]').should("exist");
      cy.get('[data-cy="login-form-header"]').contains("Chess");

      cy.get('[data-cy="login-form-username"]').should("exist");
      cy.get('[data-cy="login-form-password"]').should("exist");
      cy.get('[data-cy="login-form-submit"]').contains("Sign in");
    });

    it("doesn't show loading state", () => {
      cy.get('[data-cy="login-form-submit"]').should("not.be.disabled");
      cy.get('[data-cy="login-form-submit"]').contains("Sign in");
    });
  });
  describe("when filling out the form", () => {
    describe("when testing login submit", () => {
      beforeEach(() => {
        cy.mount(<Login onSubmit={onSubmit} />);
        cy.get('[data-cy="login-form-username"]').type("testUser");
        cy.get('[data-cy="login-form-password"]').type("testPassword");
      });

      it.only("submits the values of username and password on click", () => {
        cy.get('[data-cy="login-form-submit"]')
          .click()
          .then(() => {
            expect(onSubmit).to.have.returned(
              Cypress.sinon.match({
                username: "testUser",
                password: "testPassword",
              })
            );
          });
      });
    });
    it("shows failed state on password", () => {
      const message = "Test password failed";

      cy.mount(<Login passwordFailed={message} onSubmit={onSubmit} />);
      cy.get('[data-cy="login-form-password"]').should("exist");
      cy.get('[data-cy="login-form-password"]').contains(message);
    });
    it("shows failed state on username", () => {
      const message = "Test username failed";
      cy.mount(<Login usernameFailed={message} onSubmit={onSubmit} />);

      cy.get('[data-cy="login-form-username"]').should("exist");
      cy.get('[data-cy="login-form-username"]').contains(message);
    });
    it("shows failed state on submit", () => {
      const message = "Could not login, please try again";
      cy.mount(<Login submitFailed={message} onSubmit={onSubmit} />);

      cy.get('[data-cy="login-form-error"]').should("exist");
      cy.get('[data-cy="login-form-error"]').contains(message);
    });
  });
  describe("when loading", () => {
    it("shows loading state", () => {
      cy.mount(<Login loading={true} onSubmit={onSubmit} />);

      cy.get('[data-cy="login-form-submit"]').should("be.disabled");
      cy.get('[data-cy="login-form-submit"]').not("Sign in");
    });
  });
});
