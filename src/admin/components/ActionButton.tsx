import React, { useState } from 'react';
import { IconButton, Typography, Button, Box } from '@strapi/design-system';
import { Check } from '@strapi/icons';

interface ActionButtonProps {
  id: number;
  documentId?: string;
  rowData?: any;
}

const ActionButton: React.FC<ActionButtonProps> = ({ id, documentId, rowData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    // Add your action logic here
    console.log('Action confirmed for ID:', documentId || id);
    console.log('Row data:', rowData);
    
    // You can make API calls here
    // Example: approve admission, send email, etc.
    
    setIsOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        label="Action"
        variant="ghost"
      >
        <Check style={{ color: '#5cb176' }} />
      </IconButton>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={handleClose}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography fontWeight="bold" as="h2" style={{ marginBottom: '16px' }}>
              Confirm Action
            </Typography>

            <Box style={{ marginBottom: '24px' }}>
              <Typography style={{ marginBottom: '16px' }}>
                Are you sure you want to perform this action for admission ID: {documentId || id}?
              </Typography>

              {/* Add your custom content here */}
              {rowData && (
                <Box style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f6f6f9', borderRadius: '4px' }}>
                  <Typography variant="omega" fontWeight="bold" style={{ marginBottom: '8px' }}>
                    Applicant Details:
                  </Typography>
                  <Typography style={{ marginBottom: '4px' }}>
                    Name: {rowData.first_name} {rowData.last_name}
                  </Typography>
                  <Typography style={{ marginBottom: '4px' }}>
                    Email: {rowData.email}
                  </Typography>
                  <Typography>
                    Mobile: {rowData.mobile_no}
                  </Typography>
                </Box>
              )}
            </Box>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={handleClose} variant="tertiary">
                Cancel
              </Button>
              <Button onClick={handleConfirm} variant="success">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButton;
