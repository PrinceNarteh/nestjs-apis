export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 4000,
  },
  database: {
    uri: process.env.DB_URI,
  },
  jwt: {
    accessToken: process.env.JWT_ACCESS_TOKEN,
    refreshToken: process.env.JWT_REFRESH_TOKEN,
  },
});
