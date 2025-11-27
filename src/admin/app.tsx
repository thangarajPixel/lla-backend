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

    // ---------------------------------------------------------------
    // ✅ Selecting ID from Admission table
    // ---------------------------------------------------------------
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

    // ---------------------------------------------------------------
    // ✅ Header Buttons (View | Popup | Download) + 2 Dropdowns
    // ---------------------------------------------------------------
    app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: 'CustomHeaderButtons',
      Component: () => {
        const location = useLocation();
        const [isOpen, setIsOpen] = useState(false);

        // 🔽 Dropdown States
        const [selectedStep, setSelectedStep] = useState('');
        const [selectedYear, setSelectedYear] = useState('');

        if (!location.pathname.includes('api::admission.admission')) {
          return null;
        }

        // ACTIONS
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

        // 🔽 Generate Academic Year List: 2018-2019 → 2027-2028
        const years = [];
        for (let start = 2018; start <= 2027; start++) {
          years.push(`${start}-${start + 1}`);
        }

        return (
          <>
            {/* ---------------------------------------------------
               HEADER BUTTONS + DROPDOWNS
            --------------------------------------------------- */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

              {/* 🔽 Dropdown 1: Choose Option */}
              <select
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
                value={selectedStep}
                onChange={(e) => setSelectedStep(e.target.value)}
              >
                <option value="">Choose Option</option>
                <option value="step1">Step 1</option>
                <option value="step2">Step 2</option>
                <option value="step3">Step 3</option>
              </select>

              {/* 🔽 Dropdown 2: Year Selection */}
              <select
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Buttons */}
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

            {/* ---------------------------------------------------
               POPUP DIALOG
            --------------------------------------------------- */}
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
