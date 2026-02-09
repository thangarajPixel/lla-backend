import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { pdf } from 'pdf-to-img';

async function getFileDataUri(fileUrl: string): Promise<{ dataUri: string | string[]; isPdf: boolean }> {
    try {
        if (!fileUrl) return { dataUri: '', isPdf: false };
        if (fileUrl.startsWith('data:')) {
            const isPdf = fileUrl.startsWith('data:application/pdf');
            return { dataUri: fileUrl, isPdf };
        }
        const res = await fetch(fileUrl);
        if (!res.ok) return { dataUri: '', isPdf: false };
        const buf = Buffer.from(await res.arrayBuffer());
        const ct = res.headers.get('content-type') || '';
        let mime = ct.split(';')[0].trim();
        if (!mime) {
            const ext = fileUrl.split('.').pop()?.toLowerCase();
            if (ext === 'pdf') mime = 'application/pdf';
            else if (ext === 'png') mime = 'image/png';
            else if (ext === 'gif') mime = 'image/gif';
            else if (ext === 'webp') mime = 'image/webp';
            else mime = 'image/jpeg';
        }
        
        // Convert PDF to PNG images for proper rendering in Puppeteer (all pages)
        if (mime === 'application/pdf') {
            try {
                const document = await pdf(buf, { scale: 2.0 });
                const images: Buffer[] = [];
                
                for await (const image of document) {
                    images.push(image);
                }
                
                // Return all pages of the PDF as an array of data URIs
                if (images.length > 0) {
                    const imageDataUris = images.map(img => `data:image/png;base64,${img.toString('base64')}`);
                    return { dataUri: imageDataUris, isPdf: true };
                }
            } catch (pdfError) {
                console.error('Error converting PDF to image:', pdfError);
                // Fallback to original PDF data URI
                const dataUri = `data:${mime};base64,${buf.toString('base64')}`;
                return { dataUri, isPdf: true };
            }
        }
        
        const dataUri = `data:${mime};base64,${buf.toString('base64')}`;
        const isPdf = mime === 'application/pdf';
        return { dataUri, isPdf };
    } catch {
        return { dataUri: '', isPdf: false };
    }
}
// Helper to convert logo to base64
function getLogoBase64(): string {
    try {
        const logoPath = path.join(process.cwd(), 'public', 'logo.png');
        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            return `data:image/png;base64,${logoBuffer.toString('base64')}`;
        }
    } catch (error) {
        console.error('Error loading logo:', error);
    }
    return '';
}

class PDFGenerator {
    private templatePath: string;

    constructor() {
        this.templatePath = path.join(__dirname, '../templates');
        console.log('Template path:', this.templatePath);
    }

    // Simple PDF generation using PDFKit (fallback)
    async generateSimplePDF(admissionData: any): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const chunks: Buffer[] = [];

                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Header
                doc.fontSize(20).fillColor('#4945ff').text('Light and Life Academy', { align: 'center' });
                doc.fontSize(16).text('Admission Form', { align: 'center' });
                doc.moveDown();

                // Application ID
                doc.fontSize(12).fillColor('#000').text(`Application ID: ${admissionData.id}`, { align: 'center' });
                doc.moveDown(2);

                // Personal Details
                doc.fontSize(14).fillColor('#ff6b6b').text('Personal Details');
                doc.moveDown(0.5);
                doc.fontSize(10).fillColor('#000');
                doc.text(`Name: ${admissionData.fullName}`);
                doc.text(`Email: ${admissionData.email}`);
                doc.text(`Mobile: ${admissionData.mobileNumber}`);
                doc.text(`Date of Birth: ${admissionData.formattedDate}`);
                doc.text(`Nationality: ${admissionData.nationality}`);
                doc.text(`Blood Group: ${admissionData.bloodGroupInfo}`);
                doc.text(`Address: ${admissionData.addressInfo}`);
                doc.moveDown();

                // Language & Proficiency
                if (admissionData.languagesList && admissionData.languagesList.length > 0) {
                    doc.fontSize(14).fillColor('#ff6b6b').text('Language & Proficiency');
                    doc.moveDown(0.5);
                    doc.fontSize(10).fillColor('#000');
                    admissionData.languagesList.forEach((lang: any) => {
                        const skills = [];
                        if (lang.read) skills.push('Read');
                        if (lang.write) skills.push('Write');
                        if (lang.speak) skills.push('Speak');
                        doc.text(`${lang.language}: ${skills.join(', ')}`);
                    });
                    doc.moveDown();
                }

                // Parental Details
                doc.fontSize(14).fillColor('#ff6b6b').text('Parental Details');
                doc.moveDown(0.5);
                doc.fontSize(10).fillColor('#000');
                doc.text(`Name: ${admissionData.parentName}`);
                doc.text(`Profession: ${admissionData.parentProfession}`);
                doc.text(`Email: ${admissionData.parentEmail}`);
                doc.text(`Contact: ${admissionData.parentContact}`);
                doc.text(`Address: ${admissionData.parentAddress}`);
                doc.moveDown();

                // Education Details
                doc.fontSize(14).fillColor('#ff6b6b').text('Education Details');
                doc.moveDown(0.5);
                doc.fontSize(10).fillColor('#000');
                doc.text(`Under Graduate: ${admissionData.ugDegree} - ${admissionData.ugStatus}`);
                doc.moveDown();

                // Work Experience
                if (admissionData.workExperienceList && admissionData.workExperienceList.length > 0) {
                    doc.fontSize(14).fillColor('#ff6b6b').text('Work Experience');
                    doc.moveDown(0.5);
                    doc.fontSize(10).fillColor('#000');
                    admissionData.workExperienceList.forEach((work: any) => {
                        doc.text(`${work.designation} at ${work.employer}`);
                        doc.text(`Duration: ${work.duration}`);
                        doc.moveDown(0.5);
                    });
                }

                // Application Status
                doc.fontSize(14).fillColor('#ff6b6b').text('Application Status');
                doc.moveDown(0.5);
                doc.fontSize(10).fillColor('#000');
                doc.text(`Step 1: ${admissionData.step1Status}`);
                doc.text(`Step 2: ${admissionData.step2Status}`);
                doc.text(`Step 3: ${admissionData.step3Status}`);
                doc.text(`Payment: ${admissionData.paymentStatus}`);
                doc.moveDown(2);

                // Footer
                doc.fontSize(8).fillColor('#666').text('Generated on ' + new Date().toLocaleString(), { align: 'center' });

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    async generateAdmissionPDF(admissionData: any): Promise<Buffer> {
        try {
            console.log('Starting PDF generation for:', admissionData);

            // Get logo as base64
            const logoBase64 = getLogoBase64();

            const templateHtml = `<!DOCTYPE html>
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
        @page {
            size: A4;
            margin: 30px;
        }
        .page-break {
            page-break-before: always;
            break-before: page;
        }

        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            background: #fff;
        }
        
        .container {
            display: flex;
            min-height: 100vh;
        }
        
        .left-column {
            width: 300px;
            background: #fff;
            padding: 30px 25px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
        }
        
        .logo-icon img {
            width: 100% !important;
        }
        
        .logo-text {
            font-size: 10px;
            font-weight: bold;
            line-height: 1.3;
            text-transform: uppercase;
        }
        
        .review-title {
            font-size: 16px;
            color: #ff6b6b;
            margin-bottom: 3px;
            font-weight: 600;
        }
        
        .review-subtitle {
            font-size: 10px;
            color: #666;
            margin-bottom: 25px;
        }
        
        .profile-photo {
            width: 220px;
            height: 280px;
            background: #f5f5f5;
            border-radius: 8px;
            margin-bottom: 15px;
            overflow: hidden;
        }
        
        .profile-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .action-buttons {
            display: flex;
            gap: 8px;
            margin-top: 15px;
        }
        
        .btn {
            padding: 6px 18px;
            border-radius: 20px;
            font-size: 11px;
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
            padding: 30px 35px;
        }
        
        .section {
            background: #fce4d8;
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #ff6b6b;
            margin-bottom: 12px;
        }
        
        .field-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 11px;
            align-items: flex-start;
        }
        
        .field-label {
            color: #888;
            font-weight: 400;
            flex-shrink: 0;
            width: 35%;
        }
        
        .field-value {
            color: #000;
            font-weight: 500;
            text-align: right;
            flex: 1;
            word-wrap: break-word;
        }
        
        .language-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 10px;
        }
        
        .language-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
        }
        
        .language-name {
            font-weight: bold;
            margin-bottom: 4px;
            font-size: 11px;
        }
        
        .checkbox {
            width: 12px;
            height: 12px;
            border: 2px solid #ff6b6b;
            border-radius: 2px;
            display: inline-block;
            background: #fff;
            position: relative;
        }
        
        .checkbox.checked::after {
            content: '✓';
            position: absolute;
            top: -3px;
            left: 1px;
            color: #ff6b6b;
            font-size: 10px;
            font-weight: bold;
        }
        
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-top: 12px;
        }
        
        .portfolio-item {
            width: 100%;
            height: 160px;
            border-radius: 8px;
            overflow: hidden;
            background: #f5f5f5;
        }
        
        .portfolio-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .document-link {
            color: #ff6b6b;
            font-size: 11px;
        }
        
        .subsection {
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px solid rgba(255, 107, 107, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="left-column">
            <div class="logo">
                ${logoBase64 ? `<div class="logo-icon"><img src="${logoBase64}" alt="LLA Logo" /></div>` : ''}
            </div>
            {{#if passport_size_image}}
            <div class="profile-photo">
                <img src="{{passport_size_image}}" alt="Profile Photo" />
            </div>
            {{else}}
            <div class="profile-photo"></div>
            {{/if}}
            

        </div>
        
        <div class="right-column">
            <div class="section">
                <div class="section-title">Personal Details</div>
                {{#if Course}}
                 {{#if Course.Name}}
                    <div class="field-row">
                        <div class="field-label">Course Name</div>
                        <div class="field-value">{{Course.Name}}</div>
                    </div>
                    {{/if}}
                {{/if}}
                <div class="field-row">
                    <div class="field-label">First Name</div>
                    <div class="field-value">{{name_title}} {{first_name}}</div>
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
                    <div class="field-label">Email</div>
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
                {{#if bloodGroupInfo}}
                <div class="field-row">
                    <div class="field-label">Blood Group</div>
                    <div class="field-value">{{bloodGroupInfo}}</div>
                </div>
                {{/if}}
                {{#if hobbies}}
                <div class="field-row">
                    <div class="field-label">Hobbie</div>
                    <div class="field-value">{{hobbies}}</div>
                </div>
                {{/if}}
                {{#if photography_club}}
                <div class="field-row">
                    <div class="field-label">Photography Club</div>
                    <div class="field-value">{{photography_club}}</div>
                </div>
                 {{/if}}
                <div class="field-row">
                    <div class="field-label">Address</div>
                    <div class="field-value">{{addressInfo}}</div>
                </div>
            </div>
            
            {{#if languagesList.length}}
            <div class="section">
                <div class="section-title">Language & Proficiency</div>
                <div class="language-grid">
                    {{#each languagesList}}
                    <div>
                        <div class="language-name">{{language}}</div>
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
            {{/if}}
            
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
                    <div class="field-label">Email</div>
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
                
                <div class="subsection">
                    <div class="field-row">
                        <div class="field-label">10th Std</div>
                        <div class="field-value"></div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Document</div>
                        <div class="field-value">
                            {{#if Education_Details.Education_Details_10th_std}}
                            <span class="document-link">✓ Submitted</span>
                            {{else}}
                            Not Uploaded
                            {{/if}}
                        </div>
                    </div>
                </div>
                
                <div class="subsection">
                    <div class="field-row">
                        <div class="field-label">12th Std</div>
                        <div class="field-value"></div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Document</div>
                        <div class="field-value">
                            {{#if Education_Details.Education_Details_12th_std}}
                            <span class="document-link">✓ Submitted</span>
                            {{else}}
                            Not Uploaded
                            {{/if}}
                        </div>
                    </div>
                </div>
                
                <div class="subsection">
                    <div class="field-row">
                        <div class="field-label">Under Graduate</div>
                        <div class="field-value"></div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Degree</div>
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
                            <span class="document-link">✓ Submitted</span>
                            {{else}}
                            Not Uploaded
                            {{/if}}
                        </div>
                    </div>
                </div>
                
                {{#if pgDegree.length}}
                <div class="subsection">
                    <div class="field-row">
                        <div class="field-label">Post  Graduate</div>
                        <div class="field-value"></div>
                    </div>
                     {{#each pgDegree}}
                    <div class="field-row">
                        <div class="field-label">Degree</div>
                        <div class="field-value">{{degree}}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Status</div>
                        <div class="field-value">{{pg_status}}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Document</div>
                        <div class="field-value">
                            {{#if marksheet}}
                            <span class="document-link">✓ Submitted</span>
                            {{else}}
                            Not Uploaded
                            {{/if}}
                        </div>
                    </div>
                     {{/each}}
                </div>
                {{/if}}
            </div>
            
            {{#if workExperienceList.length}}
            <div class="section">
                <div class="section-title">Work Experience</div>
                {{#each workExperienceList}}
                <div class="subsection">
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
                    <div class="field-row">
                        <div class="field-label">Document</div>
                        <div class="field-value">
                            {{#if reference_letter}}
                            <span class="document-link">✓ Submitted</span>
                            {{else}}
                            Not Uploaded
                            {{/if}}
                        </div>
                    </div>

                </div>
                {{/each}}
            </div>
            {{/if}}
            {{#if Message}}
            <div class="section">
                <div class="section-title">Where did you first out about LLA?</div>
                <div class="field-value" style="text-align: left;">{{Message}}</div>
            </div>
            {{/if}}
            <div class="page-break"></div>
            <br>     
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
    
         {{#if Education_Details_10th_std_url.src}}
            {{#if Education_Details_10th_std_url.isArray}}
                {{#each Education_Details_10th_std_url.src}}
                <div class="page-break"></div>
                <div style="background: #fff; min-height: 100vh;  display: flex; flex-direction: column; align-items: center;">
                    <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 30px; text-align: center;">10th Standard Marksheet (Page {{add @index 1}} of {{../Education_Details_10th_std_url.src.length}}):</h2>
                    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                        <img src="{{this}}" alt="10th Standard Certificate" style="max-width: 90%; max-height: 90%; object-fit: contain; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
                    </div>
                </div>
                {{/each}}
            {{else}}
                <div class="page-break"></div>
                <div style="background: #fff; min-height: 100vh;  display: flex; flex-direction: column; align-items: center;">
                    <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 30px; text-align: center;">10th Standard Marksheet:</h2>
                    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                        <img src="{{Education_Details_10th_std_url.src}}" alt="10th Standard Certificate" style="max-width: 90%; max-height: 90%; object-fit: contain; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
                    </div>
                </div>
            {{/if}}
            {{/if}}
            
            {{#if Education_Details_12th_std_url.src}}
            {{#if Education_Details_12th_std_url.isArray}}
                {{#each Education_Details_12th_std_url.src}}
                <div class="page-break"></div>
                <div style="background: #fff; min-height: 100vh;  display: flex; flex-direction: column; align-items: center;">
                    <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 30px; text-align: center;">12th Standard Marksheet (Page {{add @index 1}} of {{../Education_Details_12th_std_url.src.length}}):</h2>
                    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                        <img src="{{this}}" alt="12th Standard Certificate" style="max-width: 90%; max-height: 90%; object-fit: contain; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
                    </div>
                </div>
                {{/each}}
            {{else}}
                <div class="page-break"></div>
                <div style="background: #fff; min-height: 100vh;  display: flex; flex-direction: column; align-items: center;">
                    <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 30px; text-align: center;">12th Standard Marksheet:</h2>
                    <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                        <img src="{{Education_Details_12th_std_url.src}}" alt="12th Standard Certificate" style="max-width: 90%; max-height: 90%; object-fit: contain; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
                    </div>
                </div>
            {{/if}}
            {{/if}}
     {{#if ugMarksheet.src}}
     {{#if ugMarksheet.isArray}}
         {{#each ugMarksheet.src}}
         <div class="page-break"></div>
         <div style="background: #fff; min-height: 100vh;  display: flex; flex-direction: column; align-items: center;">
             <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 30px; text-align: center;">Under Graduate Marksheet (Page {{add @index 1}} of {{../ugMarksheet.src.length}}):</h2>
             <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                 <img src="{{this}}" alt="Under Graduate Marksheet" style="max-width: 90%; max-height: 90%; object-fit: contain; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
             </div>
         </div>
         {{/each}}
     {{else}}
         <div class="page-break"></div>
         <div style="background: #fff; min-height: 100vh;  display: flex; flex-direction: column; align-items: center;">
             <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 30px; text-align: center;">Under Graduate Marksheet:</h2>
             <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                 <img src="{{ugMarksheet.src}}" alt="Under Graduate Marksheet" style="max-width: 90%; max-height: 90%; object-fit: contain; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
             </div>
         </div>
     {{/if}}
     {{/if}}
     
     {{#if pgMarksheetList.length}}
     {{#each pgMarksheetList}}
         {{#if isArray}}
             {{#each src}}
             <div class="page-break"></div>
             <div style="background: #fff; min-height: 100vh;  display: flex; flex-direction: column; align-items: center;">
                 <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 30px; text-align: center;">Post Graduate Marksheet (Page {{add @index 1}} of {{../src.length}})</h2>
                 <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                     <img src="{{this}}" alt="Post Graduate Marksheet" style="max-width: 90%; max-height: 90%; object-fit: contain; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
                 </div>
             </div>
             {{/each}}
         {{else}}
             <div class="page-break"></div>
             <div style="background: #fff; min-height: 100vh;  display: flex; flex-direction: column; align-items: center;">
                 <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 30px; text-align: center;">Post Graduate Marksheet</h2>
                 <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                     <img src="{{src}}" alt="Post Graduate Marksheet" style="max-width: 90%; max-height: 90%; object-fit: contain; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
                 </div>
             </div>
         {{/if}}
     {{/each}}
     {{/if}}
     
     {{#if workReferenceList.length}}
     {{#each workReferenceList}}
         {{#if isArray}}
             {{#each src}}
             <div class="page-break"></div>
             <div style="background: #fff; min-height: 100vh;  display: flex; flex-direction: column; align-items: center;">
                 <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 30px; text-align: center;">Work Experience Reference Letter (Page {{add @index 1}} of {{../src.length}})</h2>
                 <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                     <img src="{{this}}" alt="Reference Letter" style="max-width: 90%; max-height: 90%; object-fit: contain; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
                 </div>
             </div>
             {{/each}}
         {{else}}
             <div class="page-break"></div>
             <div style="background: #fff; min-height: 100vh;  display: flex; flex-direction: column; align-items: center;">
                 <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 30px; text-align: center;">Work Experience Reference Letter</h2>
                 <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                     <img src="{{src}}" alt="Reference Letter" style="max-width: 90%; max-height: 90%; object-fit: contain; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
                 </div>
             </div>
         {{/if}}
     {{/each}}
     {{/if}}
</body>
</html>
`;

            console.log('Template loaded from embedded code');

            // Register helper to add 1 to index for page numbers
            handlebars.registerHelper('add', function(a, b) {
                return a + b;
            });

            // Compile template
            const template = handlebars.compile(templateHtml);

            // Generate HTML with data
            const html = template({
                ...admissionData,
                generatedDate: new Date().toLocaleDateString('en-IN'),
                generatedTime: new Date().toLocaleTimeString('en-IN')
            });

            console.log('HTML generated, launching Puppeteer...');

            // Launch puppeteer with additional error handling
            let browser;
            try {
                browser = await puppeteer.launch({
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--disable-gpu',
                        '--disable-web-security',
                        '--disable-features=IsolateOrigins,site-per-process'
                    ],
                    // Let Puppeteer find Chrome automatically, or use env variable if set
                    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
                });
                console.log('Puppeteer launched successfully');
            } catch (launchError) {
                console.error('Failed to launch Puppeteer:', launchError);
                throw new Error(`Puppeteer launch failed: ${launchError.message}`);
            }

            const page = await browser.newPage();

            // Set longer timeout and handle image loading errors
            await page.setDefaultNavigationTimeout(60000);

            // Set content with timeout handling
            await page.setContent(html, {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });

            // Wait a bit for any images to load (but don't fail if they don't)
            await new Promise(resolve => setTimeout(resolve, 2000));

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
                },
                preferCSSPageSize: false,
            });

            await browser.close();
            console.log('PDF generated successfully');

            // Convert Uint8Array to Buffer
            const pdfBuffer = Buffer.from(pdfUint8Array);
            return pdfBuffer;

        } catch (error) {
            console.error('Puppeteer PDF generation failed, using simple PDF fallback:', error);
            // Use simple PDF generation as fallback
            return await this.generateSimplePDF(admissionData);
        }
    }

    // Helper method to extract text from rich text blocks
    extractTextFromBlocks(blocks: any): string {
        if (!blocks) return '';

        // If it's already a string, return it
        if (typeof blocks === 'string') return blocks;

        // If it's an array of blocks (rich text format)
        if (Array.isArray(blocks)) {
            return blocks.map(block => {
                if (block.children && Array.isArray(block.children)) {
                    return block.children.map((child: any) => child.text || '').join('');
                }
                return '';
            }).join(' ').trim();
        }

        return '';
    }

    // Helper method to format data
    async formatAdmissionData(admission: any) {
        // Format language proficiency as array for template
        const languagesList = admission.Language_Proficiency?.map((lang: any) => ({
            language: lang.language || 'Unknown',
            read: lang.read || false,
            write: lang.write || false,
            speak: lang.speak || false,
        })) || [];

        // Extract text from address blocks (rich text format)
        const studentAddress = this.extractTextFromBlocks(admission.address);

        // Format student address in single line: address, city, state, district, pincode
        const addressParts = [
            studentAddress,
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

        // Extract text from parent address blocks (rich text format)
        const parentAddressText = this.extractTextFromBlocks(parent?.address);

        // Format parent address in single line: address, city, state, district, pincode
        const parentAddressParts = [
            parentAddressText,
            parent?.city,
            parent?.state?.name || parent?.state,
            parent?.district,
            parent?.pincode
        ].filter(Boolean);
        const parentAddress = parentAddressParts.length > 0 ? parentAddressParts.join(', ') : 'Not Provided';

        // Format education details
        const ugDegree = admission.Under_Graduate?.degree || 'Not Provided';
        const ugStatus = admission.Under_Graduate?.ug_status || 'Not Provided';
        const pgDegree = admission.Post_Graduate;

        // Format work experience as array
        const workExperienceList = admission.Work_Experience?.map((work: any) => {
            const duration = work.duration_start && work.duration_end
                ? `${new Date(work.duration_start).toLocaleDateString('en-IN')} to ${new Date(work.duration_end).toLocaleDateString('en-IN')}`
                : 'Duration not specified';
            return {
                designation: work.designation || 'Not Specified',
                employer: work.employer || 'Not Specified',
                duration: duration,
                reference_letter: work.reference_letter || null
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

        // Get Education Details 10th std file URL and convert to data URI
        let Education_Details_10th_std_url: { src: string | string[]; isPdf: boolean; isArray: boolean } = { src: '', isPdf: false, isArray: false };
        if (admission.Education_Details?.Education_Details_10th_std) {
            const baseUrl = process.env.ADMIN_BASE_URL || 'http://localhost:8000';
            const imgUrl = typeof admission.Education_Details.Education_Details_10th_std === 'string'
                ? admission.Education_Details.Education_Details_10th_std
                : admission.Education_Details.Education_Details_10th_std.url;
            const fullUrl = imgUrl ? (imgUrl.startsWith('http') ? imgUrl : `${baseUrl}${imgUrl}`) : '';
            console.log('10th std URL:', fullUrl);
            const file = await getFileDataUri(fullUrl);
            console.log('10th std file result:', { hasDataUri: !!file.dataUri, isPdf: file.isPdf });
            Education_Details_10th_std_url = { 
                src: file.dataUri, 
                isPdf: file.isPdf,
                isArray: Array.isArray(file.dataUri)
            };
        }

        // Get Education Details 12th std file URL and convert to data URI
        let Education_Details_12th_std_url: { src: string | string[]; isPdf: boolean; isArray: boolean } = { src: '', isPdf: false, isArray: false };
        if (admission.Education_Details?.Education_Details_12th_std) {
            const baseUrl = process.env.ADMIN_BASE_URL || 'http://localhost:8000';
            const imgUrl = typeof admission.Education_Details.Education_Details_12th_std === 'string'
                ? admission.Education_Details.Education_Details_12th_std
                : admission.Education_Details.Education_Details_12th_std.url;
            const fullUrl = imgUrl ? (imgUrl.startsWith('http') ? imgUrl : `${baseUrl}${imgUrl}`) : '';
            console.log('12th std URL:', fullUrl);
            const file = await getFileDataUri(fullUrl);
            console.log('12th std file result:', { hasDataUri: !!file.dataUri, isPdf: file.isPdf });
            Education_Details_12th_std_url = { 
                src: file.dataUri, 
                isPdf: file.isPdf,
                isArray: Array.isArray(file.dataUri)
            };
        }

        let ugMarksheet: { src: string | string[]; isPdf: boolean; isArray: boolean } = { src: '', isPdf: false, isArray: false };
        if (admission.Under_Graduate?.marksheet) {
            const baseUrl = process.env.ADMIN_BASE_URL || 'http://localhost:8000';
            const m = Array.isArray(admission.Under_Graduate.marksheet)
                ? admission.Under_Graduate.marksheet[0]
                : admission.Under_Graduate.marksheet;
            const src = typeof m === 'string' ? m : m?.url;
            const fullUrl = src ? (src.startsWith('http') ? src : `${baseUrl}${src}`) : '';
            const file = await getFileDataUri(fullUrl);
            ugMarksheet = { 
                src: file.dataUri, 
                isPdf: file.isPdf,
                isArray: Array.isArray(file.dataUri)
            };
        }

        const pgMarksheetList: Array<{ src: string | string[]; isPdf: boolean; isArray: boolean }> = [];
        if (Array.isArray(admission.Post_Graduate)) {
            for (const pg of admission.Post_Graduate) {
                if (pg?.marksheet) {
                    const baseUrl = process.env.ADMIN_BASE_URL || 'http://localhost:8000';
                    const m = Array.isArray(pg.marksheet) ? pg.marksheet[0] : pg.marksheet;
                    const src = typeof m === 'string' ? m : m?.url;
                    const fullUrl = src ? (src.startsWith('http') ? src : `${baseUrl}${src}`) : '';
                    const file = await getFileDataUri(fullUrl);
                    if (file.dataUri) pgMarksheetList.push({ 
                        src: file.dataUri, 
                        isPdf: file.isPdf,
                        isArray: Array.isArray(file.dataUri)
                    });
                }
            }
        } else if (admission.Post_Graduate?.marksheet) {
            const baseUrl = process.env.ADMIN_BASE_URL || 'http://localhost:8000';
            const m = Array.isArray(admission.Post_Graduate.marksheet)
                ? admission.Post_Graduate.marksheet[0]
                : admission.Post_Graduate.marksheet;
            const src = typeof m === 'string' ? m : m?.url;
            const fullUrl = src ? (src.startsWith('http') ? src : `${baseUrl}${src}`) : '';
            const file = await getFileDataUri(fullUrl);
            if (file.dataUri) pgMarksheetList.push({ 
                src: file.dataUri, 
                isPdf: file.isPdf,
                isArray: Array.isArray(file.dataUri)
            });
        }

        const workReferenceList: Array<{ src: string | string[]; isPdf: boolean; isArray: boolean }> = [];
        if (Array.isArray(admission.Work_Experience)) {
            const baseUrl = process.env.ADMIN_BASE_URL || 'http://localhost:8000';
            for (const w of admission.Work_Experience) {
                const ref = w?.reference_letter;
                if (ref) {
                    const refs = Array.isArray(ref) ? ref : [ref];
                    for (const r of refs) {
                        const src = typeof r === 'string' ? r : r?.url;
                        const fullUrl = src ? (src.startsWith('http') ? src : `${baseUrl}${src}`) : '';
                        const file = await getFileDataUri(fullUrl);
                        if (file.dataUri) workReferenceList.push({ 
                            src: file.dataUri, 
                            isPdf: file.isPdf,
                            isArray: Array.isArray(file.dataUri)
                        });
                    }
                }
            }
        }

        return {
            ...admission,
            passport_size_image,
            Education_Details_10th_std_url,
            Education_Details_12th_std_url,
            ugMarksheet,
            pgMarksheetList,
            workReferenceList,
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
            pgDegree,
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
