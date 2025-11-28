import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Dialog } from '@strapi/design-system';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { Eye, Duplicate, Download } from '@strapi/icons';

export default {
  bootstrap(app: any) {
    // Make first_name clickable in the table
    app.getPlugin('content-manager').injectComponent('listView', 'tableHead', {
      name: 'CustomTableHead',
      Component: () => null, // We'll handle this via CSS and event delegation
    });

    // Add click handler for first_name cells
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

        // Add click handler and styling for first_name column
        React.useEffect(() => {
          const timer = setTimeout(() => {
            // Add CSS for clickable first_name
            const style = document.createElement('style');
            style.textContent = `
              table tbody tr td:nth-child(3) {
                cursor: pointer !important;
                color: #4945ff !important;
                text-decoration: underline !important;
              }
            `;
            document.head.appendChild(style);

            const handleTableClick = (event: MouseEvent) => {
              console.log('Click detected on:', event.target);

              const target = event.target as HTMLElement;
              const cell = target.closest('td');
              if (!cell) return;

              const row = cell.closest('tr');
              if (!row) return;

              // Get all cells in the row
              const cells = Array.from(row.querySelectorAll('td'));
              const cellIndex = cells.indexOf(cell);

              console.log('Cell clicked - Index:', cellIndex, 'Content:', cell.textContent?.trim());

              // Only handle first_name column (index 2)
              if (cellIndex === 2) {
                const cellText = cell.textContent?.trim();
                console.log('First name cell clicked:', cellText);

                // Prevent default ONLY for first_name column
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                // Try to find the checkbox button and documentId
                let checkboxButton = row.querySelector('button[role="checkbox"]') as HTMLButtonElement;

                console.log('Checkbox button found:', checkboxButton);

                // Try to get documentId from various attributes
                let documentId = checkboxButton?.getAttribute('aria-describedby') ||
                  checkboxButton?.getAttribute('data-document-id') ||
                  checkboxButton?.getAttribute('value') ||
                  row.getAttribute('data-document-id') ||
                  row.getAttribute('data-id');

                // If still not found, check all attributes on the checkbox button
                if (!documentId && checkboxButton) {
                  const attrs = checkboxButton.attributes;
                  console.log('All checkbox button attributes:');
                  for (let i = 0; i < attrs.length; i++) {
                    const attr = attrs[i];
                    console.log(`${attr.name}: ${attr.value}`);
                    // Look for any attribute that looks like a documentId
                    if (attr.value && attr.value.length > 20 && attr.value.match(/^[a-z0-9]+$/)) {
                      documentId = attr.value;
                      console.log('Found potential documentId in attribute:', attr.name, attr.value);
                    }
                  }
                }

                console.log('DocumentId found:', documentId);

                // Try to find numeric ID instead of documentId
                let recordId = null;

                // Method 1: Get ID from the ID column (2nd column, index 1)
                const allCells = Array.from(row.querySelectorAll('td'));
                if (allCells[1]) {
                  const idText = allCells[1].textContent?.trim();
                  if (idText && /^\d+$/.test(idText)) {
                    recordId = idText;
                    console.log('Found ID from ID column:', recordId);
                  }
                }

                // Method 2: Look for ID in checkbox button attributes (fallback)
                if (!recordId && checkboxButton) {
                  for (let i = 0; i < checkboxButton.attributes.length; i++) {
                    const attr = checkboxButton.attributes[i];
                    if (attr.value && /^\d+$/.test(attr.value)) { // numeric value
                      recordId = attr.value;
                      console.log('Found numeric ID in checkbox attribute:', attr.name, recordId);
                      break;
                    }
                  }
                }

                // Method 2: Look in row attributes
                if (!recordId) {
                  for (let i = 0; i < row.attributes.length; i++) {
                    const attr = row.attributes[i];
                    if (attr.value && /^\d+$/.test(attr.value)) { // numeric value
                      recordId = attr.value;
                      console.log('Found numeric ID in row attribute:', attr.name, recordId);
                      break;
                    }
                  }
                }

                // Check all columns for DocumentId or ID using existing allCells
                let finalId = null;

                // Check each cell for DocumentId (long alphanumeric) or ID (numeric)
                allCells.forEach((cell, index) => {
                  const cellText = cell.textContent?.trim();
                  if (cellText) {
                    // Check if it's a documentId (long alphanumeric string)
                    if (cellText.length > 20 && /^[a-z0-9]+$/.test(cellText)) {
                      finalId = cellText;
                      console.log(`Found DocumentId in column ${index}:`, cellText);
                    }
                    // Check if it's a numeric ID
                    else if (!finalId && /^\d+$/.test(cellText) && cellText !== '0' && cellText !== '1') {
                      finalId = cellText;
                      console.log(`Found numeric ID in column ${index}:`, cellText);
                    }
                  }
                });

                console.log('Final ID to use:', finalId);

                if (finalId) {
                  const baseUrl = process.env.ADMISSION_VIEW_URL || 'https://dev.lightandlifeacademy.in';
                  const url = `${baseUrl}/admission/${finalId}`;
                  console.log('Opening URL with ID:', url);

                  setTimeout(() => {
                    window.open(url, '_blank');
                  }, 0);
                } else {
                  console.log('No ID found - checking row HTML:', row.outerHTML.substring(0, 200));
                }

                return false;
              } else {
                // Allow normal Strapi behavior for other cells
                console.log('Other cell clicked, allowing normal behavior');
                // Don't prevent default - let Strapi handle it normally
              }
            };

            // Add event listener with higher priority
            document.addEventListener('click', handleTableClick, true);

            // Also add a more specific listener for the first_name column
            const addFirstNameClickHandler = () => {
              const firstNameCells = document.querySelectorAll('table tbody tr td:nth-child(3)');
              firstNameCells.forEach(cell => {
                cell.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();

                  const row = cell.closest('tr');
                  const checkbox = row?.querySelector('input[type="checkbox"]') as HTMLInputElement;

                  if (checkbox && checkbox.value) {
                    const documentId = checkbox.value;
                    const baseUrl = process.env.ADMISSION_VIEW_URL || 'https://dev.lightandlifeacademy.in';
                    const url = `${baseUrl}/${documentId}`;
                    console.log('Direct click handler - Opening URL:', url);
                    window.open(url, '_blank');
                  }
                }, true);
              });
            };

            // Run immediately and also after a delay
            addFirstNameClickHandler();
            setTimeout(addFirstNameClickHandler, 2000);

            return () => {
              document.removeEventListener('click', handleTableClick, true);
              if (document.head.contains(style)) {
                document.head.removeChild(style);
              }
            };
          }, 1000); // Wait 1 second for table to load

          return () => clearTimeout(timer);
        }, []);

        // Add PDF download buttons to status column
        React.useEffect(() => {
          const timer = setTimeout(() => {
            const addPdfButtons = () => {
              // Remove any existing PDF buttons first
              document.querySelectorAll('.pdf-download-btn').forEach(btn => btn.remove());
              
              // Target MOBILE_NO column (second to last column)
              const mobileCells = document.querySelectorAll('table tbody tr td:nth-last-child(2)');
              mobileCells.forEach(cell => {
                // Check if button already exists
                if (cell.querySelector('.pdf-download-btn')) return;

                const row = cell.closest('tr');
                const allCells = Array.from(row.querySelectorAll('td'));

                // Get ID from row
                let rowId = null;
                allCells.forEach((c, index) => {
                  const cellText = c.textContent?.trim();
                  if (cellText && /^\d+$/.test(cellText) && cellText !== '0' && cellText !== '1') {
                    rowId = cellText;
                  }
                });

                if (rowId) {
                  const pdfBtn = document.createElement('button');
                  pdfBtn.className = 'pdf-download-btn';
                  pdfBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    PDF
                  `; // SVG download icon with text
                  pdfBtn.style.cssText = `
                    margin-top:7px;
                    background: #4945ff !important;
                    color: white !important;
                    border: none !important;
                    padding: 6px 12px !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    font-size: 12px !important;
                    margin-left: 12px !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 4px !important;
                    font-weight: 500 !important;
                    transition: all 0.2s ease !important;
                  `;
                  
                  // Add hover effect
                  pdfBtn.onmouseenter = () => {
                    pdfBtn.style.background = '#3730a3 !important';
                    pdfBtn.style.transform = 'translateY(-1px) !important';
                    pdfBtn.style.boxShadow = '0 2px 8px rgba(73, 69, 255, 0.3) !important';
                  };
                  
                  pdfBtn.onmouseleave = () => {
                    pdfBtn.style.background = '#4945ff !important';
                    pdfBtn.style.transform = 'translateY(0) !important';
                    pdfBtn.style.boxShadow = 'none !important';
                  };

                  pdfBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log('Opening PDF in new tab for ID:', rowId);

                    // Open PDF in new tab
                    const adminBaseUrl = process.env.ADMIN_BASE_URL || 'https://dev-admin.lightandlifeacademy.in';
                    const pdfUrl = `${adminBaseUrl}/api/admissions/${rowId}/pdf`;
                    window.open(pdfUrl, '_blank');
                  };

                  cell.appendChild(pdfBtn);
                }
              });
            };

            addPdfButtons();
            // Re-run when table updates
            setTimeout(addPdfButtons, 2000);
          }, 1000);

          return () => clearTimeout(timer);
        }, []);

        const handleView = () => window.open(process.env.ADMISSION_VIEW_URL || 'https://dev.lightandlifeacademy.in/', '_blank');
        const handleDownload = () => window.open(`${process.env.ADMIN_BASE_URL || 'https://dev-admin.lightandlifeacademy.in'}/uploads/sample.pdf`, '_blank');
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