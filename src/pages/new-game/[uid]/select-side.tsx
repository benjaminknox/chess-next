import Color from "color";
import axios from "axios";
import { Grid, Fab } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { Game, Side } from "../../../types";
import { Space } from "../../../components";
import { useSession } from "next-auth/react";
import { colorScheme } from "../../../common";

import type { GetServerSidePropsContext } from "next";

const classes = {
  button: {
    width: "168px",
    fontWeight: "bold",
  },
  blackButton: {
    background: colorScheme.darkest,
    color: colorScheme.lightest,
    "&:hover": {
      background: Color(colorScheme.darkest).lighten(0.3).hex(),
    },
  },
  whiteButton: {
    background: "#FFFFFF",
    color: colorScheme.darkest,
    "&:hover": {
      background: "#EFEFEF",
    },
  },
};

export default function SelectSide({ uid }: { uid: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const startGame = async (selectedSide: string) => {
    const white_player =
      selectedSide === Side.white ? (session.user as { id: string }).id : uid;
    const black_player =
      selectedSide === Side.black ? (session.user as { id: string }).id : uid;

    const response = await axios("/api/games", {
      method: "POST",
      data: {
        white_player,
        black_player,
      },
      headers: {
        "Content-type": "application/json",
      },
    });

    router.push(`/game/${response.data.id}`);
  };

  return (
    <Grid data-cy="select-opponent">
      <Grid item>
        <Fab
          variant="extended"
          data-cy="black-player"
          onClick={() => startGame(Side.black)}
          sx={{ ...classes.button, ...classes.blackButton }}
        >
          Play as Black
        </Fab>
      </Grid>
      <Space size={24} />
      <Grid item>
        <Fab
          variant="extended"
          data-cy="white-player"
          onClick={() => startGame(Side.white)}
          sx={{ ...classes.button, ...classes.whiteButton }}
        >
          Play as White
        </Fab>
      </Grid>
    </Grid>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => (
  {
    props: { uid: context.query.uid },
  }
)
