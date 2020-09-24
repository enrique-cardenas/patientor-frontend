import React from "react";
import { 
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry, 
  HealthCheckEntry, 
  HealthCheckRating,
  Diagnosis } from "../types";

import { Card, Header, Icon } from 'semantic-ui-react';
import { useStateValue } from "../state";


/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const renderDiagnosisCodes = (codes: Array<Diagnosis['code']>, diagnoses: { [id: string]: Diagnosis }) => (
  <ul>
    {codes.map(code => 
      <li key={code}>
        {code}: {diagnoses[code].name}
      </li>
    )}
  </ul>
);

const HospitalEntryView: React.FC<{ entry: HospitalEntry }> = ({entry}) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Card fluid>  
      <Card.Content>
      <div>
        <Header as="h3">
          {entry.date}
          <Icon name="hospital"/>
        </Header>
      </div>
      <Card.Description>{entry.description}</Card.Description>
      discharge date: {entry.discharge.date} <i>{entry.discharge.criteria}</i>
      {entry.diagnosisCodes && renderDiagnosisCodes(entry.diagnosisCodes, diagnoses)}
      </Card.Content>
    </Card>
  );
};


const OccupationalHealthcareEntryView: React.FC<{ entry: OccupationalHealthcareEntry }> = ({entry}) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Card fluid>  
      <Card.Content>
      <div>
        <Header as="h3">
          {entry.date}
          <Icon name="stethoscope"/>
          {entry.employerName}
        </Header>
      </div>
      <Card.Description>{entry.description}</Card.Description>
      {entry.diagnosisCodes && renderDiagnosisCodes(entry.diagnosisCodes, diagnoses)}
      </  Card.Content>
    </Card>
  );
};

const HealthCheckEntryView: React.FC<{ entry: HealthCheckEntry }> = ({entry}) => {
  const [{ diagnoses }] = useStateValue();

  const displayHealthCheckRating = (rating: HealthCheckRating) => {
    switch(rating){
      case HealthCheckRating.Healthy:
        return <Icon name="heart" color="green"/>;
      case HealthCheckRating.LowRisk:
        return <Icon name="heart" color="yellow"/>;
      case HealthCheckRating.HighRisk:
        return <Icon name="heart" color="red"/>;
      case HealthCheckRating.CriticalRisk:
        return <Icon name="heart" color="purple"/>;
      default:
        return null;
    }
  };

  return (
    <Card fluid>  
      <Card.Content>
      <div>
        <Header as="h3">{entry.date} <Icon name="user md"/> </Header>
      </div>
      <Card.Description>{entry.description}</Card.Description>
      <div>{displayHealthCheckRating(entry.healthCheckRating)}</div>
      {entry.diagnosisCodes && renderDiagnosisCodes(entry.diagnosisCodes, diagnoses)}
      </Card.Content>
    </Card>
  );
};


const EntryDetails: React.FC<{ entry: Entry }> = ({entry}) => {
  switch(entry.type) {
    case "Hospital":
      return <HospitalEntryView entry={entry}/>;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryView entry={entry}/>;
    case "HealthCheck":
      return <HealthCheckEntryView entry={entry} />;
    default: 
      return assertNever(entry);
  }
};

export default EntryDetails;