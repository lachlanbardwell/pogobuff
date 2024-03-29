import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Input, MenuItem } from "@mui/material";
import { pokeApi } from "../../helpers/api-url";
import { debounce } from "../../helpers/debounce";
import { ConfirmButton } from "../../components/confirm-button/confirm-button";
import SearchIcon from "@mui/icons-material/Search";
import "./rewards-page.css";

interface IPoke {
  name: string;
  url: string;
}

interface ISeenPoke {
  name: string;
  quantity: number;
}

export const RewardsPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<ISeenPoke[]>([]);

  const getPokemon: () => void = useMemo(
    () =>
      debounce(async () => {
        try {
          const data = await axios.get(`${pokeApi}pokemon?limit=2000&offset=0`);
          const results = data.data.results;
          const match = results.filter((match: IPoke) =>
            match.name.toLowerCase().includes(searchInput.toLowerCase())
          );
          const names = match.map((next: IPoke) => next.name);
          setOptions(names);
        } catch (error) {
          console.error(error);
        }
      }, 500),
    [searchInput]
  );

  useEffect(() => {
    if (searchInput.length < 3) {
      setOptions([]);
      return;
    }
    setMenuOpen(true);
    getPokemon();
  }, [searchInput, getPokemon]);

  const handleSelect = (pokemon: string) => {
    if (selected.find((next: ISeenPoke) => next.name === pokemon)) {
      console.log("Pokemon already in list");
      return;
    }
    setSelected((prev) => [...prev, { name: pokemon, quantity: 1 }]);
    setMenuOpen(false);
  };

  const removePoke: (pokemon: string) => void = (pokemon) => {
    const newArr = selected.filter((match) => match.name !== pokemon);
    setSelected(newArr);
  };

  const addQuantity: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ind: number
  ) => void = (event, ind) => {
    let num = Number(event.target.value);
    if (num < 1) {
      return;
    }
    setSelected((prev) => {
      const updatedSelected = [...prev];
      updatedSelected[ind] = {
        ...updatedSelected[ind],
        quantity: num,
      };
      return updatedSelected;
    });
  };

  return (
    <section className="rewards-page" onClick={() => setMenuOpen(false)}>
      <div className="rewards-input">
        <div className="search-input">
          <SearchIcon style={{ color: "black", paddingRight: "10px" }} />
          <Input
            placeholder="Encounter"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        {menuOpen && (
          <div className="menu-options">
            {options.map((next, i) => {
              return (
                <MenuItem
                  key={i}
                  value={next}
                  onClick={() => handleSelect(next)}
                >
                  {next}
                </MenuItem>
              );
            })}
            {!options.length && searchInput.length > 2 && (
              <p>
                <i>No pokemon found</i>
              </p>
            )}
          </div>
        )}

        {selected.map((next, i) => {
          return (
            <span key={i} className="selected-pokes">
              <p className="poke-tag">{next.name}</p>
              <Input
                type="number"
                className="poke-amount"
                placeholder="quantity"
                value={next.quantity}
                onChange={(e) => addQuantity(e, i)}
              />
              <ConfirmButton
                cancel={true}
                confirmFn={() => removePoke(next.name)}
              />
            </span>
          );
        })}
      </div>
    </section>
  );
};
