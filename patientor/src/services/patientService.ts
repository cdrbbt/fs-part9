import { NewPatient, NonSensitivePatient, Patient } from '../types';
import {v1 as uuid} from 'uuid';
import patients from '../../data/patients';

 export const getPatients = ():NonSensitivePatient[] => {
   return patients.map(({ id, name, dateOfBirth, gender, occupation}) => ({
     id,
     name,
     dateOfBirth,
     gender,
     occupation,
     entries:[]
   })
  );
};

export const getPatient = (id: string): Patient => {
  console.log(patients)
  const patient = patients.find(p => p.id === id);
  if (!patient) throw new Error (`invalid id ${id}`);
  return patient;
};

export const addPatient = (newPatient: NewPatient): Patient => {
  const id = uuid();
  const patient ={
    ...newPatient,
    id
  };
  patients.push(patient);
  return patient;
};