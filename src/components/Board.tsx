import { MoveInfo } from '.'
import { Chess } from 'chess.js'
import { Box } from '@mui/material'

import { Chessboard } from 'react-chessboard'

export interface BoardProps {
  chess: typeof Chess
  move: (sourceSquare: string, targetSquare: string, piece: string) => boolean
  blackPlayer: React.ReactNode
  whitePlayer: React.ReactNode
}

const classes = {
  turnIndicator: {
    top: '8px',
    left: '8px',
  },
}

export function Board({ chess, move, blackPlayer, whitePlayer }: BoardProps) {
  return (
    <>
      <Box position='absolute' sx={classes.turnIndicator}>
        <MoveInfo board={chess} />
      </Box>
      <div style={{width: '35rem'}}>
        {blackPlayer}
        <Chessboard position={chess.fen()} onPieceDrop={move} />
        {whitePlayer}
      </div>
    </>
  )
}
