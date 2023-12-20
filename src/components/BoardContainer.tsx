import axios from "axios";
import { uuid } from "uuidv4";
import { Chess } from "chess.js";
import { Game } from "../types";
import { useState, useEffect } from "react";
import { PlayerCardContainer, Board } from ".";
import { useSession } from "next-auth/react";
import useWebSocket from "react-use-websocket";
import type { Chess as ChessType } from "chess.js";

export interface BoardContainerProps {
  gameId: string;
  lastMove: ChessType;
}

export function BoardContainer({ gameId, lastMove = new Chess() }: BoardContainerProps) {
  const { data: session, status } = useSession();
  const [game, setGame] = useState<Game<string>>();
  const [board, setChess] = useState<ChessType>(lastMove);

  const [gameSocketUri, setGameSocketUri] = useState<string>(
    "wss://echo.websocket.org"
  );
  const { lastMessage } = useWebSocket(gameSocketUri);

  useEffect(() => {
    if (lastMessage) setChess(new Chess(lastMessage.data));
  }, [lastMessage]);

  useEffect(() => {
    axios(`/api/games/${gameId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then(async (response) => response.data)
      .then(async (body: Game<string>) => {
        setGame(body);
        if (body.moves.length > 0) {
          setChess(new Chess(body.moves[body.moves.length - 1].move));
        }

        setGameSocketUri(
          `${process.env.NEXT_PUBLIC_WEBSOCKET_URI}/games/${body.id}`
        );
      });
  }, [gameId]);

  const validMove = (piece: string) =>
    game &&
    game[piece[0] === "b" ? "black_player" : "white_player"] ===
      (session.user as { id?: string }).id;

  const move = async (sourceSquare: string, targetSquare: string, piece: string) => {
    if (!game || !validMove(piece)) return false;

    const move = board.move({ from: sourceSquare, to: targetSquare });

    axios(`/api/games/${game.id}/move`, {
      method: "POST",
      data: {
        move: board.fen(),
      },
      headers: {
        "Content-type": "application/json",
      },
    });

    setChess(new Chess(board.fen()));

    return move;
  };

  return (
    <Board
      key={gameId}
      whitePlayer={
        game && <PlayerCardContainer userId={game.white_player} align="right" />
      }
      blackPlayer={
        game && <PlayerCardContainer userId={game.black_player} align="left" />
      }
      chess={board}
      move={move}
    />
  );
}
