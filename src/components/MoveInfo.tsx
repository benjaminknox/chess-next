import { Chess } from "chess.js";
import { Fab } from "@mui/material";
import { colorScheme } from "../common";

const classes = {
  button: {
    "&, &:hover": {
      cursor: "default",
    },
    width: "168px",
    fontWeight: "bold",
  },
  blackButton: {
    "&, &:hover": {
      background: colorScheme.darkest,
      color: colorScheme.lightest,
    },
  },
  whiteButton: {
    "&, &:hover": {
      background: "#FFFFFF",
      color: colorScheme.darkest,
    },
  },
};

export interface MoveInfoProps {
  board: typeof Chess;
}

export function MoveInfo({ board }: MoveInfoProps) {
  const button =
    board.turn() === "w" ? (
      <Fab
        component="div"
        variant="extended"
        data-cy="white-move"
        sx={{ ...classes.button, ...classes.whiteButton }}
      >
        {"White's Turn"}
      </Fab>
    ) : (
      <Fab
        component="div"
        variant="extended"
        data-cy="black-move"
        sx={{ ...classes.button, ...classes.blackButton }}
      >
        {"Black's Turn"}
      </Fab>
    );

  return <>{button}</>;
}
