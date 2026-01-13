import mysql from 'mysql2/promise';
import { encryptAdmissionId } from './api/admission/services/id-encryption';

/**
 * Helper function to convert undefined values to null for MySQL
 * Also converts empty strings to null for numeric fields
 */
function sanitizeValue(value: any): any {
  if (value === undefined || value === '') return null;
  return value;
}

/**
 * Helper function to format date for MySQL DATETIME
 * Converts ISO 8601 format to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
 */
function formatDateForMySQL(date: string | Date | null | undefined): string | null {
  if (!date) return null;
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    
    // Format: YYYY-MM-DD HH:MM:SS
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
}

/**
 * Single function to find admission with course data and sync to second database with linked tables
 * @param admissionId - The admission ID to sync
 * @returns Promise<boolean> - Success status
 */
export async function syncAdmissionWithCourse(admissionId: number): Promise<boolean> {
  console.log(`🔄 Starting sync for admission ID: ${admissionId}`);
  let connection: mysql.Connection | null = null;
  
  try {
   const encryptId = (id: number): string => {
  const encoded = btoa(`${id}_lla_${Date.now().toString().slice(-4)}`);
  return encoded.replace(/[+/=]/g, (match) => {
    switch (match) {
      case "+":
        return "-";
      case "/":
        return "_";
      case "=":
        return "";
      default:
        return match;
    }
  });
};
    // Step 1: Find admission data with all populates
    const admission = await strapi.entityService.findOne('api::admission.admission', admissionId, {
      populate: {
        passport_size_image: true,
        state: true,
        Course: {
          fields: ['id', 'Name']
        },
        Language_Proficiency: true,
        Parent_Guardian_Spouse_Details: {
          populate: {
            state: true,
          },
        },
        Education_Details: {
          populate: {
            Education_Details_12th_std: true,
            Education_Details_10th_std: true,
          },
        },
        Under_Graduate: {
          populate: {
            marksheet: true,
          },
        },
        Post_Graduate: {
          populate: {
            marksheet: true,
          },
        },
        Work_Experience: {
          populate: {
            reference_letter: true,
          },
        },
        Upload_Your_Portfolio: {
           populate: {
            images: true,
          },
        },
      }
    });

    if (!admission) {
      console.log(`Admission with ID ${admissionId} not found`);
      return false;
    }
console.log(admission,'reftetret');
    // Step 2: Connect to second MySQL database
    connection = await mysql.createConnection({
      host: process.env.SECOND_DB_HOST || 'localhost',
      port: parseInt(process.env.SECOND_DB_PORT || '3306'),
      user: process.env.SECOND_DB_USER || 'root',
      password: process.env.SECOND_DB_PASSWORD || '',
      database: process.env.SECOND_DB_NAME || 'admission_sync'
    });
    const reg_id =
  admission.EncryptId && admission.EncryptId.trim() !== ""
    ? admission.EncryptId
    : encryptId(admissionId);


    // Step 3: Prepare admission data mapping to your fields
    const admissionData = {
      lla_id: admission.id,
      name: admission.first_name,
      lastname: admission.last_name || '',
      signup: admission.createdAt,
      gender: admission.name_title === 'Mr.' ? 'Male' : (admission.name_title === 'Ms.' || admission.name_title === 'Mrs.' ? 'Female' : 'default'),
      dob: admission.date_of_birth,
      payment: admission.Payment_Status=='Paid' ? 1 : 0,
      amount: admission.Paid_Amount || 0,
      txnid: admission.txnid || '',
      mobileno: admission.mobile_no?.toString() || '',
      email: admission.email,
      reg_id: reg_id,
      course_name: (admission as any).Course?.Name || (admission as any).Course?.course_name || '',
      nationality: admission.nationality || '',
      language: (admission as any).Language_Proficiency ? JSON.stringify((admission as any).Language_Proficiency) : '',
      skype: '', // Not available in current schema
      portfoliolink: '', // Will be handled in portfolio table
      address: admission.address?.[0]?.children?.[0] && 'text' in admission.address[0].children[0] ? admission.address[0].children[0].text : '',
      hobbies: admission.hobbies || '',
      club: admission.photography_club || '',
      gradstatus:
      (admission as any).Under_Graduate
        ? (admission as any).Under_Graduate.ug_status === 'Finished'
          ? 1
          : 2
        : 0,
      grad: (admission as any).Under_Graduate?.marksheet?.url || '',
      gradtitle: (admission as any).Under_Graduate?.degree || '',
      postgradstatus:
        (admission as any).Post_Graduate &&
        (admission as any).Post_Graduate.length > 0
          ? (admission as any).Post_Graduate[0]?.pg_status === 'Finished'
            ? 1
            : 2
          : 0,
          postgradstatus1:
        (admission as any).Post_Graduate &&
        (admission as any).Post_Graduate.length > 0
          ? (admission as any).Post_Graduate[1]?.pg_status === 'Finished'
            ? 1
            : 2
          : 0,
        postgradstatus2:
        (admission as any).Post_Graduate &&
        (admission as any).Post_Graduate.length > 0
          ? (admission as any).Post_Graduate[2]?.pg_status === 'Finished'
            ? 1
            : 2
          : 0,
      postgrad: (admission as any).Post_Graduate && (admission as any).Post_Graduate.length > 0 ? (admission as any).Post_Graduate[0]?.marksheet?.url || '' : '',
      postgrad1: (admission as any).Post_Graduate && (admission as any).Post_Graduate.length > 0 ? (admission as any).Post_Graduate[1]?.marksheet?.url || '' : '',
      postgrad2: (admission as any).Post_Graduate && (admission as any).Post_Graduate.length > 0 ? (admission as any).Post_Graduate[2]?.marksheet?.url || '' : '',
      postgradtitle: (admission as any).Post_Graduate && (admission as any).Post_Graduate.length > 0 ? (admission as any).Post_Graduate[0]?.degree : '',
      postgradtitle1: (admission as any).Post_Graduate && (admission as any).Post_Graduate.length > 0 ? (admission as any).Post_Graduate[1]?.degree : '',
      postgradtitle2: (admission as any).Post_Graduate && (admission as any).Post_Graduate.length > 0 ? (admission as any).Post_Graduate[2]?.degree : '',
      gradYear: (admission as any).Under_Graduate?.year_of_passing || '',
      postGradYear: (admission as any).Post_Graduate && (admission as any).Post_Graduate.length > 0 ? (admission as any).Post_Graduate[0]?.year_of_passing : '',
      hsc: (admission as any).Education_Details?.Education_Details_12th_std?.url || '',
      sslc: (admission as any).Education_Details?.Education_Details_10th_std?.url || '',
      lla: '', // Not available in current schema
      others: '', // Not available in current schema
      social: '', // Not available in current schema
      registereddate: formatDateForMySQL(admission.createdAt),
      ip_address: admission.IpAddress ?? "",
      update_date: formatDateForMySQL(admission.updatedAt),
      ref_url: '', // Not available in current schema
      description: admission.Message || '',
      Payment_Status: admission.Payment_Status || '',
      profileimage: (admission as any).passport_size_image?.url || '',
      parentname: `${(admission as any).Parent_Guardian_Spouse_Details?.first_name || ''} ${(admission as any).Parent_Guardian_Spouse_Details?.last_name || ''}`.trim(),
      parentcontact: (admission as any).Parent_Guardian_Spouse_Details?.mobile_no || '',
      parentoccupation: (admission as any).Parent_Guardian_Spouse_Details?.profession || '',
      parentaddress: (admission as any).Parent_Guardian_Spouse_Details?.address?.[0]?.children?.[0]?.text || '',
      parentemail: (admission as any).Parent_Guardian_Spouse_Details?.email || '',
      bloodgroup: admission.blood_group || '',
      AdmissionYear: admission.AdmissionYear || '2025-2026',
      remainder: null, // Not available in current schema
      addresscity: admission.city || '',
      addresspin: admission.pincode || '',
      addressstate: (admission as any).state?.name || '',
      parentaddresscity: (admission as any).Parent_Guardian_Spouse_Details?.city || '',
      parentaddresspin: (admission as any).Parent_Guardian_Spouse_Details?.pincode || '',
      parentaddressstate: (admission as any).Parent_Guardian_Spouse_Details?.state?.name || '',
      NameTitle: admission.name_title || '',
      ParentNameTitle: (admission as any).Parent_Guardian_Spouse_Details?.title || '',
      graduate: (admission as any).Under_Graduate ? 'Yes' : 'No',
      Step: admission.step_3 ? "Step4" : (admission.step_2 ? "Step3" : (admission.step_1 ? "Step2" : (admission.step_0 ? "Step1" : 0))),
      Step1Date: admission.step_1 ? formatDateForMySQL(admission.updatedAt) : null,
      Step2Date: admission.step_2 ? formatDateForMySQL(admission.updatedAt) : null,
      Step3Date: admission.step_3 ? formatDateForMySQL(admission.updatedAt) : null,
      Step4Date: admission.Payment_Status === 'Completed' || admission.Payment_Status === 'Paid' ? formatDateForMySQL(admission.updatedAt) : null,
      document_id: admission.documentId,
      synced_at: new Date(),
      payment_response:admission?.payment_response ? JSON.stringify(admission?.payment_response) : null,
      Work_Experience:(admission as any).Work_Experience || [],
      Upload_Your_Portfolio:(admission as any).Upload_Your_Portfolio || []
    };
    console.log('🔍 Prepared admission data for sync:', admissionData.reg_id);
    // Step 4: Check if record exists and update or create in llawp_lla_admission
    const [existingRows] = await connection.execute(
      'SELECT lla_id, document_id FROM llawp_lla_admission WHERE document_id = ?',
      [admissionData.document_id]
    );

    let admissionDbId: number;

    console.log('🔍 Existing rows:', existingRows);

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      console.log('📝 Taking UPDATE path');
      // Get the existing admission ID
      admissionDbId = (existingRows[0] as any).lla_id;
      console.log('📋 Found existing record with lla_id:', admissionDbId);
      // Update existing record
      const updateSQL = `
        UPDATE llawp_lla_admission SET 
          name = ?, lastname = ?, signup = ?, gender = ?, dob = ?, payment = ?, amount = ?, txnid = ?,
          mobileno = ?, email = ?, reg_id = ?, course_name = ?, nationality = ?, language = ?,
          skype = ?, portfoliolink = ?, address = ?, hobbies = ?, club = ?, gradstatus = ?,
          grad = ?, gradtitle = ?, postgradstatus = ?, postgrad = ?, postgradtitle = ?, gradYear = ?,
          postGradYear = ?, hsc = ?, sslc = ?, lla = ?, others = ?, social = ?, registereddate = ?,
          ip_address = ?, update_date = ?, ref_url = ?, description = ?, profileimage = ?,
          parentname = ?, parentcontact = ?, parentoccupation = ?, parentaddress = ?, parentemail = ?,
          bloodgroup = ?, AdmissionYear = ?, remainder = ?, addresscity = ?, addresspin = ?,
          addressstate = ?, parentaddresscity = ?, parentaddresspin = ?, parentaddressstate = ?,
          NameTitle = ?, ParentNameTitle = ?, graduate = ?, Step = ?, Step1Date = ?, Step2Date = ?,
          Step3Date = ?, Step4Date = ?, document_id = ? , postgradstatus1 = ?, postgrad1 = ?, postgradtitle1 = ?,
          postgradstatus2 = ?, postgrad2 = ?, postgradtitle2 = ?
        WHERE document_id = ?
      `;
      
      const updateValues = [
        sanitizeValue(admissionData.name), sanitizeValue(admissionData.lastname), sanitizeValue(admissionData.signup), sanitizeValue(admissionData.gender),
        sanitizeValue(admissionData.dob), sanitizeValue(admissionData.payment), sanitizeValue(admissionData.amount), sanitizeValue(admissionData.txnid),
        sanitizeValue(admissionData.mobileno), sanitizeValue(admissionData.email), sanitizeValue(admissionData.reg_id), sanitizeValue(admissionData.course_name),
        sanitizeValue(admissionData.nationality), sanitizeValue(admissionData.language), sanitizeValue(admissionData.skype), sanitizeValue(admissionData.portfoliolink),
        sanitizeValue(admissionData.address), sanitizeValue(admissionData.hobbies), sanitizeValue(admissionData.club), sanitizeValue(admissionData.gradstatus),
        sanitizeValue(admissionData.grad), sanitizeValue(admissionData.gradtitle), sanitizeValue(admissionData.postgradstatus), sanitizeValue(admissionData.postgrad),
        sanitizeValue(admissionData.postgradtitle), sanitizeValue(admissionData.gradYear), sanitizeValue(admissionData.postGradYear), sanitizeValue(admissionData.hsc),
        sanitizeValue(admissionData.sslc), sanitizeValue(admissionData.lla), sanitizeValue(admissionData.others), sanitizeValue(admissionData.social),
        sanitizeValue(admissionData.registereddate), sanitizeValue(admissionData.ip_address), sanitizeValue(admissionData.update_date),
        sanitizeValue(admissionData.ref_url), sanitizeValue(admissionData.description), sanitizeValue(admissionData.profileimage),
        sanitizeValue(admissionData.parentname), sanitizeValue(admissionData.parentcontact), sanitizeValue(admissionData.parentoccupation),
        sanitizeValue(admissionData.parentaddress), sanitizeValue(admissionData.parentemail), sanitizeValue(admissionData.bloodgroup),
        sanitizeValue(admissionData.AdmissionYear), sanitizeValue(admissionData.remainder), sanitizeValue(admissionData.addresscity),
        sanitizeValue(admissionData.addresspin), sanitizeValue(admissionData.addressstate), sanitizeValue(admissionData.parentaddresscity),
        sanitizeValue(admissionData.parentaddresspin), sanitizeValue(admissionData.parentaddressstate), sanitizeValue(admissionData.NameTitle),
        sanitizeValue(admissionData.ParentNameTitle), sanitizeValue(admissionData.graduate), sanitizeValue(admissionData.Step),
        sanitizeValue(admissionData.Step1Date), sanitizeValue(admissionData.Step2Date), sanitizeValue(admissionData.Step3Date), sanitizeValue(admissionData.Step4Date), 
        sanitizeValue(admissionData.document_id),
        sanitizeValue(admissionData.postgradstatus1), sanitizeValue(admissionData.postgrad1), sanitizeValue(admissionData.postgradtitle1),
        sanitizeValue(admissionData.postgradstatus2), sanitizeValue(admissionData.postgrad2), sanitizeValue(admissionData.postgradtitle2),
        sanitizeValue(admissionData.document_id)
      ];

      // Debug logging
      console.log('🔍 UPDATE SQL Debug Info:');
      console.log('📊 Placeholder count:', (updateSQL.match(/\?/g) || []).length);
      console.log('📊 Value count:', updateValues.length);
      console.log('📋 Values:', JSON.stringify(updateValues, null, 2));
      
     const [result] =  await connection.execute(updateSQL, updateValues);
      console.log(`Updated admission ${admissionId} in llawp_lla_admission table`);
    } else {
      console.log('📝 Taking INSERT path');
      // Create new record
      const insertSQL = `
        INSERT INTO llawp_lla_admission ( name, lastname, signup, gender, dob, payment, amount, txnid, mobileno, email,
          reg_id, course_name, nationality, language, skype, portfoliolink, address, hobbies, club,
          gradstatus, grad, gradtitle, postgradstatus, postgrad, postgradtitle, gradYear, postGradYear,
          hsc, sslc, lla, others, social, registereddate, ip_address, update_date, ref_url,
          description, profileimage, parentname, parentcontact, parentoccupation, parentaddress,
          parentemail, bloodgroup, AdmissionYear, remainder, addresscity, addresspin, addressstate,
          parentaddresscity, parentaddresspin, parentaddressstate, NameTitle, ParentNameTitle,
          graduate, Step, Step1Date, Step2Date, Step3Date, Step4Date, document_id , postgradstatus1, postgrad1, postgradtitle1,
          postgradstatus2, postgrad2, postgradtitle2
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const insertValues = [ sanitizeValue(admissionData.name), sanitizeValue(admissionData.lastname), sanitizeValue(admissionData.signup),
        sanitizeValue(admissionData.gender), sanitizeValue(admissionData.dob), sanitizeValue(admissionData.payment), sanitizeValue(admissionData.amount),
        sanitizeValue(admissionData.txnid), sanitizeValue(admissionData.mobileno), sanitizeValue(admissionData.email), sanitizeValue(admissionData.reg_id),
        sanitizeValue(admissionData.course_name), sanitizeValue(admissionData.nationality), sanitizeValue(admissionData.language), sanitizeValue(admissionData.skype),
        sanitizeValue(admissionData.portfoliolink), sanitizeValue(admissionData.address), sanitizeValue(admissionData.hobbies), sanitizeValue(admissionData.club),
        sanitizeValue(admissionData.gradstatus), sanitizeValue(admissionData.grad), sanitizeValue(admissionData.gradtitle), sanitizeValue(admissionData.postgradstatus),
        sanitizeValue(admissionData.postgrad), sanitizeValue(admissionData.postgradtitle), sanitizeValue(admissionData.gradYear), sanitizeValue(admissionData.postGradYear),
        sanitizeValue(admissionData.hsc), sanitizeValue(admissionData.sslc), sanitizeValue(admissionData.lla), sanitizeValue(admissionData.others), sanitizeValue(admissionData.social),
        sanitizeValue(admissionData.registereddate), sanitizeValue(admissionData.ip_address), sanitizeValue(admissionData.update_date), sanitizeValue(admissionData.ref_url),
        sanitizeValue(admissionData.description), sanitizeValue(admissionData.profileimage), sanitizeValue(admissionData.parentname), sanitizeValue(admissionData.parentcontact),
        sanitizeValue(admissionData.parentoccupation), sanitizeValue(admissionData.parentaddress), sanitizeValue(admissionData.parentemail),
        sanitizeValue(admissionData.bloodgroup), sanitizeValue(admissionData.AdmissionYear), sanitizeValue(admissionData.remainder), sanitizeValue(admissionData.addresscity),
        sanitizeValue(admissionData.addresspin), sanitizeValue(admissionData.addressstate), sanitizeValue(admissionData.parentaddresscity),
        sanitizeValue(admissionData.parentaddresspin), sanitizeValue(admissionData.parentaddressstate), sanitizeValue(admissionData.NameTitle),
        sanitizeValue(admissionData.ParentNameTitle), sanitizeValue(admissionData.graduate), sanitizeValue(admissionData.Step), sanitizeValue(admissionData.Step1Date),
        sanitizeValue(admissionData.Step2Date), sanitizeValue(admissionData.Step3Date), sanitizeValue(admissionData.Step4Date), sanitizeValue(admissionData.document_id),
        sanitizeValue(admissionData.postgradstatus1), sanitizeValue(admissionData.postgrad1), sanitizeValue(admissionData.postgradtitle1),
        sanitizeValue(admissionData.postgradstatus2), sanitizeValue(admissionData.postgrad2), sanitizeValue(admissionData.postgradtitle2)
      ];

      // Debug logging
      console.log('🔍 INSERT SQL Debug Info:');
      console.log('📊 Column count:', (insertSQL.match(/,/g) || []).length + 1);
      console.log('📊 Value count:', insertValues.length);
      console.log('📊 Placeholder count:', (insertSQL.match(/\?/g) || []).length);
      console.log('📋 Values:', JSON.stringify(insertValues, null, 2));
      
     const [result] =  await connection.execute(insertSQL, insertValues);
      
      // Store the new admission ID
      admissionDbId = (result as any).insertId;
      console.log('📋 New record created with ID:', admissionDbId);
      
      console.log(`Created new admission ${admissionId} in llawp_lla_admission table`);
    }

    console.log('🔍 Final admissionDbId:', admissionDbId);
    console.log(admissionDbId +'insert id');
    //Step 5: Sync Work Experience to llawp_lla_experience table
    if (admissionData.Work_Experience && admissionData.Work_Experience.length > 0) {
      // Delete existing experience records for this admission
      await connection.execute('DELETE FROM llawp_lla_experience WHERE personsid = ?', [admissionDbId]);
                const formatDuration = (start?: string, end?: string) => {
            if (!start || !end) return "";

            const startDate = new Date(start);
            const endDate = new Date(end);

            let years = endDate.getFullYear() - startDate.getFullYear();
            let months = endDate.getMonth() - startDate.getMonth();

            if (months < 0) {
              years--;
              months += 12;
            }

            const yearText = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";
            const monthText = months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "";

            return [yearText, monthText].filter(Boolean).join(" ");
          };

      // Insert new experience records
      for (let i = 0; i < admissionData.Work_Experience.length; i++) {
        const exp = admissionData.Work_Experience[i];
        await connection.execute(`
          INSERT INTO llawp_lla_experience (
            personsid, expid, role, employer, duration, refferenceletter, date
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          admissionDbId,
          i + 1,
          exp.designation || '',
          exp.employer || '',
          formatDuration(exp.duration_start, exp.duration_end),
          exp.reference_letter?.url || '',
          exp.createdAt || new Date()
        ]);
      }
      console.log(`Synced ${admissionData.Work_Experience.length} experience records`);
    }

    // Step 6: Sync Portfolio to llawp_lla_portfolio table
    if (admissionData.Upload_Your_Portfolio?.images && admissionData.Upload_Your_Portfolio.images.length > 0) {
      // Delete existing portfolio records for this admission
      await connection.execute('DELETE FROM llawp_lla_portfolio WHERE personsid = ?', [admissionDbId]);
      console.log(admissionData.Upload_Your_Portfolio.images);
      // Insert new portfolio records
      for (let i = 0; i < admissionData.Upload_Your_Portfolio.images.length; i++) {
        const portfolio = admissionData.Upload_Your_Portfolio.images[i];
        await connection.execute(`
          INSERT INTO llawp_lla_portfolio (
            personsid, portfolioid, portfolio, caption
          ) VALUES (?, ?, ?, ?)
        `, [
          admissionDbId,
          i + 1,
          portfolio.url || '',
          portfolio.name || ''
        ]);
      }
      console.log(`Synced portfolio records`);
    }
    console.log('🔍 admissionData.payment_response:', admissionData.payment_response);
    console.log('🔍 admissionData.txnid:', admissionData.txnid);
    if (admissionData.payment_response && admissionData.txnid) {
      // Delete existing portfolio records for this admission
      await connection.execute('DELETE FROM llawp_lla_pay WHERE userid = ?', [admissionDbId]);
      
        await connection.execute(`
          INSERT INTO llawp_lla_pay (
            userid, transid, transaction, status
          ) VALUES (?, ?, ?, ?)
        `, [
          admissionDbId,
          admissionData.txnid,
          admissionData.payment_response,
          admissionData.Payment_Status === 'Paid' ? 'Success' : 'failure'
        ]);
      console.log(`Synced payment records`);
    }
    return true;

  } catch (error) {
    console.error(`Error syncing admission ${admissionId} with linked tables:`, error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
