import React from 'react';
import { IconButton } from '@strapi/design-system';
import { Eye } from '@strapi/icons';

interface ViewFieldProps {
  value?: any;
  attribute?: any;
  name?: string;
  [key: string]: any;
}

const ViewField: React.FC<ViewFieldProps> = (props) => {
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = props.value || props.documentId || props.id;
    const baseUrl = process.env.ADMISSION_VIEW_URL || 'http://localhost:3000/admission-view';
    const externalUrl = `${baseUrl}?id=${id}`;
    window.open(externalUrl, '_blank');
  };

  return (
    <IconButton
      onClick={handleView}
      label="View"
      variant="ghost"
    >
      <Eye style={{ color: '#4945ff' }} />
    </IconButton>
  );
};

export default ViewField;
