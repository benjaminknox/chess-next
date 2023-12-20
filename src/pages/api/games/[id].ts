import axios from "axios";
import withMongo from "../../../middleware/database";
import { GameMoveModel, GameModel } from "../../../entities";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const game = await GameModel.findOne({ id: req.query.id }).exec();

      if (game) {
        res.status(200).json(game);
      } else {
        res.status(404);
      }
    } catch (ex) {
      throw ex;
    }
  }
}

export default withMongo(handler);
