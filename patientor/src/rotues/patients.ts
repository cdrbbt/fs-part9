import express from 'express';
import { addPatient, getPatient, getPatients } from '../services/patientService';
import { parseNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(getPatients());
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    res.send(getPatient(id));
  } catch (e) {
    const error = e as Error;
    res.status(400).send(error.message);
  }
});


router.post('/', (req, res) => {
  try {
    const newPatient = parseNewPatient(req.body);
    res.send(addPatient(newPatient));
  } catch (e) {
    const error = e as Error;
    res.status(400).send(error.message);
  }
});

export default router;