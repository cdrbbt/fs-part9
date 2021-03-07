/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { useParams } from 'react-router';
import { updatePatient, useStateValue } from "../state";

import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Icon } from 'semantic-ui-react';


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

  return (
    <div>
      <h2>{patient.name} {patient.gender === 'male' ? <Icon name="mars"/> : <Icon name="venus"/>}</h2>
      <div>ssn: {patient.ssn}</div>
      <div>date of birth: {patient.dateOfBirth}</div>
      <div>occupation: {patient.occupation}</div>
    </div>
  );
};

export default PatientView;