import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import AddEntryForm from './AddOccupationalHealthcareEntryForm';
import { NewOccupationalHealthcareEntry as OccupationalHealthcareEntryFormValues } from '../../types';


interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: OccupationalHealthcareEntryFormValues) => void;
  error?: string;
}

const AddHealthCheckEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export default AddHealthCheckEntryModal;
