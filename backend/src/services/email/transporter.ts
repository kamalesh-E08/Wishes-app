import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log("✅ Gmail transporter ready");
  } catch (error) {
    console.error("❌ Gmail transporter failed");
    console.error(error);
  }
}
