// Test PayU config loading
const path = require("path");

try {
  const payu = require(path.join(process.cwd(), 'config', 'payu'));
  console.log('✅ PayU config loaded successfully:');
  console.log('KEY:', payu.KEY);
  console.log('BASE_URL:', payu.BASE_URL);
  console.log('SALT:', payu.SALT ? '***hidden***' : 'NOT SET');
} catch (error) {
  console.error('❌ Failed to load PayU config:', error.message);
  console.log('Current working directory:', process.cwd());
  console.log('Trying to load from:', path.join(process.cwd(), 'config', 'payu'));
}