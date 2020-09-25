import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "semantic-ui-react";

import { apiBaseUrl } from "../constants";
import { useStateValue, setPatientList, addEntry } from "../state";
import { Patient, Entry } from "../types";

import { Card } from 'semantic-ui-react';
import EntryDetails from "./EntryDetails";

import AddHospitalEntryForm from "../EntryModals/AddHospitalEntryModal";
import AddOccupationalHealthcareEntryModal from "../EntryModals/AddOccupationalHealthcareEntryModal";
import AddHealthCheckEntryModal from "../EntryModals/AddHealthCheckEntryModal";


import { NewEntry as EntryFormValues } from "../types";




const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();

  const [hospitalEntryModalOpen, setHospitalEntryModal] = 
    React.useState<boolean>(false);

  const [occupationalHealthCareEntryModalOpen, setOccupationalHealhCareEntryModal] = 
    React.useState<boolean>(false);

  const [healthCheckEntryModalOpen, setHealthCheckEntryModal] = 
    React.useState<boolean>(false);

  const [error, setError] = React.useState<string | undefined>();

  const openHospitalEntryModal = 
    (): void => setHospitalEntryModal(true);

  const openOccupationalHealthCareModal = 
    (): void => setOccupationalHealhCareEntryModal(true);

  const openHealthCheckEntryModal = 
    (): void => setHealthCheckEntryModal(true);

  const closeHospitalEntryModal = (): void => {
    setHospitalEntryModal(false);
    setError(undefined);
  };

  const closeOccupationalHealthCareModal = (): void => {
    setOccupationalHealhCareEntryModal(false);
    setError(undefined);
  };

  const closeOpenHealthCheckEntryModal = (): void => {
    setHealthCheckEntryModal(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntry(newEntry, id));
      if(values.type === "Hospital"){
        closeHospitalEntryModal();
      }
      else if(values.type === "OccupationalHealthcare"){
        closeOccupationalHealthCareModal();
      }
      else{
        closeOpenHealthCheckEntryModal();
      }
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  const patient = patients[id];

  useEffect(() => {
    if(patients[id] && patients[id].ssn === undefined){
      const fetchPatient = async () => {
        try {
          const { data: fetchedPatient } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          const newPatientDict = {...patients};
          newPatientDict[id] = fetchedPatient;
          const newPatientList = Object.values(newPatientDict);
          
          dispatch(setPatientList(newPatientList));
        } catch (e) {
          console.error(e);
        }
      };
      fetchPatient();
    }
  }, [dispatch, patients, id]);

  const displayEntries = () => {
    return (
      <div>
        <h3>entries</h3>
        <Card.Group>
          {patient.entries && patient.entries.map((e) =>
            <EntryDetails key={e.id} entry={e} />
          )}
        </Card.Group>
      </div>
    );
  };


  const displayPatient = () => {
    return(
      <div>
        <div>
          <h2>{patient.name}</h2>
          <p>ssn: {patient.ssn}</p>
          <p>occupation: {patient.occupation}</p>
        </div>
        {patient.entries && patient.entries.length > 0 && displayEntries()}
        <AddHospitalEntryForm
          modalOpen={hospitalEntryModalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeHospitalEntryModal}
        />
        <AddOccupationalHealthcareEntryModal
          modalOpen={occupationalHealthCareEntryModalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeOccupationalHealthCareModal}
        />
        <AddHealthCheckEntryModal
          modalOpen={healthCheckEntryModalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeOpenHealthCheckEntryModal}
        />

        <Button onClick={() => openHospitalEntryModal()}>Add New Hospital Entry</Button>
        <Button onClick={() => openOccupationalHealthCareModal()}>Add New Occupational Healthcare Entry</Button>
        <Button onClick={() => openHealthCheckEntryModal()}>Add New Health Check Entry</Button>
      </div>
    );
  };

  return (
    <div>
      {patient && patient.ssn === undefined ? 
        <p>Loading...</p> 
        :
        displayPatient()
      }
    </div>
  );
};

export default PatientPage;
