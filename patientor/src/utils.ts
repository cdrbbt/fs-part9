/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Entry, HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry } from './types';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gender, NewPatient } from "./types";

export const parseNewPatient = (obj: any): NewPatient => {
  return {
    ssn: parseString(obj.ssn, 'ssn'),
    occupation: parseString(obj.occupation, 'occupation'),
    gender: parseGender(obj.gender),
    dateOfBirth: parseDate(obj.dateOfBirth),
    name: parseString(obj.name, 'name'),
    entries: []
  };
};

export const parseNewEntry = (obj: any): Omit<Entry, 'id'> =>{
  switch(obj.type){
    case "HealthCheck":{
      return parseHealthCheck(obj);
    }
    case "OccupationalHealthcare": {
      return parseOccupationalHealthcare(obj);
    }
    case "Hospital":{
      return parseHospital(obj);
    }
    default: throw new Error(`Invalid entry type ${obj}`);
  }
};

const parseHealthCheck = (obj: any): Omit<HealthCheckEntry, 'id'> => {
  const parseType = () => {
    if (obj.type === "HealthCheck") return obj.type;
    throw new Error('wrong type');
  };
  return {
    type: parseType(),
    description: parseString(obj.description, 'description'),
    date: parseDate(obj.date),
    specialist: parseString(obj.specialist, 'specialist'),
    diagnosisCodes: parseDianosisCodes(obj.diagnosisCodes),
    healthCheckRating: parseHealthRating(obj.healthCheckRating)
  };
};

const parseHospital = (obj: any): Omit<HospitalEntry, 'id'> => {
  const parseType = () => {
    if (obj.type === "Hospital") return obj.type;
    throw new Error('wrong type');
  };
  return {
    type: parseType(),
    description: parseString(obj.description, 'description'),
    date: parseDate(obj.date),
    specialist: parseString(obj.specialist, 'specialist'),
    diagnosisCodes: parseDianosisCodes(obj.diagnosisCodes),
    discharge: parseDischarge(obj.discharge)
  };
};

const parseOccupationalHealthcare = (obj: any): Omit<OccupationalHealthcareEntry, 'id'> => {
  const parseType = () => {
    if (obj.type === "OccupationalHealthcare") return obj.type;
    throw new Error('wrong type');
  };
  return {
    type: parseType(),
    description: parseString(obj.description, 'description'),
    date: parseDate(obj.date),
    specialist: parseString(obj.specialist, 'specialist'),
    diagnosisCodes: parseDianosisCodes(obj.diagnosisCodes),
    employerName: parseString(obj.employerName, 'employer name'),
    sickLeave: parseSickLeave(obj.sickLeave)
  };
};



const isHealthCheckRating = (rating: any): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(rating);
};

const parseHealthRating = (rating: any): HealthCheckRating => {
  if(!rating || !isHealthCheckRating(rating)){
    throw new Error(`Invalid health rating ${rating}`);
  }
  return rating;
};


const parseDianosisCodes = (codes: any): string[] | undefined => {
  if (!codes) return codes as undefined;
  if (codes && Array.isArray(codes) && codes.every(isString)) {
    return codes;
  }
  throw new Error(`Invalid diagnoses codes ${codes}`);
};

const parseDischarge = (discharge: any): {date: string, criteria: string} => {
if (!discharge) throw new Error(`discharge required`);
const date = discharge.date;
const criteria = discharge.criteria;
if (date && criteria && isString(date) && isDate(date) && isString(criteria)){
  return {date, criteria};
}
throw new Error(`invalid discharge ${discharge}`);
};
  
const parseSickLeave = (sickLeave: any): {startDate: string, endDate: string} | undefined => {
  if (!sickLeave) return undefined;
  const startDate = sickLeave.startDate;
  const endDate = sickLeave.endDate;
  if (startDate && endDate && isString(startDate) && isString(endDate) && isDate(startDate) && isDate(endDate)){
    return {startDate, endDate};
  }
  throw new Error(`invalid sick leave ${sickLeave}`);
};

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string):boolean => {
  return Boolean(Date.parse(date));
};

const parseString = (value: any, valName:string): string => {
  if (!value || !isString(value)){
    throw Error(`invalid ${valName}: ${value}`);
  }
  return value;
};

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)){
    throw new Error('invalid date ' + date);
  }
  return date;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)){
    throw new Error('invalid gender' + gender);
  }
  return gender;
};

const isGender = (gender: any): gender is Gender => {
  return Object.values(Gender).includes(gender);
};