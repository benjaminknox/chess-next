import axios from "axios";
import { Chess } from "chess.js";
import withMongo from "../../../../middleware/database";
import type { NextApiRequest, NextApiResponse } from "next";
import { publishMessage } from '../../../../middleware/redis';
import { GameMoveModel, GameModel } from "../../../../entities";

import { authOptions } from '../../auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {

    const session = await getServerSession(req, res, authOptions)

    try {
      const gameId = req.query.id
      let game = await GameModel.findOne({ id: gameId }).exec()
      if (game) {
        const turn =
          new Chess(game.moves[game.moves.length - 1].move).turn() === 'b'
            ? 'black_player'
            : 'white_player'

        if ((session.user as {id:string}).id !== game[turn]) {
          res.status(404);
        } else {
          const gameMove = new GameMoveModel()

          gameMove.move = req.body.move
          gameMove.move_number = game.moves.length + 1

          game.moves.push(gameMove)

          res.socket.server.io.emit(gameId, gameMove.move)

          game = await game.save()

          res.status(200).json(game);
        }
      } else {
        res.status(404)
      }
    } catch (ex) {
      throw ex
    }
  }
}

export default withMongo(handler);
