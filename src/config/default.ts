export const APP = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3000,
  saltWorkFactor: 10,
};
