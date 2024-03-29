import { createContext } from "react";
import { IUserState } from "./types/elo";

export const startingSetData = [
  {
    wins: 0,
    losses: 0,
    ties: 0,
  },
  {
    wins: 0,
    losses: 0,
    ties: 0,
  },
  {
    wins: 0,
    losses: 0,
    ties: 0,
  },
  {
    wins: 0,
    losses: 0,
    ties: 0,
  },
  {
    wins: 0,
    losses: 0,
    ties: 0,
  },
];

export const initialUserState: () => IUserState = () => {
  const stored = JSON.parse(sessionStorage.getItem("User Stats") as string);
  return stored
    ? stored
    : {
        elo: {
          playername: "",
          badge: "",
          starting: 0,
          current: 0,
          change: 0,
          ending: 0,
        },
        sets: startingSetData,
        candy: 0,
        candyXL: 0,
      };
};

export const retrieveElo: () => boolean = () => {
  const stored = JSON.parse(sessionStorage.getItem("User Stats") as string);
  return stored.elo.starting ? true : false;
};

export const startingTieState: boolean[] = [false, false, false, false, false];

export const retainTieState = () => {
  const stored = JSON.parse(sessionStorage.getItem("Ties Added") as string);
  return stored ? stored : startingTieState;
};

interface IUserContext {
  userData: IUserState;
  setUserData: React.Dispatch<React.SetStateAction<IUserState>>;
}

export const UserContext = createContext<IUserContext>({
  userData: initialUserState(),
  setUserData: () => {},
});
