import { Button } from "@mui/material";

export const ScoreButton = (props) => {
  return (
    <Button
      onClick={() => props.updateScore(props.side)}
      sx={{ borderRadius: "8", backgroundColor: "black", margin: "auto" }}
      variant="contained"
    >
      {props.score}
    </Button>
  );
};
