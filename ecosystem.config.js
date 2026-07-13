module.exports = {
  apps: [
    {
      name: "ihdeca-app",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3009",
      instances: 1,               // Ejecutar solo 1 instancia
      exec_mode: "fork",          // Modo fork (proceso único)
      watch: false,               // Desactivado en producción para evitar reinicios infinitos
      env: {
        NODE_ENV: "production",
        PORT: 3009
      }
    }
  ]
};
