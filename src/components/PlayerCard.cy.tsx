import { PlayerCard } from './PlayerCard'

describe('PlayerCard', () => {
  it('should show player name with left alignment', () => {
    cy.mount(<PlayerCard name='Test Name For White' />)

    cy.get('[data-cy=avatar-left]').should('exist')
  })

  it('should show player name with right alignment', () => {
    cy.mount(<PlayerCard align='right' name='Test Name For White' />)

    cy.get('[data-cy=avatar-right]').should('exist')
  })
})
