import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Dialog } from '@strapi/design-system';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { Eye, Download } from '@strapi/icons';

// Simple encryption function for security
const encryptId = (id: string): string => {
  // Base64 encode with some obfuscation
  const encoded = btoa(id + '_lla_' + Date.now().toString().slice(-4));
  return encoded.replace(/[+/=]/g, (match) => {
    switch (match) {
      case '+': return '-';
      case '/': return '_';
      case '=': return '';
      default: return match;
    }
  });
};
const admissionViewUrl =
  process.env.STRAPI_ADMIN_ADMISSION_VIEW_URL;

export default {

  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
    info: {
      name: 'Light & Life Academy-admin',
      displayName: 'Light & Life Academy',
    },
    head: {
      title: 'Light & Life Academy Admin',
    },
    translations: {
      en: {
        "Auth.form.welcome.title": "Welcome to Light & Life Academy",
        "Auth.form.welcome.subtitle": "Log in to your Light & Life Academy account",
        "app.components.LeftMenu.navbrand.title": "Light & Life Academy Dashboard",
        "app.components.LeftMenu.navbrand.workplace": "Light & Life Academy",
        "app.page.title": "Light & Life Academy",
      },
    },
 
  },
  bootstrap(app: any) {
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
        const [paymentStatusValue, setPaymentStatusValue] = useState('');

        const isAdmissionPage = location.pathname.includes('api::admission.admission');
        const isContactPage = location.pathname.includes('api::contact.contact');

        // Format mobile_no as string in the table display
        React.useEffect(() => {
          if (!isAdmissionPage) return;
          
          const formatMobileNumbers = () => {
            // Target all mobile_no cells in the table
            const mobileCells = document.querySelectorAll('table tbody tr td');
            mobileCells.forEach(cell => {
               const el = cell as HTMLElement;
                 el.style.fontSize = "15px"; 
              const text = el.textContent?.trim();
              // Check if it looks like a mobile number (10 digits or more)
              if (text && /^\d{10,}$/.test(text.replace(/,/g, ''))) {
                // Remove any commas and display as plain string
                const cleanNumber = text.replace(/,/g, '');
                if (el.textContent !== cleanNumber) {
                  el.textContent = cleanNumber;
                }
              }
            });
          };

          const timer = setTimeout(formatMobileNumbers, 500);
          const interval = setInterval(formatMobileNumbers, 1000);

          return () => {
            clearTimeout(timer);
            clearInterval(interval);
          };
        }, [location.pathname, location.search, isAdmissionPage]);

        // Initialize dropdown values based on URL parameters
        React.useEffect(() => {
          if (!isAdmissionPage) return;
          
          const urlParams = new URLSearchParams(window.location.search);
          
          // Check for step filters in URL (handle URL encoding)
          if (urlParams.get('filters[step_1][$eq]') === '1' || urlParams.get('filters[step_1][%24eq]') === '1') {
            setStepValue('Step1');
          } else if (urlParams.get('filters[step_2][$eq]') === '1' || urlParams.get('filters[step_2][%24eq]') === '1') {
            setStepValue('Step2');
          } else if (urlParams.get('filters[step_3][$eq]') === '1' || urlParams.get('filters[step_3][%24eq]') === '1') {
            setStepValue('Step3');
          } else {
            setStepValue('');
          }

          // Check for AdmissionYear filter in URL (handle URL encoding)
          const admissionYear = urlParams.get('filters[AdmissionYear][$eq]') || urlParams.get('filters[AdmissionYear][%24eq]');
          
          if (admissionYear) {
            setYearValue(admissionYear);
          } else {
            setYearValue('');
          }

          // Check for payment status filter in URL (handle URL encoding)
          const paymentStatus = urlParams.get('filters[Payment_Status][$eq]') || urlParams.get('filters[Payment_Status][%24eq]');
          if (paymentStatus) {
            setPaymentStatusValue(paymentStatus);
          } else {
            setPaymentStatusValue('');
          }
        }, [location.search, isAdmissionPage]);

        // Add click handler and styling for first_name column
        React.useEffect(() => {
          if (!isAdmissionPage) return;
          const timer = setTimeout(() => {
            // Add CSS for clickable first_name and remove double scrollbar
            const style = document.createElement('style');
            style.id = 'admission-custom-styles';
            style.textContent = `
              /* Only apply to admission page - check if URL contains admission */
              body[data-admission-page="true"] table tbody tr td:nth-child(3) {
                cursor: pointer !important;
                color: #4945ff !important;
                text-decoration: underline !important;
              }
              
              /* Remove double scrollbar - target all possible containers */
              body {
                overflow: hidden !important;
              }
              
              #strapi {
                overflow: hidden !important;
              }
              
              main {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                height: 100vh !important;
              }
              
              /* Hide scrollbar on wrapper divs */
              main > div,
              main > div > div {
                overflow: visible !important;
              }
              
              /* Specific to content manager */
              [data-strapi-header] ~ div,
              [data-strapi-header] ~ div > div {
                overflow: visible !important;
              }
            `;
            
            // Mark body as admission page for CSS targeting
            document.body.setAttribute('data-admission-page', 'true');
            
            document.head.appendChild(style);

            const handleTableClick = (event: MouseEvent) => {
              // Double-check we're still on admission page
              if (!window.location.pathname.includes('api::admission.admission')) {
                return;
              }

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
                let recordId: string | null = null;

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
                   if (attr.value) {
                      const normalized = attr.value.replace(/,/g, '');
                      if (/^\d+$/.test(normalized)) {
                       recordId = String(Number(normalized));
                      console.log('Found numeric ID in row attribute:', attr.name, recordId);
                      break;
                    }
                   }
                  }
                }

                // Check all columns for DocumentId or ID using existing allCells

                // Check each cell for DocumentId (long alphanumeric) or ID (numeric)
                let finalId: string | null = null;
                allCells.forEach((cell, index) => {
                  const cellText = cell.textContent?.trim();
                  if (cellText) {
                    // Check if it's a documentId (long alphanumeric string)
                    if (cellText.length > 20 && /^[a-z0-9]+$/.test(cellText)) {
                      finalId = cellText;
                      console.log(`Found DocumentId in column ${index}:`, cellText);
                    }
                    // Check if it's a numeric ID
                   else if (!finalId) {
                        const normalized = cellText.replace(/,/g, '');
                        if (/^\d+$/.test(normalized) && normalized !== '0' && normalized !== '1') {
                          finalId = normalized;
                          console.log(`Found numeric ID in column ${index}:`, finalId);
                        }
                      }
                  }
                });

                console.log('Final ID to use:', finalId);

                if (finalId) {
                  const baseUrl = admissionViewUrl;
                  const encryptedId = encryptId(finalId);
                  const url = `${baseUrl}/admission/${encryptedId}/preview?type=admin`;
                  console.log('Opening URL with encrypted ID:', url);
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
                    const baseUrl = admissionViewUrl;
                    const encryptedId = encryptId(documentId);
                    const url = `${baseUrl}/admission/${encryptedId}`;
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

          return () => {
            clearTimeout(timer);
            // Clean up the data attribute when leaving admission page
            document.body.removeAttribute('data-admission-page');
            const style = document.getElementById('admission-custom-styles');
            if (style) {
              document.head.removeChild(style);
            }
          };
        }, [isAdmissionPage]);

        // Add  Admission Status name change in the table display
        React.useEffect(() => {
          if (!isAdmissionPage) return;
          const formatAdmissionStatus = () => {
            // First, find the header to determine which column is ADMISSION STATUS
            const headers = document.querySelectorAll('table thead tr th');
            let admissionStatusColumnIndex = -1;
            headers.forEach((header, index) => {
              const headerText = header.textContent?.trim().toUpperCase();
              if (headerText === 'ADMISSION STATUS' || headerText === 'PAYMENT_STATUS') {
                admissionStatusColumnIndex = index;
              }
            });
            if (admissionStatusColumnIndex >= 0) {
              const statusCells = document.querySelectorAll(`table tbody tr td:nth-child(${admissionStatusColumnIndex + 1})`);
              statusCells.forEach(cell => {
                 const el = cell as HTMLElement;
                 el.style.fontSize = "15px";   // change to 18px / 20px if needed
                const text = el.textContent?.trim();
                // Check for specific status values and rename
                if (text === 'Completed') {
                  el.textContent = 'Payment Initiated';
                } else if (text === 'UnPaid') {
                  el.textContent = 'UnPaid';
                } else if (text === 'Paid') {
                  el.textContent = 'Paid';
                } else if (text && text !== 'Payment Initiated' && text !== 'UnPaid' && text !== 'Paid') {
                  // Only change if it's not already one of our target values
                  el.textContent = 'Pending';
                }
              });
            }
          };

          const timer = setTimeout(formatAdmissionStatus, 500);
          const interval = setInterval(formatAdmissionStatus, 1000);
          return () => {
            clearTimeout(timer);
            clearInterval(interval);
          }
        }, [location.pathname, location.search, isAdmissionPage]);

        // Add PDF download buttons to status column
        React.useEffect(() => {
          if (!isAdmissionPage) return;
          
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
                if (!row) return;
                const allCells = Array.from(row.querySelectorAll('td'));

                // Get ID from row
                let rowId: string | null = null;
                if (allCells[1]) {
                  const idText = allCells[1].textContent?.trim();
                  console.log('ID from column 1 (raw):', idText);
                  if (idText) {
                    const cleanId = idText.replace(/,/g, '');
                    if (/^\d+$/.test(cleanId)) {
                      rowId = cleanId;
                      console.log('Cleaned ID:', rowId);
                    }
                  }
                }

                // Check Step4 status by looking for step_4 column or checking step status
                let isStep4Completed = false;
                
                // Method 1: Look for step_4 column (boolean true/false)
                allCells.forEach((cell, index) => {
                  const cellText = cell.textContent?.trim().toLowerCase();
                  // Check if this cell contains step_4 status (true/false)
                  if (cellText === 'true' || cellText === '1') {
                    // Check if this might be the step_4 column by looking at header
                    const headers = document.querySelectorAll('table thead tr th');
                    if (headers[index]) {
                      const headerText = headers[index].textContent?.trim().toLowerCase();
                      if (headerText?.includes('step_4') || headerText?.includes('step 4')) {
                        isStep4Completed = true;
                      }
                    }
                  }
                });

                // Method 2: If no step_4 column found, check for general step completion indicators
                if (!isStep4Completed) {
                  allCells.forEach((cell) => {
                    const cellText = cell.textContent?.trim().toLowerCase();
                    // Look for indicators that step 4 is completed
                    if (cellText === 'step4' || cellText === 'step 4' || cellText === 'completed' || cellText === 'paid') {
                      isStep4Completed = true;
                    }
                  });
                }

                if (rowId) {
                  const pdfBtn = document.createElement('button');
                  pdfBtn.className = 'pdf-download-btn';
                  pdfBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    
                  `; // SVG download icon with text
                  
                  // Set button style based on Step4 status
                  const baseStyle = `
                    margin-top:7px;
                    border: none !important;
                    padding: 6px 12px !important;
                    border-radius: 6px !important;
                    font-size: 12px !important;
                    margin-left: 12px !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 4px !important;
                    font-weight: 500 !important;
                    transition: all 0.2s ease !important;
                  `;
                  
                  if (isStep4Completed) {
                    // Enabled state
                    pdfBtn.style.cssText = baseStyle + `
                      background: #4945ff !important;
                      color: white !important;
                      cursor: pointer !important;
                    `;
                    
                    // Add hover effect for enabled button
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

                      console.log('Downloading PDF for ID:', rowId);

                      // Download PDF using anchor element
                      const adminBaseUrl = process.env.ADMIN_BASE_URL || '';
                      const pdfUrl = `${adminBaseUrl}/api/admissions/${rowId}/pdf?type=admin`;
                      
                      console.log('PDF URL:', pdfUrl);
                      
                      // Create temporary anchor element for download
                      const link = document.createElement('a');
                      link.href = pdfUrl;
                      link.download = `admission-${rowId}.zip`;
                      link.target = '_blank';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    };
                  } else {
                    // Disabled state
                    pdfBtn.style.cssText = baseStyle + `
                      background: #ddd !important;
                      color: #999 !important;
                      cursor: not-allowed !important;
                      opacity: 0.6 !important;
                    `;
                    
                    pdfBtn.title = 'Download available only after Step 4 completion';
                    
                    pdfBtn.onclick = (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      alert('Download is only available after Step 4 completion');
                    };
                  }

                  cell.appendChild(pdfBtn);
                }
              });
            };

            addPdfButtons();
            // Re-run when table updates
            setTimeout(addPdfButtons, 2000);
          }, 1000);

          return () => clearTimeout(timer);
        }, [isAdmissionPage]);

        const handleView = () => window.open(admissionViewUrl, '_blank');
        const handleDownload = () => window.open(`${process.env.ADMIN_BASE_URL || ''}/uploads/sample.pdf`, '_blank');
        const handleExportAll = () => {
          const adminBaseUrl = process.env.ADMIN_BASE_URL || '';
          const params = new URLSearchParams();

          // Add step filter if selected
          if (stepValue) {
            const fieldMap: Record<string, string> = {
              'Step1': 'step_1',
              'Step2': 'step_2',
              'Step3': 'step_3'
            };
            const field = fieldMap[stepValue];
            if (field) {
              params.append(field, '1');
            }
          }

          // Add AdmissionYear filter if selected
          if (yearValue) {
            params.append('admissionYear', yearValue);
          }

          // Add payment status filter if selected
          if (paymentStatusValue) {
            params.append('paymentStatus', paymentStatusValue);
          }

          // Capture search value from multiple sources
          const currentUrl = new URL(window.location.href);
          let searchValue = null;

          // Method 1: Check URL parameters (various Strapi filter formats)
          currentUrl.searchParams.forEach((value, key) => {
            if (key.includes('containsi') || key.includes('search')) {
              searchValue = value;
            }
          });

          // Method 2: Try to get value from search input field
          if (!searchValue) {
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement ||
                               document.querySelector('input[type="search"]') as HTMLInputElement ||
                               document.querySelector('input[name="search"]') as HTMLInputElement;
            if (searchInput && searchInput.value) {
              searchValue = searchInput.value;
            }
          }

          // Method 3: Check for _q parameter (Strapi's default search param)
          if (!searchValue) {
            searchValue = currentUrl.searchParams.get('_q') || 
                         currentUrl.searchParams.get('filters[_q]') ||
                         currentUrl.searchParams.get('search');
          }

          if (searchValue) {
            params.append('search', searchValue);
            console.log('Search value captured:', searchValue);
          }

          const exportUrl = `${adminBaseUrl}/api/admissions/export${params.toString() ? '?' + params.toString() : ''}`;
          console.log('Export URL with filters:', exportUrl);
          console.log('Applied filters:', {
            step: stepValue,
            year: yearValue,
            paymentStatus: paymentStatusValue,
            search: searchValue
          });
          window.open(exportUrl, '_blank');
        };
        const handleContactExportAll = () => {
          const adminBaseUrl = process.env.ADMIN_BASE_URL || '';
          const exportUrl = `${adminBaseUrl}/api/contacts/export`;
          window.open(exportUrl, '_blank');
        };
        const handleSubmit = () => {
          alert(`Form Submitted!\nStep: ${stepValue}\nYear: ${yearValue}`);
          setIsOpen(false);
        };

        // Generate Academic Years from 2017-2018 to 2027-2028
        const years = [];
        for (let start = 2017; start <= 2027; start++) {
          years.push(`${start}-${start + 1}`);
        }

        // Render Contact page buttons
        if (isContactPage) {
          return (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Button startIcon={<Download />} variant="secondary" onClick={handleContactExportAll}>
                Export All
              </Button>
            </div>
          );
        }

        // Early return if not admission page
        if (!isAdmissionPage) {
          return null;
        }

        return (
          <>
            {/* Header Buttons + Dropdowns */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Button startIcon={<Eye />} variant="secondary" onClick={handleView}>
                View
              </Button>
              <Button startIcon={<Download />} variant="secondary" onClick={handleExportAll}>
                Export All
              </Button>
              {/* <Button startIcon={<Duplicate />} variant="secondary" onClick={() => setIsOpen(true)}>
                Popup
              </Button>
              <Button startIcon={<Download />} variant="secondary" onClick={handleDownload}>
                Download
              </Button> */}

              {/* Step Dropdown */}
              {/* <div style={{ width: 150 }}>
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
              </div> */}

              {/* Academic Year Dropdown */}
              <div style={{ width: 150 }}>
                <SingleSelect
                  placeholder="Select Year"
                  value={yearValue}
                  onChange={(value: string | number) => {
                    const year = String(value);
                    setYearValue(year);

                    if (year) {
                      const currentUrl = new URL(window.location.href);

                      // Remove existing AdmissionYear filters
                      const keysToDelete: string[] = [];
                      currentUrl.searchParams.forEach((value, key) => {
                        if (key.includes('AdmissionYear')) {
                          keysToDelete.push(key);
                        }
                      });
                      keysToDelete.forEach(key => currentUrl.searchParams.delete(key));

                      // Add AdmissionYear filter
                      currentUrl.searchParams.set('page', '1');
                      currentUrl.searchParams.set('filters[AdmissionYear][$eq]', year);
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

              {/* Payment Status Dropdown */}
              <div style={{ width: 150 }}>
                <SingleSelect
                  placeholder="Addmission Status"
                  value={paymentStatusValue}
                  onChange={(value: string | number) => {
                    const status = String(value);
                    setPaymentStatusValue(status);

                    if (status) {
                      const currentUrl = new URL(window.location.href);

                      // Remove existing Payment_Status filters
                      const keysToDelete: string[] = [];
                      currentUrl.searchParams.forEach((value, key) => {
                        if (key.includes('Payment_Status')) {
                          keysToDelete.push(key);
                        }
                      });
                      keysToDelete.forEach(key => currentUrl.searchParams.delete(key));

                      // Add payment status filter
                      currentUrl.searchParams.set('page', '1');
                      currentUrl.searchParams.set('filters[Payment_Status][$eq]', status);
                      window.location.href = currentUrl.toString();
                    }
                  }}
                >
                  <SingleSelectOption value="Paid">Paid</SingleSelectOption>
                  <SingleSelectOption value="UnPaid">UnPaid</SingleSelectOption>
                  <SingleSelectOption value="Pending">Pending</SingleSelectOption>
                </SingleSelect>
              </div>

              {/* Clear Filters Button */}
              <Button
                variant="tertiary"
                onClick={() => {
                  setStepValue('');
                  setYearValue('');
                  setPaymentStatusValue('');
                  
                  // Clear search input field
                  const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement ||
                                     document.querySelector('input[type="search"]') as HTMLInputElement ||
                                     document.querySelector('input[name="search"]') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.value = '';
                    // Trigger input event to update Strapi's internal state
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    searchInput.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                  
                  const currentUrl = new URL(window.location.href);
                  const keysToDelete: string[] = [];
                  currentUrl.searchParams.forEach((value, key) => {
                    // Remove step, AdmissionYear, payment status, and search filters
                    if (key.includes('step_') || 
                        key.includes('AdmissionYear') || 
                        key.includes('Payment_Status') ||
                        key.includes('search') || 
                        key.includes('containsi') ||
                        key.includes('_q') ||
                        key.includes('filters')) {
                      keysToDelete.push(key);
                    }
                  });
                  keysToDelete.forEach(key => currentUrl.searchParams.delete(key));
                  currentUrl.searchParams.set('page', '1');
                  
                  console.log('Filters cleared, redirecting to:', currentUrl.toString());
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