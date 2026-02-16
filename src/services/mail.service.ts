import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  await transporter.sendMail({
    from: `Siena  <${process.env.GMAIL_EMAIL}>`,
    to,
    subject,
    html,
  });
}
