import React from 'react';
import ViewButton from './ViewButton';
import ActionButton from './ActionButton';

interface AdmissionActionsProps {
  id: number;
  documentId?: string;
  [key: string]: any;
}

const AdmissionActions: React.FC<AdmissionActionsProps> = ({ id, documentId, ...rowData }) => {
  return (
    <>
      <ViewButton id={id} documentId={documentId} />
      <ActionButton id={id} documentId={documentId} rowData={rowData} />
    </>
  );
};

export default AdmissionActions;
