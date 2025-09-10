import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  db: {
    user: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    server: process.env.DB_HOST as string,
    database: process.env.DB_NAME as string,
    port: Number(process.env.DB_PORT) || 1433,
    options: {
      encrypt: true, // poner true si usas Azure
      trustServerCertificate: true,
    },
  },
};

export default config;