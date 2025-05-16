import { OAuth2Client } from "google-auth-library";
import path from "node:path";
import { readFile } from "fs/promises";
import { env } from "./env.js";
import createHttpError from "http-errors";
import { ENV_VARS, PATH_GOOGLE_JSON } from "../constants/index.js";

const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } = ENV_VARS.GOOGLE;


let googleOAuthClient;

async function initGoogleOAuthClient() {
  const configBuffer = await readFile(PATH_GOOGLE_JSON, "utf-8");
  const oauthConfig = JSON.parse(configBuffer);

  googleOAuthClient = new OAuth2Client({
    clientId: env(AUTH_CLIENT_ID),
    clientSecret: env(AUTH_CLIENT_SECRET),
    redirectUri: oauthConfig.web.redirect_uris[0],
  });
}

export const googleOAuthReady = initGoogleOAuthClient();

export const generateAuthUrl = () => {
  if (!googleOAuthClient) {
    throw new Error("Google OAuth Client not initialized");
  }

  return googleOAuthClient.generateAuthUrl({
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    access_type: "offline",
    prompt: "consent", 
  });
};

export const validateCode = async (code) => {
  if (!googleOAuthClient) {
    throw new Error("Google OAuth Client not initialized");
  }

  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) {
    throw createHttpError(401, "Unauthorized");
  }

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
    audience: env(AUTH_CLIENT_ID), 
  });

  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  if (payload.given_name && payload.family_name) {
    return `${payload.given_name} ${payload.family_name}`;
  }
  return payload.given_name || "Guest";
};
