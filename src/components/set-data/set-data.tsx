import React, { useState } from "react";
import { Scorer } from "../scorer/scorer";
import { useContext } from "react";
import { UserContext } from "../../context";
import { IUserState } from "../../types/elo";
import { CustomModal } from "../modal/modal";
import Tooltip from "@mui/material/Tooltip";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import SyncIcon from "@mui/icons-material/Sync";
import EditIcon from "@mui/icons-material/Edit";
import "./set-data.css";

interface ISetData {
  setAddTie: React.Dispatch<React.SetStateAction<boolean[]>>;
  addTie: boolean[];
}

export interface IWinCons {
  firstInput?: string;
  secondInput?: string;
  thirdInput?: string;
}

export const SetData: React.FC<ISetData> = (props) => {
  const { userData, setUserData } = useContext(UserContext);
  const [winnable, setWinnable] = useState<number[]>([0, 0, 0, 0, 0]);
  const [modalIndex, setModalIndex] = useState<number>(-1);
  const [winCons, setWinCons] = useState<IWinCons[]>([
    { firstInput: "", secondInput: "", thirdInput: "" },
    { firstInput: "", secondInput: "", thirdInput: "" },
    { firstInput: "", secondInput: "", thirdInput: "" },
    { firstInput: "", secondInput: "", thirdInput: "" },
    { firstInput: "", secondInput: "", thirdInput: "" },
  ]);

  const addTieToArray = (setNumber: number) => {
    props.setAddTie((prev) =>
      prev.map((next, i) => {
        return i === setNumber || i === prev.length + 1 ? true : next;
      })
    );
  };

  const addWinnable: (
    event: React.ChangeEvent<HTMLInputElement>,
    ind: number
  ) => void = (event, ind) => {
    let num = Number(event.target.value);
    if (num < 0 || num > 5) {
      return;
    }
    const updatedWinnable = [...winnable];
    updatedWinnable[ind] = num;
    setWinnable(updatedWinnable);
  };

  const removeSet = (setNumber: number) => {
    props.setAddTie((prev) => prev.filter((match, ind) => ind !== setNumber));
    const setToRemove = userData.sets.find((match, ind) => ind === setNumber);

    let totalChange = 0;
    if (setToRemove) {
      const winChange = setToRemove.wins > 0 ? setToRemove.wins * 16 : 0;
      const lossChange = setToRemove.losses > 0 ? setToRemove.losses * -16 : 0;
      totalChange = winChange + lossChange;
    }

    setUserData((prev: IUserState) => {
      return {
        ...prev,
        elo: {
          ...prev.elo,
          starting: prev.elo.starting,
          current: prev.elo.current - totalChange,
          change: prev.elo.change - totalChange,
          ending: prev.elo.ending,
        },
        sets: prev.sets.map((match, ind) => {
          if (ind === setNumber) {
            return { wins: 0, losses: 0, ties: 0 };
          }
          return match;
        }),
      };
    });
  };

  const changeModal: (inputs?: IWinCons, index?: number) => void = (
    inputs,
    index
  ) => {
    console.log(inputs, "ins", index);
    //Include 0 value for index
    if (inputs !== undefined && index !== undefined) {
      setWinCons((prev) => {
        const updatedWinCons = [...prev];
        updatedWinCons[index] = inputs;
        return updatedWinCons;
      });
      setModalIndex(-1);
    }
    console.log(winCons);
  };

  return (
    <div className="set-data-box">
      {userData.sets.map((next, ind) => {
        return (
          <div key={ind} className="set-data-inner">
            {`Set ${ind + 1}:`}
            <Scorer id={ind} score={next} addTie={props.addTie[ind]} />
            <div className="set-below">
              <div className="set-winnable">
                <span className="winnable-tag">Winnable games:</span>
                <span className="winnable-input">
                  <input
                    placeholder="0"
                    type="number"
                    value={winnable[ind]}
                    onChange={(e) => addWinnable(e, ind)}
                  />
                  /5
                </span>
                <Tooltip title="Note win conditions">
                  <EditIcon
                    onClick={() => setModalIndex(ind)}
                    sx={{
                      fontSize: 12,
                      "&:hover": { cursor: "pointer" },
                    }}
                  />
                </Tooltip>
              </div>

              {modalIndex === ind && (
                <CustomModal
                  cancelFn={() => setModalIndex(-1)}
                  confirmFn={(localWinCons) => changeModal(localWinCons, ind)}
                  winCons={winCons[ind]}
                  index={ind}
                  prompt="Possible win cons:"
                />
              )}
            </div>
            <span className="set-data-edit">
              {!props.addTie[ind] && (
                <>
                  <Tooltip title="Add a tie">
                    <GraphicEqIcon
                      onClick={() => {
                        addTieToArray(ind);
                      }}
                      sx={{
                        fontSize: 18,
                        marginRight: "auto",
                        marginLeft: "7%",
                        "&:hover": { cursor: "pointer" },
                      }}
                    />
                  </Tooltip>
                </>
              )}
              <Tooltip title="Reset">
                <SyncIcon
                  onClick={() => removeSet(ind)}
                  sx={{
                    fontSize: 18,
                    margin: props.addTie[ind] ? "auto" : "auto 7%",
                    "&:hover": { cursor: "pointer" },
                  }}
                />
              </Tooltip>
            </span>
          </div>
        );
      })}
    </div>
  );
};
