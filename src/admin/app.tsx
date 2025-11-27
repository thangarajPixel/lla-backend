import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Dialog } from '@strapi/design-system';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { Eye, Duplicate, Download } from '@strapi/icons';

export default {
  bootstrap(app: any) {
    app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: 'CustomHeaderButtons',
      Component: () => {
        const location = useLocation();
        const [isOpen, setIsOpen] = useState(false);
        const [stepValue, setStepValue] = useState('');
        const [yearValue, setYearValue] = useState('');

        if (!location.pathname.includes('api::admission.admission')) {
          return null;
        }

        const handleView = () => window.open('https://dev.lightandlifeacademy.in/', '_blank');
        const handleDownload = () => window.open('http://localhost:8000/uploads/sample.pdf', '_blank');
        const handleSubmit = () => {
          alert(`Form Submitted!\nStep: ${stepValue}\nYear: ${yearValue}`);
          setIsOpen(false);
        };

        // Generate Academic Years from 2017-2018 to 2027-2028
        const years = [];
        for (let start = 2017; start <= 2027; start++) {
          years.push(`${start}-${start + 1}`);
        }

        return (
          <>
            {/* Header Buttons + Dropdowns */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Button startIcon={<Eye />} variant="secondary" onClick={handleView}>
                View
              </Button>

              <Button startIcon={<Duplicate />} variant="secondary" onClick={() => setIsOpen(true)}>
                Popup
              </Button>

              <Button startIcon={<Download />} variant="secondary" onClick={handleDownload}>
                Download
              </Button>

              {/* Step Dropdown */}
              <div style={{ width: 150 }}>
                <SingleSelect
                  placeholder="Choose Option"
                  value={stepValue}
                  onChange={(value: string | number) => setStepValue(String(value))}
                >
                  <SingleSelectOption value="Step1">Step1(Basic)</SingleSelectOption>
                  <SingleSelectOption value="Step2">Step2(Portfolio)</SingleSelectOption>
                  <SingleSelectOption value="Step3">Step3(Paid)</SingleSelectOption>
                </SingleSelect>
              </div>

              {/* Academic Year Dropdown */}
              <div style={{ width: 150 }}>
                <SingleSelect
                  placeholder="Select Year"
                  value={yearValue}
                  onChange={(value: string | number) => setYearValue(String(value))}
                >
                  {years.map((year) => (
                    <SingleSelectOption key={year} value={year}>
                      {year}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </div>
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