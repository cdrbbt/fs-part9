import express from 'express'
import { calculateBmi } from './bmiCalculator'

const app = express()

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!')
})

app.get('/bmi', (req, res) => {
  const params = req.query

  if (isNaN(Number(params.weight)) ||isNaN(Number(params.height))){
    res.status(400).send({error: "malformatted parameters"})
  }

  const height = Number(params.height)
  const weight = Number(params.weight)
  
  const resObj = {
    weight,
    height,
    bmi: calculateBmi(height, weight)
  }
  res.send(resObj)
})

const PORT = 3002

app.listen(PORT, () => {
  console.log(`Server at ${PORT}`)
})