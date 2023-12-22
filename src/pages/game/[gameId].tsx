import { Chess } from "chess.js";
import { Document } from "mongoose";
import { useEffect } from "react";
import { Server } from "Socket.IO";
import io from "Socket.IO-client";
import { Game as GameType } from "../../types";
import { GameModel } from "../../entities";
import { getServerSession } from "next-auth/next";
import type { Chess as ChessType } from "chess.js";
import type { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { mongoConnect } from "../../middleware/database";
import { BoardContainer } from "../../components/BoardContainer";

export default function Game({
  gameId,
  lastMove,
}: {
  gameId: string;
  lastMove: string;
}) {
  return <BoardContainer gameId={gameId} lastMove={new Chess(lastMove)} />;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext & { res: { socket: any } }
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!context.res.socket.server.io) {
    context.res.socket.server.io = new Server(context.res.socket.server, {
      path: "/coms",
    });
  }

  await mongoConnect();

  let game: GameType<string>;

  if (context.query.gameId === "latest") {
    const userId = (session.user as { id: string }).id;
    game = await GameModel.findOne<GameType<string>>({
      $or: [{ white_player: userId }, { black_player: userId }],
    })
      .sort({ createdAt: -1 })
      .exec();
  } else {
    game = await GameModel.findOne<GameType<string>>({
      id: context.query.gameId,
    }).exec();
  }

  const lastMove = game.moves[game.moves.length - 1].move;

  return {
    props: {
      gameId: game.id,
      lastMove,
    },
  };
};
