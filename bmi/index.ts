import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const params = req.query;

  if (isNaN(Number(params.weight)) ||isNaN(Number(params.height))){
    res.status(400).send({error: "malformatted parameters"});
  }

  const height = Number(params.height);
  const weight = Number(params.weight);
  
  const resObj = {
    weight,
    height,
    bmi: calculateBmi(height, weight)
  };
  res.send(resObj);
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const body: any = req.body;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!body.daily_exercises || !body.target) {
    res.status(400).send('parameters missing');
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const target: any = body.target;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const data: Array<any> = body.daily_exercises;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if ((typeof target !== 'number') || data.some(d => !(typeof d === 'number'))) {
    res.status(400).send('malformatted parameters');
  }

  const resData = calculateExercises(data, target);

  res.send(resData);
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server at ${PORT}`);
});