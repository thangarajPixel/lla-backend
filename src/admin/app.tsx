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
                  onChange={(value: string | number) => {
                    const step = String(value);
                    setStepValue(step);

                    // Map dropdown values to actual database columns
                    const fieldMap: Record<string, string> = {
                      'Step1': 'step_1',
                      'Step2': 'step_2',
                      'Step3': 'step_3'
                    };

                    const field = fieldMap[step];
                    if (field) {
                      // Apply filter to admission table
                      const currentUrl = new URL(window.location.href);

                      // Remove all existing step filters first
                      const keysToDelete: string[] = [];
                      currentUrl.searchParams.forEach((value, key) => {
                        if (key.includes('step_1') || key.includes('step_2') || key.includes('step_3')) {
                          keysToDelete.push(key);
                        }
                      });
                      keysToDelete.forEach(key => currentUrl.searchParams.delete(key));

                      // Reset to page 1 and add the new filter
                      currentUrl.searchParams.set('page', '1');
                      currentUrl.searchParams.set('filters[' + field + '][$eq]', '1');
                      window.location.href = currentUrl.toString();
                    }
                  }}
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
                  onChange={(value: string | number) => {
                    const year = String(value);
                    setYearValue(year);

                    if (year) {
                      // Parse academic year (e.g., "2024-2025")
                      const [startYear, endYear] = year.split('-');

                      // Academic year: April 1st of start year to March 31st of end year
                      const startDate = `${startYear}-04-01`;
                      const endDate = `${endYear}-03-31`;

                      const currentUrl = new URL(window.location.href);

                      // Remove existing createdAt filters
                      const keysToDelete: string[] = [];
                      currentUrl.searchParams.forEach((value, key) => {
                        if (key.includes('createdAt')) {
                          keysToDelete.push(key);
                        }
                      });
                      keysToDelete.forEach(key => currentUrl.searchParams.delete(key));

                      // Add date range filter
                      currentUrl.searchParams.set('page', '1');
                      currentUrl.searchParams.set('filters[createdAt][$gte]', startDate);
                      currentUrl.searchParams.set('filters[createdAt][$lte]', endDate);
                      window.location.href = currentUrl.toString();
                    }
                  }}
                >
                  {years.map((year) => (
                    <SingleSelectOption key={year} value={year}>
                      {year}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </div>

              {/* Clear Filters Button */}
              <Button
                variant="tertiary"
                onClick={() => {
                  setStepValue('');
                  setYearValue('');
                  const currentUrl = new URL(window.location.href);
                  const keysToDelete: string[] = [];
                  currentUrl.searchParams.forEach((value, key) => {
                    if (key.includes('step_') || key.includes('createdAt')) {
                      keysToDelete.push(key);
                    }
                  });
                  keysToDelete.forEach(key => currentUrl.searchParams.delete(key));
                  currentUrl.searchParams.set('page', '1');
                  window.location.href = currentUrl.toString();
                }}
              >
                Clear
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