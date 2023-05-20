import React from "react";
import axios from "axios";
import {
  Button,
  Input,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { useContext, useState } from "react";
import { retrieveElo, UserContext } from "../../context";
import { apiURL } from "../../helpers/api-url";
import { IUserState } from "../../types/elo";
import DoneIcon from "@mui/icons-material/Done";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import Rank20 from "../../img/20.png";
import Ace from "../../img/ace.png";
import Veteran from "../../img/veteran.png";
import Expert from "../../img/expert.png";
import Legend from "../../img/legend.png";
import "./elo-info.css";

export const EloInfo = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [name, setName] = useState<string>("");
  const [nameEntered, setNameEntered] = useState(false);
  const [elo, setElo] = useState<number>(0);
  const [eloEntered, setEloEntered] = useState(() => retrieveElo());
  const [rank, setRank] = useState<string>("");

  const handleElo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setElo(Number(e.target.value));
  };

  const submitName = async () => {
    try {
      await axios.post(`${apiURL}/api/sets`, { playername: name });
      const data = await axios.get(`${apiURL}/api/sets`);
      console.log(data);
      setNameEntered(true);
      setUserData((prev: IUserState) => {
        return {
          ...prev,
          elo: {
            ...prev.elo,
            playername: name,
          },
          sets: [...prev.sets],
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  const submitElo = async () => {
    try {
      await axios.post(`${apiURL}/api/sets`, { elo: elo });
      const data = await axios.get(`${apiURL}/api/sets`);
      console.log(data);
      setEloEntered(true);
      setUserData((prev: IUserState) => {
        return {
          ...prev,
          elo: {
            ...prev.elo,
            starting: elo,
            current: prev.elo.change && elo ? elo + prev.elo.change : elo,
            change: prev.elo.change ? prev.elo.change : 0,
            ending: prev.elo.ending ? prev.elo.ending : elo,
          },
          sets: [...prev.sets],
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  const calcBadge = (rank: number) => {
    switch (true) {
      case rank < 2000:
        return Rank20;
      case rank < 2500:
        return Ace;
      case rank < 2750:
        return Veteran;
      case rank < 3000:
        return Expert;
      default:
        return Legend;
    }
  };

  const totalScore = () => {
    const winsArray = userData.sets.map((next) => next.wins);
    const wins = winsArray.reduce((a, b) => a + b, 0);
    const lossesArray = userData.sets.map((next) => next.losses);
    const losses = lossesArray.reduce((a, b) => a + b, 0);
    const tiesArray = userData.sets.map((next) => next.ties);
    const ties = tiesArray.reduce((a, b) => a + b, 0);
    return `${wins} - ${losses} ${ties > 0 ? `- ${ties}` : ""}`;
  };

  return (
    <div className="current-stats">
      <div className="player-badge">
        <span className="player-tag">Player rank</span>
        <FormControl fullWidth>
          <InputLabel>Rank</InputLabel>
          <Select
            label="Rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          >
            <MenuItem value={1900}>20</MenuItem>
            <MenuItem value={2000}>Ace</MenuItem>
            <MenuItem value={2500}>Veteran</MenuItem>
            <MenuItem value={2750}>Expert</MenuItem>
            <MenuItem value={3000}>Legend</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="elo-display">
        <img
          src={calcBadge(Number(rank))}
          height={40}
          width={40}
          alt="ace rank badge"
        />
        <div className="elo-info">
          {!nameEntered ? (
            <span className="enter-elo">
              <h6>Playername:&nbsp;</h6>
              <Input
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
              <Button onClick={() => submitName()}>
                <DoneIcon />
              </Button>
            </span>
          ) : (
            <span className="edit-elo">
              <Tooltip title="Playername">
                <h6>{userData.elo.playername}</h6>
              </Tooltip>
              <Tooltip title="Edit">
                <EditIcon
                  onClick={() => setNameEntered(false)}
                  sx={{
                    fontSize: 14,
                    marginLeft: "25%",
                    "&:hover": { cursor: "pointer" },
                  }}
                />
              </Tooltip>
            </span>
          )}

          {!eloEntered ? (
            <span className="enter-elo">
              <h6>Starting Elo:&nbsp;</h6>
              <Input
                type="number"
                value={elo === 0 ? "" : elo}
                placeholder=" #"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleElo(e)
                }
              />
              <Button onClick={() => submitElo()}>
                <DoneIcon />
              </Button>
            </span>
          ) : (
            <span className="edit-elo">
              <Tooltip title="Starting rank">
                <h6>{userData.elo.starting}</h6>
              </Tooltip>
              <Tooltip title="Edit">
                <EditIcon
                  onClick={() => setEloEntered(false)}
                  sx={{
                    fontSize: 14,
                    marginLeft: "25%",
                    "&:hover": { cursor: "pointer" },
                  }}
                />
              </Tooltip>
            </span>
          )}
        </div>
      </div>
      {eloEntered && <h6>Estimated Rank {userData.elo.current} </h6>}
      <h6>{`Record: ${totalScore()}`}</h6>
    </div>
  );
};
