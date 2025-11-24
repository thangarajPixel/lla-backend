import React, { useState } from 'react';
import { IconButton, Button, Typography } from '@strapi/design-system';
import { Check } from '@strapi/icons';

interface ActionFieldProps {
  value?: any;
  attribute?: any;
  name?: string;
  [key: string]: any;
}

const ActionField: React.FC<ActionFieldProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleConfirm = () => {
    console.log('Action confirmed for:', props);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleAction}
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
          onClick={() => setIsOpen(false)}
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
            <Typography fontWeight="bold" variant="beta" style={{ marginBottom: '16px' }}>
              Confirm Action
            </Typography>
            <Typography style={{ marginBottom: '16px' }}>
              Are you sure you want to perform this action?
            </Typography>

            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f6f6f9', borderRadius: '4px' }}>
              <Typography fontWeight="bold" style={{ marginBottom: '8px' }}>
                Details:
              </Typography>
              <Typography>ID: {props.id || props.documentId}</Typography>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
              <Button onClick={() => setIsOpen(false)} variant="tertiary">
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

export default ActionField;
