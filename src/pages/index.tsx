import Link from "next/link";
import { Space } from "../components";
import { Grid, Fab, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ForwardIcon from "@mui/icons-material/Forward";

const classes = {
  fab: {
    width: "232px",
    color: "#FFF",
    fontWeight: "bold",
    justifyContent: "left",
    letterSpacing: "1px",
  },
  fabText: {
    marginTop: "3px",
    marginLeft: "8px",
  },
  fabAddIcon: {
    opacity: 0.5,
  },
  fabForwardIcon: {
    opacity: 0.54,
    fontSize: "12pt",
    marginLeft: "7px",
  },
};

const Index = () => {
  return (
    <Grid data-cy="home">
      <Grid item>
        <Fab
          sx={classes.fab}
          variant="extended"
          color="primary"
          component={Link}
          href="/new-game/select-opponent"
          data-cy="start-a-new-game"
        >
          <AddIcon sx={classes.fabAddIcon} />
          <Box sx={classes.fabText}>Start a New Game</Box>
        </Fab>
      </Grid>
      <Space size={24} />
      <Grid item>
        <Fab
          sx={classes.fab}
          variant="extended"
          color="secondary"
          component={Link}
          href="/game/latest"
          data-cy="continue-last-game"
        >
          <ForwardIcon sx={classes.fabForwardIcon} />
          <Box sx={classes.fabText}>Continue Last Game</Box>
        </Fab>
      </Grid>
    </Grid>
  );
};

export default Index;
