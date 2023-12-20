import qs from 'qs'
import axios from 'axios'
import { expect } from '@jest/globals'
import { createMocks } from 'node-mocks-http';

import handleUsersList from '../../../pages/api/users';
import handleUserId from '../../../pages/api/users/[id]';

const config = {
  KEYCLOAK_URI: "http://test",
  KEYCLOAK_REALM: "test",
  OAUTH_CLIENT_ID: "test",
  OAUTH_CLIENT_SECRET: "test"
}

const token = 'test-token'
const authResponseBody = { access_token: token }

jest.mock('axios')

describe('userRouter', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...process.env, ...config };

  })

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('when accessing users', () => {
    const keyCloakServiceTokenUrl = `${config.KEYCLOAK_URI}/auth/realms/${config.KEYCLOAK_REALM}/protocol/openid-connect/token`
    const keyCloakServiceTokenResp = {
      access_token: 'service-account-access-token',
      expires_in: 600,
      refresh_expires_in: 0,
      token_type: 'Bearer',
      'not-before-policy': 0,
      scope: 'email profile',
    }

    const userListUrl = `${config.KEYCLOAK_URI}/auth/admin/realms/${config.KEYCLOAK_REALM}/users`
    const userListResponse = [
      {
        id: '67d99eb9-528t-448c-bc3f-3ei87335f1a5',
        createdTimestamp: 1617669141774,
        username: 'test1',
        enabled: true,
        totp: false,
        emailVerified: true,
        firstName: 'Test1',
        lastName: 'User',
        email: 'test1.user@test.email',
        disableableCredentialTypes: [],
        requiredActions: [],
        notBefore: 0,
        access: {
          manageGroupMembership: false,
          view: true,
          mapRoles: false,
          impersonate: false,
          manage: false,
        },
      },
      {
        id: '27d09ux9-328e-418c-qd3f-3eb80995f1a5',
        createdTimestamp: 1617669141274,
        username: 'test2',
        enabled: true,
        totp: false,
        emailVerified: true,
        firstName: 'Test2',
        lastName: 'User',
        email: 'test2.user@test.email',
        disableableCredentialTypes: [],
        requiredActions: [],
        notBefore: 0,
        access: {
          manageGroupMembership: false,
          view: true,
          mapRoles: false,
          impersonate: false,
          manage: false,
        },
      },
    ]

    const userGetUrl = `${config.KEYCLOAK_URI}/auth/admin/realms/${config.KEYCLOAK_REALM}/users/${userListResponse[0].id}`

    beforeEach(() => {
      //@ts-ignore
      axios.mockImplementation(routes => {
        if (routes.url === userListUrl) {
          return Promise.resolve({
            status: 200,
            data: userListResponse,
          })
        } else if (routes.url === userGetUrl) {
          return Promise.resolve({
            status: 200,
            data: userListResponse[0],
          })
        } else if (routes.url === keyCloakServiceTokenUrl) {
          return Promise.resolve({
            status: 200,
            data: keyCloakServiceTokenResp,
          })
        } else {
          return Promise.resolve({
            status: 200,
          })
        }
      })
    })

    it('gets other users to play', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await handleUsersList(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toStrictEqual(userListResponse)

      expect(axios).toBeCalledWith(
        expect.objectContaining({
          url: keyCloakServiceTokenUrl,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          data: qs.stringify({
            client_id: config.OAUTH_CLIENT_ID,
            grant_type: 'client_credentials',
            client_secret: config.OAUTH_CLIENT_SECRET,
          }),
        })
      )
    })

    it('should get the user from the id', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: userListResponse[0].id,
        },
      });

      await handleUserId(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toStrictEqual(userListResponse[0])
    })
  })
})
