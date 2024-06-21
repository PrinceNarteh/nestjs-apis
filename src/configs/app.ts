export default () => ({
  server: {
    port: process.env.PORT || 4000,
  },
  database: {
    uri: process.env.DB_URI,
  },
});
