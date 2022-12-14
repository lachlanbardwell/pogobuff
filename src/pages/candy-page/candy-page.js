import { NavBar } from "../../components/nav-bar/nav-bar";
import { useContext, useState } from "react";
import { UserContext } from "../../context";
import rareC from "../../img/rare.webp";
import xLC from "../../img/xl-candy.webp";
import { Button, Input, List, Tooltip } from "@material-ui/core";
import "./candy-page.css";

export const CandyPage = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [candidates, setCandidates] = useState([""]);
  const [newCandidate, setNewCandidate] = useState("");

  const handleCandy = (event, type) => {
    event.preventDefault();
    setUserData((prev) => {
      return {
        ...prev,
        [type]: event.target.value > 0 ? event.target.value : 0,
      };
    });
  };

  const handleCandidate = (event) => {
    event.preventDefault();
    setNewCandidate(event.target.value);
  };

  const addNewCandidate = () => {
    if (!newCandidate) {
      return;
    }
    setCandidates((prev) => [...prev, newCandidate]);
    setNewCandidate("");
  };

  return (
    <section className="candy-page">
      <NavBar />
      <div className="current-candy">
        <h5>
          Current: <img height={100} width={100} src={rareC} alt="rare candy" />
          &nbsp;x&nbsp;
          <Input
            type="number"
            onChange={(e) => handleCandy(e, "candy")}
            value={userData.candy}
          ></Input>
        </h5>
        <h5>
          Current XL: <img height={70} width={70} src={xLC} alt="XL candy" />
          &nbsp;x&nbsp;
          <Input
            type="number"
            onChange={(e) => handleCandy(e, "candyXL")}
            value={userData.candyXL}
          ></Input>
        </h5>
      </div>
      <div className="candy-pokes">
        <span>
          <h5>Candy Priorities:</h5>
          <Input
            type="string"
            onChange={(e) => handleCandidate(e)}
            value={newCandidate}
          ></Input>
          <Tooltip title="Add to List">
            <Button onClick={() => addNewCandidate()}>{"->"}</Button>
          </Tooltip>
        </span>
        {candidates.map((next, i) => {
          return <List key={i}>{next}</List>;
        })}
      </div>
    </section>
  );
};
