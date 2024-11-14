import express from 'express';
import { bmiCalculator } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

const isNumber = (value: any) => !isNaN(Number(value));

const sendError = (res: any, message: string, statusCode: number = 400) => {
  return res.status(statusCode).send({ error: message });
};

app.get("/hello", (_req, res) => {
  res.send("hello fullstack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  
  if (!isNumber(height) || !isNumber(weight)) {
    return sendError(res, "wrong parameters");
  }
  
  const bmi = bmiCalculator(height, weight);
  const bmiData = {
    weight,
    height,
    bmi
  };
  
  res.status(200).send(bmiData);
});

app.post("/exercise", (req, res) => {
  const dailyExercises = req.body.dailyExercises;
  const number = req.body.target;

  if (!dailyExercises || !number) {
    return sendError(res, "parameters missing");
  }

  if (!isNumber(number) || !Array.isArray(dailyExercises) || dailyExercises.some((e: any) => !isNumber(e))) {
    return sendError(res, "malformatted parameters");
  }

  try {
    const result = calculateExercises(number, dailyExercises);
    res.status(200).send({ result });
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message);
    }
    return sendError(res, 'something went wrong');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`I am listening at port ${PORT}`);
});
