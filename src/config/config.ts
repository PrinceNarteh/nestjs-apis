export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 4000,
  },
  database: {
    uri: process.env.DB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
