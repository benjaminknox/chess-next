import axios from 'axios'
import request from 'supertest'
import { GameModel } from 'entities'
import { getConfig, IConfig } from 'config'

jest.mock('axios')
jest.mock('bootstrap/redis')

import app from 'app'

describe('gamesRouter', () => {
  let config: IConfig = getConfig()

  const keyCloakServiceTokenUrl = `${config.keycloakUri}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`
  const keyCloakServiceTokenResp = {
    access_token: 'service-account-access-token',
    expires_in: 600,
    refresh_expires_in: 0,
    token_type: 'Bearer',
    'not-before-policy': 0,
    scope: 'email profile',
  }

  const player1 = 'player1'
  const player2 = 'player2'
  const player3 = 'player3'
  const player4 = 'player4'
  const players = [player1, player2, player3, player4]

  const urls = players.map(id => ({
    id,
    url: `${config.keycloakUri}/auth/admin/realms/${config.keycloakRealm}/users/${id}`,
  }))

  let server: any

  beforeEach(() => {
    server = app()
  })

  beforeAll(() => {
    //@ts-ignore
    axios.mockImplementation(request => {
      if (request.url === keyCloakServiceTokenUrl) {
        return Promise.resolve({
          status: 200,
          data: keyCloakServiceTokenResp,
        })
      }

      const urlIndex = urls.map(url => url.url).indexOf(request.url)
      if (urlIndex !== -1) {
        const player = urls[urlIndex]

        return Promise.resolve({
          data: {
            id: player.id,
            createdTimestamp: 1617669141774,
            username: player.id,
            enabled: true,
            totp: false,
            emailVerified: true,
            firstName: player.id,
            lastName: 'User',
            email: `${player.id}@test.email`,
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
        })
      }

      return Promise.resolve({
        data: request.url === 'http://test-client/validate' ? { sub: 'player1' } : {},
      })
    })
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('when listing games', () => {
    const insertGames = async () => {
      const index = Math.floor(Math.random() * 4)

      const games = Array.from({ length: 15 }, () => ({
        white_player: player1,
        black_player: players[Math.floor(Math.random() * 3 + 1)],
      }))

      return await Promise.all(
        games
          .map(
            async game => await request(server.callback()).post('/api/games').send(game)
          )
          .map(async response => (await response).body)
      )
    }
    it('should show first page, or 10 games, for the user', async () => {
      await insertGames()

      const response = await request(server.callback()).get('/api/games')

      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveLength(10)
    })

    it('should show second page of games for the user', async () => {
      const games = await insertGames()

      const response = await request(server.callback()).get('/api/games?page=2')

      expect(response.statusCode).toBe(200)
      expect(response.body[0].id).toEqual(games[10].id)
      expect(response.body[0].white_player.id).toEqual(games[10].white_player)
      expect(response.body[0].black_player.id).toEqual(games[10].black_player)
    })

    it('should show 15 games for larger page parameter', async () => {
      const games = await insertGames()

      const response = await request(server.callback()).get('/api/games?pageSize=15')

      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveLength(15)
    })
  })

  describe('when creating a game', () => {
    it('creates games with correct players and configuration', async () => {
      await request(server.callback()).post('/api/games').send({
        white_player: player1,
        black_player: player2,
      })

      await request(server.callback()).post('/api/games').send({
        white_player: player3,
        black_player: player4,
      })

      const gameModels = await GameModel.find().exec()

      const firstMove = {
        move: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move_number: 1,
      }

      expect(gameModels.length).toBe(2)
      expect(gameModels[0].white_player).toBe(player1)
      expect(gameModels[0].black_player).toBe(player2)
      expect(gameModels[0].moves[0]).toMatchObject(firstMove)

      expect(gameModels[1].white_player).toBe(player3)
      expect(gameModels[1].black_player).toBe(player4)
      expect(gameModels[1].moves[0]).toMatchObject(firstMove)
    })
  })

  describe('when game exists', () => {
    describe('when getting the last game started', () => {
      it('should return the game if current player is white', async () => {
        await request(server.callback()).post('/api/games').send({
          white_player: player1,
          black_player: player2,
        })

        const { id } = (
          await request(server.callback()).post('/api/games').send({
            white_player: player1,
            black_player: player2,
          })
        ).body

        const subject = await request(server.callback()).get('/api/games/latest')

        expect(subject.body.id).toStrictEqual(id)
        expect(subject.status).toEqual(200)
      })
      it('should return the game if current player is black', async () => {
        await request(server.callback()).post('/api/games').send({
          white_player: player1,
          black_player: player2,
        })

        const { id } = (
          await request(server.callback()).post('/api/games').send({
            white_player: player3,
            black_player: player1,
          })
        ).body

        const subject = await request(server.callback()).get('/api/games/latest')

        expect(subject.body.id).toStrictEqual(id)
        expect(subject.status).toEqual(200)
      })
    })

    it('should return an existing game', async () => {
      const { id } = (
        await request(server.callback()).post('/api/games').send({
          white_player: player1,
          black_player: player2,
        })
      ).body

      const response = await request(server.callback()).get(`/api/games/${id}`)

      expect(response.body.id).toStrictEqual(id)
    })

    describe('when player moves', () => {
      let gameResponse: any
      const firstMove = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      const secondMove = 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2'

      beforeEach(async () => {
        gameResponse = await request(server.callback()).post('/api/games').send({
          white_player: player1,
          black_player: player2,
        })

        await request(server.callback())
          .post(`/api/games/${gameResponse.body.id}/move`)
          .send({
            move: firstMove,
          })

        await request(server.callback())
          .post(`/api/games/${gameResponse.body.id}/move`)
          .send({
            move: secondMove,
          })
      })

      describe('when the move is valid', () => {
        it('adds a move to the collection', async () => {
          const gameModels = await GameModel.find().exec()

          expect(gameModels[0].moves.length).toBe(2)

          expect(gameModels[0].moves[1].move).toBe(firstMove)
          expect(gameModels[0].moves[1].move_number).toBe(2)
        })
      })

      describe('when the move is invalid', () => {
        const illegalMove =
          'rnbqkbnr/pp2pppp/8/2pp4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e3 0 2'

        describe('when the black moves but it is not the logged in user move', () => {
          it('should not save the move', async () => {
            const response = await request(server.callback())
              .post(`/api/games/${gameResponse.body.id}/move`)
              .send({
                move: secondMove,
              })

            expect(response.statusCode).toBe(422)
          })
        })
      })
    })
  })

  describe("when game doesn't exist", () => {
    it('should return 404', async () => {
      const response = await request(server.callback()).get(
        `/api/games/test-uuid-for-game`
      )
      expect(response.statusCode).toBe(404)
    })
  })
})
