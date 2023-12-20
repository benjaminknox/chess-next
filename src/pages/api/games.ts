import axios from "axios";
import withMongo from "../../middleware/database";
import { GameMoveModel, GameModel } from "../../entities";
import type { NextApiRequest, NextApiResponse } from "next";
import { getKeycloakAdminAccess } from "../../utils/getKeycloakAdminAccess";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin: any = await getKeycloakAdminAccess();

  if (req.method === "POST") {
    try {
      const white_player = req.body.white_player;
      const black_player = req.body.black_player;

      const firstMove = new GameMoveModel();

      firstMove.move =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      firstMove.move_number = 1;

      const game = await GameModel.create({
        white_player,
        black_player,
        moves: [firstMove],
      });

      res.status(200).json(await GameModel.findOne({ id: game.id }).exec());
    } catch (ex) {
      throw ex;
    }
  }
}

export default withMongo(handler);
