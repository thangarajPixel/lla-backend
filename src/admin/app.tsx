import type { StrapiApp } from '@strapi/strapi/admin';
import { useLocation } from 'react-router-dom';
import { Button } from '@strapi/design-system';
import { Modal } from '@strapi/design-system';
import { Eye, Download, Duplicate } from '@strapi/icons';
import React, { useState } from 'react';

export default {
  config: {
    auth: {
      logo: 'http://localhost:8000/uploads/logo.png',
    },
    menu: {
      logo: 'http://localhost:8000/uploads/logo.png',
    },
    tutorials: false,
    notifications: { release: false },
    locales: ['en', 'fr'],
  },

  bootstrap(app: StrapiApp) {
    console.log('Custom admin loaded', app);

    app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: 'CustomHeaderButtons',
      Component: () => {
        const location = useLocation();
        const [isOpen, setIsOpen] = useState(false);

        if (!location.pathname.includes('api::admission.admission')) {
          return null;
        }

        const handleView = () => {
          window.open('https://dev.lightandlifeacademy.in/', '_blank');
        };

        const handleDownload = () => {
          window.open('http://localhost:8000/sample.pdf', '_blank');
        };

        const handleOpenPopup = () => {
          setIsOpen(true);
        };

        const handleSubmitPopup = () => {
          alert('Form Submitted Successfully!');
          setIsOpen(false);
        };

        return (
          <>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                startIcon={<Eye />}
                variant="secondary"
                onClick={handleView}
              >
                View
              </Button>

              <Button
                startIcon={<Duplicate />}
                variant="secondary"
                onClick={handleOpenPopup}
              >
                Popup
              </Button>

              <Button
                startIcon={<Download />}
                variant="secondary"
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>

            {/* Modal Popup */}
            {isOpen && (
              <Modal.Root defaultOpen onOpenChange={() => setIsOpen(false)}>
                <Modal.Content>
                  <Modal.Header>
                    <Modal.Title>Custom Popup</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <p>Enter your custom content here.</p>
                  </Modal.Body>

                  <Modal.Footer>
                    <Button onClick={() => setIsOpen(false)} variant="tertiary">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitPopup} variant="success">
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal.Content>
              </Modal.Root>
            )}
          </>
        );
      },
    });
  },
};
