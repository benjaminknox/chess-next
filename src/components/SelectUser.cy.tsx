import { User } from '../types'
import { SelectUser } from './SelectUser'
import { generateUsersList } from '../testUtils'

describe('SelectUser', () => {
  let userList: Partial<User>[]
  let selectedUser: Partial<User>
  const updateUser = (user: Partial<User>) => {
    selectedUser = user
  }

  beforeEach(() => {
    userList = generateUsersList()
    cy.mount(<SelectUser userList={userList} updateUser={updateUser} />)
  })

  it('shows user form', () => {
    cy.get('[data-cy=user-list-select]').should('exist')
  })

  it('lists users in select box', () => {
    cy.get('[data-cy=user-list-select]').click()
    cy.get('[data-cy=user-1]').should('be.visible')
  })

  it('selects user on input change', () => {
    cy.get('[data-cy=user-list-select]').click()
    cy.get('[data-cy=user-4]')
      .click()
      .then(() => {
        expect(selectedUser).to.equal(userList[4])
      })
  })
})
