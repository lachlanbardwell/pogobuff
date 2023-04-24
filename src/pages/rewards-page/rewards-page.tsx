import React, { useState } from "react";
import axios from "axios";
import { BackButton } from "../../components/back-button/back-button";
import { NavBar } from "../../components/nav-bar/nav-bar";
import { Button, Input } from "@mui/material";
import { pokeApi } from "../../helpers/api-url";
import "./rewards-page.css";

interface IPoke {
  name: string;
  url: string;
}

export const RewardsPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>("");

  const getPokemon: () => void = async () => {
    try {
      const data = await axios.get(`${pokeApi}pokemon?limit=2000&offset=0`);
      const results = data.data.results;
      console.log(results);
      console.log("search", searchInput);
      const match = results.filter((match: IPoke) =>
        match.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      console.log("match", match);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="rewards-page">
      <NavBar />
      <BackButton />
      <div className="rewards-input">
        <span>
          <Input
            placeholder="Encounter"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button onClick={() => getPokemon()}>Search</Button>
        </span>
        <Input type="number" placeholder="Seen" />
      </div>
    </section>
  );
};