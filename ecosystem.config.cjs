module.exports = {
  apps: [
    {
      name: 'talentflow-ai',
      script: 'scripts/serve-dashboard.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};

