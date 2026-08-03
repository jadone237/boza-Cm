// Lance `ng serve` sur le port fourni via la variable d'environnement PORT.
// Existe pour éviter la syntaxe "$PORT" (bash) dans package.json/launch.json,
// qui n'est pas expansée par cmd.exe sur Windows et provoque un port NaN.
const { spawnSync } = require('child_process');

const envPort = Number(process.env.PORT);
const port = Number.isInteger(envPort) && envPort > 0 && envPort < 65536 ? String(envPort) : '4200';

const result = spawnSync('npx', ['ng', 'serve', '--port', port], {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
