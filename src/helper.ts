function addBaseUrlToMediaUrls(obj) {
  const baseUrl = process.env.BASE_URL;

  if (Array.isArray(obj)) {
    return obj.map(addBaseUrlToMediaUrls);
  } else if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const value = obj[key];

      if (
        key === "url" &&
        typeof value === "string" &&
        !value.startsWith("http")
      ) {
        obj[key] = `${baseUrl}${value}`;
      } else if (typeof value === "object" && value !== null) {
        addBaseUrlToMediaUrls(value);
      }
    }
  }

  return obj;
}

// Interface for Google reCAPTCHA API response
interface RecaptchaResponse {
  success?: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

async function googleRecaptchaVerify(recaptchaToken: string): Promise<{ success: boolean; score?: number; error?: string }> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      return {
        success: false,
        error: 'reCAPTCHA secret key not configured'
      };
    }

    if (!recaptchaToken) {
      return {
        success: false,
        error: 'reCAPTCHA token is required'
      };
    }

    // Google reCAPTCHA verification URL
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    
    // Prepare the request body
    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', recaptchaToken);
    
    // Optional: Add user's IP address for additional verification
    // params.append('remoteip', userIpAddress);

    // Make request to Google reCAPTCHA API
    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`
      };
    }

    const rawData = await response.json();
    const data = rawData as RecaptchaResponse;

    // Check if verification was successful
    if (data.success === true) {
      return {
        success: true,
        score: data.score || null, // reCAPTCHA v3 returns a score (0.0 to 1.0)
      };
    } else {
      return {
        success: false,
        error: `reCAPTCHA verification failed: ${data['error-codes']?.join(', ') || 'Unknown error'}`
      };
    }

  } catch (error: any) {
    console.error('reCAPTCHA verification error:', error);
    return {
      success: false,
      error: `Verification failed: ${error?.message || 'Unknown error'}`
    };
  }
}

// Helper function to get reCAPTCHA site key for frontend
function getRecaptchaSiteKey(): string | null {
  return process.env.RECAPTCHA_SITE_KEY || null;
}

export { addBaseUrlToMediaUrls, googleRecaptchaVerify, getRecaptchaSiteKey };
