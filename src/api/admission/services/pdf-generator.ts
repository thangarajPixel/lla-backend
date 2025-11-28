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
    <title>Review Application - {{fullName}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.5;
            color: #333;
            background: #fff;
        }
        
        .container {
            display: flex;
            min-height: 100vh;
        }
        
        .left-column {
            width: 280px;
            background: #fff;
            padding: 30px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 30px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: #000;
            border-radius: 4px;
        }
        
        .logo-text {
            font-size: 11px;
            font-weight: bold;
            line-height: 1.2;
        }
        
        .review-title {
            font-size: 18px;
            color: #ff6b6b;
            margin-bottom: 5px;
        }
        
        .review-subtitle {
            font-size: 11px;
            color: #666;
            margin-bottom: 30px;
        }
        
        .profile-photo {
            width: 200px;
            height: 250px;
            background: #f0f0f0;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
        }
        
        .profile-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn {
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 12px;
            border: none;
            cursor: pointer;
        }
        
        .btn-outline {
            background: #fff;
            border: 1px solid #ddd;
            color: #666;
        }
        
        .btn-primary {
            background: #ff6b6b;
            color: #fff;
        }
        
        .right-column {
            flex: 1;
            background: #fce4d8;
            padding: 30px 40px;
        }
        
        .section {
            background: #fce4d8;
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #ff6b6b;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #ff6b6b;
        }
        
        .field-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 13px;
        }
        
        .field-label {
            color: #666;
            font-weight: 500;
        }
        
        .field-value {
            color: #333;
            font-weight: 600;
            text-align: right;
            max-width: 60%;
        }
        
        .language-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 10px;
        }
        
        .language-item {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
        }
        
        .checkbox {
            width: 14px;
            height: 14px;
            border: 2px solid #ff6b6b;
            border-radius: 3px;
            display: inline-block;
            background: #fff;
        }
        
        .checkbox.checked {
            background: #ff6b6b;
        }
        
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 15px;
        }
        
        .portfolio-item {
            width: 100%;
            height: 180px;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .portfolio-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .document-link {
            color: #ff6b6b;
            text-decoration: underline;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="left-column">
            <div class="logo">
                <div class="logo-icon"></div>
                <div class="logo-text">Light & Life Academy<br>PHOTOGRAPHY</div>
            </div>
            
            <div class="review-title">Review Application</div>
            <div class="review-subtitle">Kindly verify the status before accepting it</div>
            
            <div class="profile-photo">
                {{#if passport_size_image}}
                <img src="{{passport_size_image}}" alt="Profile Photo" />
                {{/if}}
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-outline">Send to Edit</button>
                <button class="btn btn-primary">Proceed to Pay</button>
            </div>
        </div>
        
        <div class="right-column">
            <div class="section">
                <div class="section-title">Personal Details</div>
                <div class="field-row">
                    <div class="field-label">First Name</div>
                    <div class="field-value">{{first_name}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Last Name</div>
                    <div class="field-value">{{last_name}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Nationality</div>
                    <div class="field-value">{{nationality}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">E-mail</div>
                    <div class="field-value">{{email}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Mobile No</div>
                    <div class="field-value">{{mobileNumber}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Date of Birth</div>
                    <div class="field-value">{{formattedDate}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Blood Group</div>
                    <div class="field-value">{{bloodGroupInfo}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Address</div>
                    <div class="field-value">{{addressInfo}}</div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Language & Proficiency</div>
                <div class="language-grid">
                    {{#each languagesList}}
                    <div>
                        <div style="font-weight: bold; margin-bottom: 5px;">{{language}}</div>
                        <div class="language-item">
                            <span class="checkbox {{#if read}}checked{{/if}}"></span>
                            <span>Read</span>
                        </div>
                        <div class="language-item">
                            <span class="checkbox {{#if write}}checked{{/if}}"></span>
                            <span>Write</span>
                        </div>
                        <div class="language-item">
                            <span class="checkbox {{#if speak}}checked{{/if}}"></span>
                            <span>Speak</span>
                        </div>
                    </div>
                    {{/each}}
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Parental Details</div>
                <div class="field-row">
                    <div class="field-label">Name</div>
                    <div class="field-value">{{parentName}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Profession</div>
                    <div class="field-value">{{parentProfession}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">E-mail</div>
                    <div class="field-value">{{parentEmail}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Contact</div>
                    <div class="field-value">{{parentContact}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Address</div>
                    <div class="field-value">{{parentAddress}}</div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Education Details</div>
                <div class="field-row">
                    <div class="field-label">10th Std</div>
                    <div class="field-value">
                        {{#if Education_Details.Education_Details_10th_std}}
                        <span class="document-link">View Document</span>
                        {{else}}
                        Not Uploaded
                        {{/if}}
                    </div>
                </div>
                <div class="field-row">
                    <div class="field-label">Document</div>
                    <div class="field-value">
                        {{#if Education_Details.Education_Details_10th_std}}
                        <span class="document-link">10th Document</span>
                        {{/if}}
                    </div>
                </div>
                <div class="field-row">
                    <div class="field-label">12th Std</div>
                    <div class="field-value">
                        {{#if Education_Details.Education_Details_12th_std}}
                        <span class="document-link">View Document</span>
                        {{else}}
                        Not Uploaded
                        {{/if}}
                    </div>
                </div>
                <div class="field-row">
                    <div class="field-label">Under Graduate</div>
                    <div class="field-value"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">College Name</div>
                    <div class="field-value">{{ugDegree}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Status</div>
                    <div class="field-value">{{ugStatus}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Document</div>
                    <div class="field-value">
                        {{#if Under_Graduate.marksheet}}
                        <span class="document-link">View Document</span>
                        {{/if}}
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Work Experience</div>
                {{#each workExperienceList}}
                <div class="field-row">
                    <div class="field-label">Role/Designation</div>
                    <div class="field-value">{{designation}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Employer</div>
                    <div class="field-value">{{employer}}</div>
                </div>
                <div class="field-row">
                    <div class="field-label">Duration</div>
                    <div class="field-value">{{duration}}</div>
                </div>
                {{/each}}
            </div>
            
            <div class="section">
                <div class="section-title">Where did you first out about LLA?</div>
                <div class="field-value">{{photographyClub}}</div>
            </div>
            
            {{#if hasPortfolio}}
            <div class="section">
                <div class="section-title">Portfolio Images</div>
                <div class="portfolio-grid">
                    {{#each portfolioImages}}
                    <div class="portfolio-item">
                        <img src="{{this}}" alt="Portfolio Image" />
                    </div>
                    {{/each}}
                </div>
            </div>
            {{/if}}
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
    // Format language proficiency as array for template
    const languagesList = admission.Language_Proficiency?.map((lang: any) => ({
      language: lang.language || 'Unknown',
      read: lang.read || false,
      write: lang.write || false,
      speak: lang.speak || false,
    })) || [];

    // Format student address in single line: address, city, state, district, pincode
    const addressParts = [
      admission.address,
      admission.city,
      admission.state?.name || admission.state,
      admission.district,
      admission.pincode
    ].filter(Boolean);
    const addressInfo = addressParts.length > 0 ? addressParts.join(', ') : 'Not Provided';

    // Format parent/guardian details
    const parent = admission.Parent_Guardian_Spouse_Details;
    const parentName = parent ? `${parent.title || ''} ${parent.first_name || ''} ${parent.last_name || ''}`.trim() : 'Not Provided';
    const parentProfession = parent?.profession || 'Not Provided';
    const parentEmail = parent?.email || 'Not Provided';
    const parentContact = parent?.mobile_no || 'Not Provided';
    
    // Format parent address in single line: address, city, state, district, pincode
    const parentAddressParts = [
      parent?.address,
      parent?.city,
      parent?.state?.name || parent?.state,
      parent?.district,
      parent?.pincode
    ].filter(Boolean);
    const parentAddress = parentAddressParts.length > 0 ? parentAddressParts.join(', ') : 'Not Provided';

    // Format education details
    const ugDegree = admission.Under_Graduate?.degree || 'Not Provided';
    const ugStatus = admission.Under_Graduate?.ug_status || 'Not Provided';

    // Format work experience as array
    const workExperienceList = admission.Work_Experience?.map((work: any) => {
      const duration = work.duration_start && work.duration_end 
        ? `${new Date(work.duration_start).toLocaleDateString('en-IN')} to ${new Date(work.duration_end).toLocaleDateString('en-IN')}`
        : 'Duration not specified';
      return {
        designation: work.designation || 'Not Specified',
        employer: work.employer || 'Not Specified',
        duration: duration,
      };
    }) || [];

    // Get portfolio images URLs
    const portfolioImages = admission.Upload_Your_Portfolio?.images?.map((img: any) => {
      const baseUrl = process.env.ADMIN_BASE_URL || 'http://localhost:8000';
      return img.url ? (img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`) : null;
    }).filter(Boolean) || [];

    // Get profile photo URL
    let passport_size_image = '';
    if (admission.passport_size_image) {
      const baseUrl = process.env.ADMIN_BASE_URL || 'http://localhost:8000';
      const imgUrl = typeof admission.passport_size_image === 'string' 
        ? admission.passport_size_image 
        : admission.passport_size_image.url;
      passport_size_image = imgUrl ? (imgUrl.startsWith('http') ? imgUrl : `${baseUrl}${imgUrl}`) : '';
    }

    return {
      ...admission,
      passport_size_image,
      fullName: `${admission.name_title || ''} ${admission.first_name || ''} ${admission.last_name || ''}`.trim(),
      mobileNumber: admission.mobile_no || 'Not Provided',
      addressInfo, // Now formatted as: address, city, state, district, pincode
      hobbiesInfo: admission.hobbies || 'Not Provided',
      photographyClub: admission.photography_club || 'Instagram',
      bloodGroupInfo: admission.blood_group || 'Not Provided',
      languagesList,
      parentName,
      parentProfession,
      parentEmail,
      parentContact,
      parentAddress, // Now formatted as: address, city, state, district, pincode
      ugDegree,
      ugStatus,
      workExperienceList,
      portfolioImages,
      hasPortfolio: portfolioImages.length > 0,
      step1Status: admission.step_1 ? 'Completed' : 'Pending',
      step2Status: admission.step_2 ? 'Completed' : 'Pending',
      step3Status: admission.step_3 ? 'Completed' : 'Pending',
      paymentStatus: admission.Payment_Status || 'Pending',
      formattedDate: admission.date_of_birth ? new Date(admission.date_of_birth).toLocaleDateString('en-IN') : 'Not Provided'
    };
  }
}

export default PDFGenerator;