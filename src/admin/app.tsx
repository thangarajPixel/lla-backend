import type { StrapiApp } from '@strapi/strapi/admin';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Button } from '@strapi/design-system';
import { Dialog } from '@strapi/design-system';

import { Eye, Download, Duplicate } from '@strapi/icons';

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
    console.log('Custom admin loaded ✔');

    // ---------------------------------------------------------------------
    // ✅ Watch selected row IDs in Admission table
    // ---------------------------------------------------------------------
    app.getPlugin('content-manager').injectComponent('listView', 'beforeBody', {
      name: 'SelectedIdWatcher',
      Component: () => {
        const location = useLocation();

        useEffect(() => {
          if (!location.pathname.includes('api::admission.admission')) return;

          const handleClick = (event: any) => {
            const target = event.target;

            if (target && target.type === 'checkbox') {
              setTimeout(() => {
                const row = target.closest('tr');
                if (row) {
                  const cells = row.querySelectorAll('td');
                  if (cells.length > 1) {
                    const idText = cells[1].textContent?.trim();
                    if (idText && idText !== 'ID' && !isNaN(Number(idText))) {
                      alert(`Selected ID: ${idText}`);
                    }
                  }
                }
              }, 100);
            }
          };

          document.addEventListener('click', handleClick, true);

          return () => {
            document.removeEventListener('click', handleClick, true);
          };
        }, [location.pathname]);

        return null;
      },
    });

    // ---------------------------------------------------------------------
    // ✅ Header Buttons (View | Popup | Download)
    // ---------------------------------------------------------------------
    app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: 'CustomHeaderButtons',
      Component: () => {
        const location = useLocation();
        const [isOpen, setIsOpen] = useState(false);

        if (!location.pathname.includes('api::admission.admission')) {
          return null;
        }

        // ACTION FUNCTIONS
        const handleView = () => {
          window.open('https://dev.lightandlifeacademy.in/', '_blank');
        };

        const handleDownload = () => {
          window.open('http://localhost:8000/uploads/sample.pdf', '_blank');
        };

        const handleSubmit = () => {
          alert('Form Submitted Successfully!');
          setIsOpen(false);
        };

        return (
          <>
            {/* Header Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button startIcon={<Eye />} variant="secondary" onClick={handleView}>
                View
              </Button>

              <Button startIcon={<Duplicate />} variant="secondary" onClick={() => setIsOpen(true)}>
                Popup
              </Button>

              <Button startIcon={<Download />} variant="secondary" onClick={handleDownload}>
                Download
              </Button>
            </div>

            {/* Popup Modal */}
            {isOpen && (
              <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Content>
                  <Dialog.Header>Custom Popup</Dialog.Header>
                  <Dialog.Body>
                    <p>Enter your custom content here.</p>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button variant="tertiary" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Root>
            )}
          </>
        );
      },
    });
  },
};
