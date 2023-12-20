import React from "react";
import { Space } from "./Space";

describe("Space", () => {
  it("shows a spacer element", () => {
    const height = 20;
    cy.mount(<Space size={height} />);
    cy.get('[data-cy="size"]').should("exist");
    cy.get('[data-cy="size"]').should("have.css", "height", "20px");
  });
});
