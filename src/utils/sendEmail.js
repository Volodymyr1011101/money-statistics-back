import nodemailer from 'nodemailer';
import { getEnvVariable } from './getEnvVariable.js';
import { ENV_VARS } from '../constants/index.js';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = ENV_VARS.BREVO;

const transporter = nodemailer.createTransport({
  host: getEnvVariable(SMTP_HOST),
  port: Number(getEnvVariable(SMTP_PORT)),
  auth: {
    user: getEnvVariable(SMTP_USER),
    pass: getEnvVariable(SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
