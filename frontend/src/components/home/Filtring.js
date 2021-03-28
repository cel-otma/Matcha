import React from "react";
import Slider from "@material-ui/core/Slider";
import { Select } from "../profl_information/select";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";


const currencies1 = [
  {
    value: "1",
    label: "Age",
  },
  {
    value: "2",
    label: "Rating",
  },
  {
    value: "3",
    label: "Commontags",
  },
  {
    value: "4",
    label: "Location",
  },
];

export default function Filtring(props) {

  return (
    <div className="mainfilter">
      <label>Age:</label>
      <Slider
        max={100}
        min={0}
        value={props.age}
        onChange={(event, newValue) => {
          props.setAge(newValue);
        }}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        // getAriaValueText={valuetext}
      />
      <label>Location:</label>
      <Slider
        max={12700}
        min={0}
        value={props.location}
        onChange={(event, newValue) => {
          props.setLocation(newValue);
        }}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        // getAriaValueText={valuetext}
      />
      <label>Rating:</label>
      <Slider
        max={5}
        min={0}
        value={props.rating}
        onChange={(event, newValue) => {
          props.setRating(newValue);
        }}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        // getAriaValueText={valuetext}
      />
      <label>Common tags:</label>
      <Slider
        max={100}
        min={0}
        value={props.ctags}
        onChange={(event, newValue) => {
          props.setctags(newValue);
        }}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        // getAriaValueText={valuetext}
      />
      <Select list={["sport"]} active={props.intereststags} change={(active) => props.setIntereststags([...active])} />
      <div className="col-md-4">
        <TextField
          style={{ width: "100%" }}
          id="outlined-select-currency"
          select
          label="Sort By:"
          value={props.sortType}
          name="lookingfor"
          onChange={(event) => {
            props.setsort(event.target.value);
          }}
          variant="outlined"
        >
          {currencies1.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <button id="searchbtn" onClick={() => {
          props.filterClick()
      }}>
        Search
      </button>
    </div>
  );
}
