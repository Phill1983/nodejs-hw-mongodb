import nodemailer from "nodemailer";

console.log("📦 SMTP CONFIG:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // user: process.env.SMTP_USER,
    // pass: process.env.SMTP_PASSWORD ? "***" : "MISSING",
    // from: process.env.SMTP_FROM,
  });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default transporter;
