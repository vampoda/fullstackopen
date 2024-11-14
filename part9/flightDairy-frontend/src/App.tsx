import React, { useState, useEffect, useMemo } from "react";
import { DiaryEntry, Visibility, Weather } from "./types.ts";
import { getAllDiaries, createDiary } from "./services/diaries.ts";

import {
  TextField,
  InputLabel,
  Grid,
  Button,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
} from "@mui/material";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny); 
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Good); 
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  // Fetch all diaries on component mount
  useEffect(() => {
    getAllDiaries()
      .then(setDiaries)
      .catch((err) => setError(err?.response?.data?.message || 'An error occurred.'));
  }, []);

  // Memoizing the weather and visibility options to prevent unnecessary recalculations
  const weatherOptions = useMemo(() => Object.values(Weather).map((v) => ({
    value: v,
    label: v.toString(),
  })), []);

  const visibilityOptions = useMemo(() => Object.values(Visibility).map((v) => ({
    value: v,
    label: v.toString(),
  })), []);

  const onWeatherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as keyof typeof Weather;
    setWeather(Weather[value]);
  };

  const onVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as keyof typeof Visibility;
    setVisibility(Visibility[value]);
  };

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!date || !comment) {
      setError('Date and comment are required.');
      return;
    }
    createDiary({ date, weather, visibility, comment })
      .then((data) => {
        setDiaries((prev) => [...prev, data]);
        setDate('');
        setComment('');
        setError('');
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to create diary entry.');
      });
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h1>Add an Entry</h1>
      <form onSubmit={diaryCreation}>
        <InputLabel>Date</InputLabel>
        <TextField
          type="date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <FormControl style={{ marginTop: 20 }}>
          <FormLabel>Weather</FormLabel>
          <RadioGroup row value={weather.toString()} onChange={onWeatherChange}>
            {weatherOptions.map((option) => (
              <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
            ))}
          </RadioGroup>
        </FormControl>
        <FormControl style={{ marginTop: 20 }}>
          <FormLabel>Visibility</FormLabel>
          <RadioGroup row value={visibility.toString()} onChange={onVisibilityChange}>
            {visibilityOptions.map((option) => (
              <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
            ))}
          </RadioGroup>
        </FormControl>
        <TextField
          label="Comment"
          fullWidth
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          style={{ marginTop: 20 }}
        />
        <Grid container style={{ marginTop: 25 }}>
          <Grid item xs={12}>
            <Button color="primary" type="submit" fullWidth variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>

      <h1>Diary Entries</h1>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>Visibility: {diary.visibility}</p>
          <p>Weather: {diary.weather}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
