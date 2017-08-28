module.exports = {
  env: 'development',
  port: process.env.PORT || 3000,
  logger: true,
  mongodbPath: '__MONGODB_PATH__',
  elasticsearchUrl: '__ELASTICSEARCH_URL__',
};
