import express from 'express'

const app = express()

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!')
})

const PORT = 3002

app.listen(PORT, () => {
  console.log(`Server at ${PORT}`)
})