const path = require('path');

module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/src/main.js',
      // This is the "default" env
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      // This is the "production" env
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Use an absolute path for the env file
      env_file: path.resolve(__dirname, '.env.production'),
    },
  ],
};