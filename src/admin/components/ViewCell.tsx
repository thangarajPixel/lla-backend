import React from 'react';
import { Td } from '@strapi/design-system';
import ViewButton from './ViewButton';

interface ViewCellProps {
  id: number;
  documentId?: string;
}

const ViewCell: React.FC<ViewCellProps> = ({ id, documentId }) => {
  return (
    <Td>
      <ViewButton id={id} documentId={documentId} />
    </Td>
  );
};

export default ViewCell;
