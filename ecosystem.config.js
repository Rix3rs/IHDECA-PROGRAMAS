module.exports = {
  apps: [
    {
      name: "ihdeca-app",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3009",
      instances: "max",           // Usa todos los núcleos de CPU disponibles
      exec_mode: "cluster",       // Modo cluster para balanceo de carga interno y zero downtime
      watch: false,               // Desactivado en producción para evitar reinicios infinitos
      env: {
        NODE_ENV: "production",
        PORT: 3009
      }
    }
  ]
};
