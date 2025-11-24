import React from 'react';
import { IconButton } from '@strapi/design-system';
import { Eye } from '@strapi/icons';

interface ViewButtonProps {
  id: number;
  documentId?: string;
}

const ViewButton: React.FC<ViewButtonProps> = ({ id, documentId }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Get the external URL from environment variable
    const baseUrl = process.env.ADMISSION_VIEW_URL || 'http://localhost:3000/admission-view';
    const externalUrl = `${baseUrl}?id=${documentId || id}`;

    window.open(externalUrl, '_blank');
  };

  return (
    <IconButton
      onClick={handleClick}
      label="View"
      variant="ghost"
    >
      <Eye style={{ color: '#4945ff' }} />
    </IconButton>
  );
};

export default ViewButton;
