export const APP = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 8000,
  saltWorkFactor: 10,
};
