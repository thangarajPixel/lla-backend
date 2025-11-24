import React from 'react';
import { Eye, Check } from '@strapi/icons';

export default {
  bootstrap(app) {
    console.log('Content Manager extension loaded');

    // Add View action to the three dots menu
    app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: 'view-action',
      Component: ({ id, documentId }) => {
        const handleView = () => {
          const baseUrl = process.env.ADMISSION_VIEW_URL || 'http://localhost:3000/admission-view';
          const externalUrl = `${baseUrl}?id=${documentId || id}`;
          window.open(externalUrl, '_blank');
        };

        return React.createElement(
          'button',
          {
            onClick: handleView,
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              width: '100%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
            },
          },
          React.createElement(Eye, { style: { width: '16px', height: '16px', color: '#4945ff' } }),
          React.createElement('span', null, 'View')
        );
      },
    });

    // Add Action button to the three dots menu
    app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: 'custom-action',
      Component: ({ id, documentId, first_name, last_name, email, mobile_no }) => {
        const [isOpen, setIsOpen] = React.useState(false);

        const handleAction = () => {
          setIsOpen(true);
        };

        const handleConfirm = () => {
          console.log('Action confirmed for ID:', documentId || id);
          setIsOpen(false);
        };

        return React.createElement(
          React.Fragment,
          null,
          React.createElement(
            'button',
            {
              onClick: handleAction,
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
              },
            },
            React.createElement(Check, { style: { width: '16px', height: '16px', color: '#5cb176' } }),
            React.createElement('span', null, 'Action')
          ),
          isOpen &&
            React.createElement(
              'div',
              {
                style: {
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
                },
                onClick: () => setIsOpen(false),
              },
              React.createElement(
                'div',
                {
                  style: {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    maxWidth: '500px',
                    width: '90%',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  onClick: (e) => e.stopPropagation(),
                },
                React.createElement('h2', { style: { marginBottom: '16px', fontWeight: 'bold' } }, 'Confirm Action'),
                React.createElement('p', { style: { marginBottom: '16px' } }, `Are you sure you want to perform this action for admission ID: ${documentId || id}?`),
                first_name &&
                  React.createElement(
                    'div',
                    { style: { marginTop: '16px', padding: '12px', backgroundColor: '#f6f6f9', borderRadius: '4px' } },
                    React.createElement('p', { style: { fontWeight: 'bold', marginBottom: '8px' } }, 'Applicant Details:'),
                    React.createElement('p', null, `Name: ${first_name} ${last_name}`),
                    React.createElement('p', null, `Email: ${email}`),
                    React.createElement('p', null, `Mobile: ${mobile_no}`)
                  ),
                React.createElement(
                  'div',
                  { style: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' } },
                  React.createElement(
                    'button',
                    {
                      onClick: () => setIsOpen(false),
                      style: {
                        padding: '8px 16px',
                        cursor: 'pointer',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                      },
                    },
                    'Cancel'
                  ),
                  React.createElement(
                    'button',
                    {
                      onClick: handleConfirm,
                      style: {
                        padding: '8px 16px',
                        backgroundColor: '#5cb176',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      },
                    },
                    'Confirm'
                  )
                )
              )
            )
        );
      },
    });

    console.log('View and Action added to three dots menu');
  },
};
