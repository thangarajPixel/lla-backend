import React from 'react';
import { Td } from '@strapi/design-system';
import ActionButton from './ActionButton';

interface ActionCellProps {
  id: number;
  documentId?: string;
  rowData?: any;
}

const ActionCell: React.FC<ActionCellProps> = ({ id, documentId, rowData }) => {
  return (
    <Td>
      <ActionButton id={id} documentId={documentId} rowData={rowData} />
    </Td>
  );
};

export default ActionCell;
