import dotenv from "dotenv";
dotenv.config({ path: './Backend/.env' });
import ImageKit from "imagekit";

export const imagekit = new ImageKit({
    publicKey: process.env.kitPublic,  // Replace with your public API key
    privateKey: process.env.kitPrivate, // Replace with your private API key
    urlEndpoint: process.env.kitUrl, // Your ImageKit URL endpoint
  });
