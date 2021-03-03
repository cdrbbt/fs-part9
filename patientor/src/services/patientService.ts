import { NonSensitivePatient } from '../types';
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