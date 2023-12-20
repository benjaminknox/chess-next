import * as React from 'react'
import { SinonStub } from 'cypress/types/sinon'
import {
  throwFetchMocks,
  FetchMock,
  mockLookupArgBuilder,
  mockFake,
} from './fetchMocking'

export function mountWithFetchMocking(
  children: React.ReactElement,
  ...mocks: FetchMock[]
): Cypress.Agent<SinonStub> {
  const stub = setupFetchMocks(mocks)
  cy.mount(<>{children}</>)
  return stub
}

function setupFetchMocks(mocks: FetchMock[]): Cypress.Agent<SinonStub> {
  const stub = cy.stub(window, 'fetch')
  const mockedArgs = mockLookupArgBuilder(mocks)

  stub.callsFake(async (path: RequestInfo, params?: RequestInit | undefined) =>
    mockFake(path, params, mockedArgs, mocks)
  )

  return stub
}
