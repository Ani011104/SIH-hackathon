const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const trimmedVerifySid = process.env.TWILIO_VERIFY_SID ? process.env.TWILIO_VERIFY_SID.trim() : '';



const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOTP = async (phone) => {
  if (!trimmedVerifySid) {
    throw new Error("TWILIO_VERIFY_SID is not set or empty after trimming");
  }
  return await client.verify.v2
    .services(trimmedVerifySid)
    .verifications.create({
      to: `+91${phone}`,
      channel: 'sms',
    });
};

module.exports = sendOTP;
