import { State } from "./state";
import { Diagnosis, Patient, Entry } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "SET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_ENTRY";
      payload: { entry: Entry; patientId: string };
    };


export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...state.patients,
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
        }
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: {
          ...state.diagnoses,
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
        }
      };      
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_ENTRY":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.patientId]: 
            { 
              ...state.patients[action.payload.patientId],
              entries: [...state.patients[action.payload.patientId].entries, action.payload.entry ]
            }
        }
      };
    default:
      return state;
  }
};

export const setPatientList = (list: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: list
  };
};

export const setDiagnosisList = (list: Diagnosis[]): Action => {
  return {
    type: "SET_DIAGNOSIS_LIST",
    payload: list
  };
};

export const addPatient = (patient: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: patient
  };
};

export const addEntry = (entry: Entry, patientId: string): Action => {
  return {
    type: "ADD_ENTRY",
    payload: { entry: entry, patientId: patientId}
  };
};