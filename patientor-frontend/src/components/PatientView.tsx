/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { useParams } from 'react-router';
import { updatePatient, useStateValue } from "../state";

import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Button, Icon } from 'semantic-ui-react';
import { Entry, EntryType, HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry, Patient } from '../types';
import { Field, Form, Formik } from 'formik';
import { DiagnosisSelection, EntryTypeOption, NumberField, SelectFieldFlexible, TextField } from '../AddPatientModal/FormField';


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
      <EntryForm patient={patient}/>
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
    default: return assertNever(entry as never);
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

const entryOptions: EntryTypeOption[] = [
  {value: EntryType.HealthCheck, label: "Health Check"},
  { value: EntryType.Hospital, label: "Hospital Visit"},
  { value: EntryType.OccupationalHealthcare, label: "Occupational Healthcare"}
];
  


const isDate = (date: string):boolean => {
  return Boolean(Date.parse(date));
};

const EntryForm = ({ patient }: {patient: Patient}): JSX.Element => {
  const [{ diagnoses }] = useStateValue();
  const id = patient.id;
  const [ _, dispatch] = useStateValue();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (entry: any) => {
    const res = await axios.post(apiBaseUrl.concat(`/patients/${id}/entries`), entry);
    console.log(res);
    dispatch(updatePatient(res.data));
  };

  return (
    <Formik
    initialValues={{
      type: EntryType.HealthCheck,
      date: "",
      description: "",
      specialist: "",
      diagnoses: [],
      healthCheckRating: 0,
      discharge: {date:"", criteria: ""},
      employerName: "",
      sickLeave: {startDate: "", endDate: ""}
    }}
    onSubmit={onSubmit}
    validate={
      (values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.date) {
          errors.date = requiredError;
        } else if (!isDate(values.date)) {
          errors.date = "Should be a date";
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }

        if (values.type === EntryType.HealthCheck) {
          if (!(values.healthCheckRating in HealthCheckRating)){
            errors.healthCheckRating = "Value outside the acceptable range";
          }
        }

        //nested objects dont use error messages properly
        if (values.type === EntryType.Hospital) {
          console.log(values.discharge);
          if (!values.discharge.date) {
            errors["discharge.date"] = requiredError;
            console.log(errors);
          } else if (!isDate(values.discharge.date)){
            errors["discharge.date"] = "Should be a date";
          }

          if (!values.discharge.criteria) {
            errors["discharge.criteria"] = requiredError;
          }
          
        }

        if (values.type === EntryType.OccupationalHealthcare){
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
        }
        return errors;
      }
    }
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values}) => {
        return (
          <Form>
          <h3>Add new enrty</h3>
          <SelectFieldFlexible
          name="type"
          label="Entry Type"
          options={entryOptions}
          />
          <Field
            label="Entry Date"
            placeholder="YYYY-MM-DD"
            name="date"
            component={TextField}
          />
          <Field
            label="Description"
            placeholder="Description"
            name="description"
            component={TextField}
          />
          <Field
            label="Specialist"
            placeholder="Specialist"
            name="specialist"
            component={TextField}
          />
          <DiagnosisSelection
            diagnoses={diagnoses}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
          />
          
          {values.type === EntryType.HealthCheck && <>
          <Field
            label="Health Rating"
            name="healthCheckRating"
            min={0}
            max={3}
            component={NumberField}
          />
          </>}

          {values.type === EntryType.Hospital && <>
            <Field
            label="Discharge Date"
            placeholder="YYYY-MM-DD"
            name="discharge.date"
            component={TextField}
          />
          <Field
            label="Discharge Cireria"
            placeholder="Discharge Cireria"
            name="discharge.criteria"
            component={TextField}
          />
          </>}

          {values.type === EntryType.OccupationalHealthcare && <>
            <Field
            label="Employer name"
            placeholder="Employer name"
            name="employerName"
            component={TextField}
          />
           <Field
            label="Sick Leave Start Date"
            placeholder="YYYY-MM-DD"
            name="sickLeave.startDate"
            component={TextField}
          />
           <Field
            label="Sick Leave End Date"
            placeholder="YYYY-MM-DD"
            name="sickLeave.endDate"
            component={TextField}
          />
          </>}
          <Button 
          disabled={!dirty || !isValid}>
            add entry
          </Button>
        </Form>
        );
      }}
     
    </Formik>
  );
};