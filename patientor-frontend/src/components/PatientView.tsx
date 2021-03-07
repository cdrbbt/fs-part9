/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { useParams } from 'react-router';
import { updatePatient, useStateValue } from "../state";

import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Icon } from 'semantic-ui-react';
import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from '../types';


const PatientView = () => {
  const { id } = useParams<{id: string}>();
  const [{ patients }, dispatch] = useStateValue();

  const fetchPatient = async () => {
    const res = await axios.get(apiBaseUrl.concat(`/patients/${id}`));
    console.log(res);
    const patient = res.data;
    dispatch(updatePatient(patient));
  };

  if (!patients[id].ssn) {
    try{
      void fetchPatient();
    } catch (e) {
      console.log(e);
    }
    return <p>loading</p>;
  }

  const patient = patients[id];

  console.log(patient);

  return (
    <div>
      <h2>{patient.name} {patient.gender === 'male' ? <Icon name="mars"/> : <Icon name="venus"/>}</h2>
      <div>ssn: {patient.ssn}</div>
      <div>date of birth: {patient.dateOfBirth}</div>
      <div>occupation: {patient.occupation}</div>
      {patient.entries ? patient.entries.map(e => <li key={e.id}><EntryDetails entry={e}/></li>) :null}
    </div>
  );
};

export default PatientView;

const EntryDetails = ({ entry }: { entry: Entry }): JSX.Element => {

  const [{ diagnoses }] = useStateValue();

  //should throw error instead of null if diagnosis not found and pass as child, not element
  const diagnosDetails = entry.diagnosisCodes 
  ? <ul>
    {entry.diagnosisCodes.map( c => {
      const diagnosis = diagnoses.find( d => d.code === c);
      if (!diagnosis) return null;
      return <li key={c}>{`${c}: ${diagnosis.name}`}</li>;
    })}
  </ul>
  : null;

const assertNever = (value: never): never => {

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`invalid entry ${value}`);
};

  switch (entry.type) {
    case "HealthCheck": {
      return <HealthCheckEntryDetails entry={entry} diagnosDetails={diagnosDetails}/>;
    }
    case "Hospital": {
      return <HospitalEntryDetails entry={entry} diagnosDetails={diagnosDetails}/>;
    }
    case "OccupationalHealthcare": {
      return <OccupationalHealthcareEntryDetails entry={entry} diagnosDetails={diagnosDetails}/>;
    }
    default: return assertNever(entry);
  }
};


//should handle giagnoses in entryDetails instead of every detail
const HealthCheckEntryDetails = ({ entry, diagnosDetails }: { entry: HealthCheckEntry, diagnosDetails: JSX.Element | null }):JSX.Element => {
  return (
    <div>
      <div>{entry.date} <Icon name="doctor"/></div>
      <div>{entry.description}</div>
      <div>{`health score: ${entry.healthCheckRating}`}</div>
      {diagnosDetails}
      </div>
  );
};

const HospitalEntryDetails = ({ entry, diagnosDetails }: { entry: HospitalEntry, diagnosDetails: JSX.Element | null }):JSX.Element => {
  return (
    <div>
      <div>{entry.date} <Icon name="hospital"/></div>
      <div>{entry.description}</div>
      <div>{`Discharged: ${entry.discharge.date} ${entry.discharge.criteria}`}</div>
      {diagnosDetails}
    </div>
  );
};

const OccupationalHealthcareEntryDetails = ({ entry, diagnosDetails }: { entry: OccupationalHealthcareEntry, diagnosDetails: JSX.Element | null }):JSX.Element => {
  return (
    <div>
      <div>{entry.date} <Icon name="hospital symbol"/></div>
      <div>{entry.employerName}</div>
      <div>{entry.description}</div>
      {entry.sickLeave ? <div>{`Sick leave from ${entry.sickLeave.startDate} to ${entry.sickLeave.endDate}`}</div> : null}
      {diagnosDetails}
    </div>
  );
};