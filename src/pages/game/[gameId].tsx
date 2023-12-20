import { Chess } from "chess.js";
import { GameModel } from "../../entities";
import type { Chess as ChessType } from "chess.js";
import type { GetServerSidePropsContext } from "next";
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
  context: GetServerSidePropsContext
) => {
  await mongoConnect();

  const game = await GameModel.findOne({ id: context.query.gameId }).exec();

  return {
    props: { 
      gameId: context.query.gameId,
      lastMove: game.moves[game.moves.length - 1].move
    },
  };
};
