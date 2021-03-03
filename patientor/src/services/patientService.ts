import { NewPatient, NonSensitivePatient, Patient } from '../types';
import {v1 as uuid} from 'uuid';
import patients from '../../data/patients';

 export const getPatients = ():NonSensitivePatient[] => {
   return patients.map(({ id, name, dateOfBirth, gender, occupation}) => ({
     id,
     name,
     dateOfBirth,
     gender,
     occupation
   })
  );
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