module.exports = {
  apps: [
    {
      name: 'clarifin-backend',
      script: 'index.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      watch: false
    }
  ]
};
