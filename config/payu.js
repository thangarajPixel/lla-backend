module.exports = {
  KEY: process.env.PAYU_KEY || "PIujuyTq",
  SALT: process.env.PAYU_SALT || "KuoFYxzq8F", 
  BASE_URL: process.env.PAYU_BASE_URL || "https://test.payu.in/_payment", // prod: https://secure.payu.in/_payment
  SUCCESS_URL: process.env.PAYU_SUCCESS_URL || "https://yourdomain.com/api/payment/success",
  FAILURE_URL: process.env.PAYU_FAILURE_URL || "https://yourdomain.com/api/payment/failure"
};