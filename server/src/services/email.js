import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const OTP_FROM_EMAIL = process.env.OTP_FROM_EMAIL || SMTP_USER;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error.message);
    console.error('This typically means:');
    console.error('1. SMTP credentials are incorrect');
    console.error('2. Gmail App Password needs to be regenerated');
    console.error('3. Less secure app access is blocked');
  } else {
    console.log('SMTP Connection verified successfully');
  }
});

export async function sendOtpEmail(toEmail, otp, expiryMinutes) {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP_USER and SMTP_PASS are required in server/.env');
  }

  const subject = 'Your Login OTP';
  const text = `Your OTP is ${otp}. It will expire in ${expiryMinutes} minutes.`;

  try {
    const info = await transporter.sendMail({
      from: OTP_FROM_EMAIL,
      to: toEmail,
      subject,
      text,
    });
    console.log('OTP email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send OTP email:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}
