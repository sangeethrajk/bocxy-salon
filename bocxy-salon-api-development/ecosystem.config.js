module.exports = {
  apps: [
    {
      name: "bocxy",
      script: "./bin/www",
      watch: true,
      env: {
        PORT: 8000,
        NODE_ENV: "development",
      },
      env_production: {
        PORT: 8000,
        NODE_ENV: "production",
      },
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
