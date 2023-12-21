import axios from "axios";
import { uuid } from "uuidv4";
import { Game } from "../types";
import { Chess } from "chess.js";
import io from 'Socket.IO-client';
import { PlayerCardContainer, Board } from ".";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import type { Chess as ChessType } from "chess.js";

export interface BoardContainerProps {
  gameId: string;
  lastMove: ChessType;
}

export function BoardContainer({ gameId, lastMove = new Chess() }: BoardContainerProps) {
  const { data: session, status } = useSession();
  const [game, setGame] = useState<Game<string>>();
  const [board, setChess] = useState<ChessType>(lastMove);

  const socketInitializer = useCallback(async () => {
    const socket = io("/", {
      path: "/coms"
    })

    socket.on(gameId, move => {
      setChess(new Chess(move))
    })

    return socket
  }, [gameId])

  useEffect(() => {
    socketInitializer()
  }, [socketInitializer])

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
