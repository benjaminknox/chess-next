import Index from '../../pages/index'
import MockRouter from "../../testUtils/MockRouter";

describe('Home', () => {
  let testLocation: string;

  beforeEach(() => {
    cy.mount(
      <MockRouter push={(path) => {testLocation = path}}>
        <Index />
      </MockRouter>
    )
  })

  describe('when page loads', () => {
    it('should show start a new game button', () => {
      cy.get('[data-cy="start-a-new-game"]').should('exist')
    })

    describe('when starting a new game', () => {
      it('should go to the latest game button', () => {
        cy.get('[data-cy="start-a-new-game"]')
          .click()
          .then(() => {
            expect(testLocation).to.equal(`/new-game/select-opponent`)
          })
      })
    })

    it('should show continue your game button', () => {
      cy.get('[data-cy="continue-last-game"]').should('exist')
    })

    describe('when going to the last game started', () => {
      it('should go to the latest game button', () => {
        cy.get('[data-cy="continue-last-game"]')
          .click()
          .then(() => {
            expect(testLocation).to.equal(`/game/latest`)
          })
      })
    })
  })
})
