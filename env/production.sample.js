module.exports = {
  env: 'production',
  port: process.env.PORT || 3000,
  mongodbPath: '__MONGODB_PATH__',
  elasticsearchUrl: '__ELASTICSEARCH_URL__',
};
