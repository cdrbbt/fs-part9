/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewPatient } from "./types";

export const parseNewPatient = (obj: any): NewPatient => {
  return {
    ssn: parseString(obj.ssn, 'ssn'),
    occupation: parseString(obj.occupation, 'occupation'),
    gender: parseString(obj.gender, 'gender'),
    dateOfBirth: parseDate(obj.dateOfBirth),
    name: parseString(obj.name, 'name')
  };
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