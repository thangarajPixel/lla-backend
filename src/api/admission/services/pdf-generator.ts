import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

class PDFGenerator {
  private templatePath: string;

  constructor() {
    this.templatePath = path.join(__dirname, '../templates');
    console.log('Template path:', this.templatePath);
  }

  async generateAdmissionPDF(admissionData: any): Promise<Buffer> {
    try {
      console.log('Starting PDF generation for:', admissionData.id);
      
      // Embed template directly in code to avoid file path issues
      const templateHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admission Form - {{fullName}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #4945ff;
            padding-bottom: 20px;
        }
        
        .header h1 {
            color: #4945ff;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .header h2 {
            color: #666;
            font-size: 18px;
            font-weight: normal;
        }
        
        .section {
            margin-bottom: 25px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #4945ff;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #4945ff;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .field-row {
            display: flex;
            margin-bottom: 12px;
            align-items: center;
        }
        
        .field-label {
            font-weight: bold;
            color: #555;
            width: 150px;
            flex-shrink: 0;
        }
        
        .field-value {
            color: #333;
            flex: 1;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-completed {
            background: #d4edda;
            color: #155724;
        }
        
        .status-pending {
            background: #f8d7da;
            color: #721c24;
        }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        
        .id-info {
            background: #e3f2fd;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .id-info strong {
            color: #1976d2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Light and Life Academy</h1>
            <h2>Student Admission Form</h2>
        </div>
        
        <div class="id-info">
            <strong>Application ID: {{id}}</strong>
            {{#if documentId}}<br><strong>Document ID: {{documentId}}</strong>{{/if}}
        </div>
        
        <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="field-row">
                <div class="field-label">Full Name:</div>
                <div class="field-value">{{fullName}}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Email:</div>
                <div class="field-value">{{email}}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Date of Birth:</div>
                <div class="field-value">{{formattedDate}}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Nationality:</div>
                <div class="field-value">{{nationality}}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Mobile Number:</div>
                <div class="field-value">{{mobileNumber}}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Blood Group:</div>
                <div class="field-value">{{bloodGroupInfo}}</div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Address Information</div>
            <div class="field-row">
                <div class="field-label">City:</div>
                <div class="field-value">{{cityInfo}}</div>
            </div>
            <div class="field-row">
                <div class="field-label">District:</div>
                <div class="field-value">{{districtInfo}}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Pincode:</div>
                <div class="field-value">{{pincodeInfo}}</div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Additional Information</div>
            <div class="field-row">
                <div class="field-label">Hobbies:</div>
                <div class="field-value">{{hobbiesInfo}}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Photography Club:</div>
                <div class="field-value">{{photographyClub}}</div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Application Progress</div>
            <div class="field-row">
                <div class="field-label">Step 1 (Basic Info):</div>
                <div class="field-value">
                    <span class="status-badge {{#if step_1}}status-completed{{else}}status-pending{{/if}}">
                        {{step1Status}}
                    </span>
                </div>
            </div>
            <div class="field-row">
                <div class="field-label">Step 2 (Portfolio):</div>
                <div class="field-value">
                    <span class="status-badge {{#if step_2}}status-completed{{else}}status-pending{{/if}}">
                        {{step2Status}}
                    </span>
                </div>
            </div>
            <div class="field-row">
                <div class="field-label">Step 3 (Payment):</div>
                <div class="field-value">
                    <span class="status-badge {{#if step_3}}status-completed{{else}}status-pending{{/if}}">
                        {{step3Status}}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Light and Life Academy</strong></p>
            <p>Generated on {{generatedDate}} at {{generatedTime}}</p>
            <p>This is a computer-generated document and does not require a signature.</p>
        </div>
    </div>
</body>
</html>`;
      
      console.log('Template loaded from embedded code');

      // Compile template
      const template = handlebars.compile(templateHtml);
      
      // Generate HTML with data
      const html = template({
        ...admissionData,
        generatedDate: new Date().toLocaleDateString('en-IN'),
        generatedTime: new Date().toLocaleTimeString('en-IN')
      });

      console.log('HTML generated, launching Puppeteer...');

      // Launch puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      
      // Set content and wait for load
      await page.setContent(html, { 
        waitUntil: 'networkidle0' 
      });

      console.log('Generating PDF...');

      // Generate PDF
      const pdfUint8Array = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      await browser.close();
      console.log('PDF generated successfully');

      // Convert Uint8Array to Buffer
      const pdfBuffer = Buffer.from(pdfUint8Array);
      return pdfBuffer;

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  // Helper method to format data
  formatAdmissionData(admission: any) {
    return {
      ...admission,
      fullName: `${admission.name_title} ${admission.first_name} ${admission.last_name}`,
      mobileNumber: admission.mobile_no || 'Not Provided',
      cityInfo: admission.city || 'Not Provided',
      districtInfo: admission.district || 'Not Provided',
      pincodeInfo: admission.pincode || 'Not Provided',
      hobbiesInfo: admission.hobbies || 'Not Provided',
      photographyClub: admission.photography_club || 'Not Provided',
      bloodGroupInfo: admission.blood_group || 'Not Provided',
      step1Status: admission.step_1 ? 'Completed' : 'Pending',
      step2Status: admission.step_2 ? 'Completed' : 'Pending',
      step3Status: admission.step_3 ? 'Completed' : 'Pending',
      formattedDate: admission.date_of_birth ? new Date(admission.date_of_birth).toLocaleDateString('en-IN') : 'Not Provided'
    };
  }
}

export default PDFGenerator;