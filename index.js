import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import yargs from 'yargs';
import chalk from 'chalk';
import os from 'os';
import { promises as fsPromises } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { name, author, version } = require(join(__dirname, './package.json'));
const rl = createInterface({ input: process.stdin, output: process.stdout });

let isRunning = false;

// Presentación visual
function mostrarBanner() {
  cfonts.say('EXODIN\nBOT\nMD', {
    font: 'block',
    align: 'center',
    gradient: ['red', 'blue'],
  });

  cfonts.say('PODER SUPREMO DEL CLAN EXODIN', {
    font: 'console',
    align: 'center',
    colors: ['red'],
  });
}

// Info del sistema
async function mostrarInfoSistema() {
  const ramTotal = os.totalmem() / 1024 ** 3;
  const ramLibre = os.freemem() / 1024 ** 3;
  const hora = new Date().toLocaleString();

  try {
    const data = await fsPromises.readFile(join(__dirname, './package.json'), 'utf-8');
    const json = JSON.parse(data);

    console.log(chalk.cyan(`
╭━━━[ EXODIN SYSTEM ] ┃
🖥️  Sistema: ${os.type()} ${os.release()} (${os.arch()})
💾  RAM Total: ${ramTotal.toFixed(2)} GB
⚙️  RAM Libre: ${ramLibre.toFixed(2)} GB
🛠️  Bot: ${json.name} v${json.version}
👑  Clan: EXODIN SUPREMACY
🕒  Hora Actual: ${hora}
╰━━━━━━━━━━━━━━━━━━━━
    `.trim()));
  } catch (err) {
    console.error(chalk.red(`❌ Error al leer package.json: ${err}`));
  }
}

// Control de errores
process.on('uncaughtException', (err) => {
  if (err.code === 'ENOSPC') {
    console.error(chalk.redBright('[ERROR] ¡Sin espacio o límite de watchers alcanzado! Reiniciando...'));
  } else {
    console.error(chalk.redBright('[ERROR NO CAPTURADO]: '), err);
  }
  process.exit(1);
});

// Inicio del bot
async function start(file) {
  if (isRunning) return;
  isRunning = true;

  const args = [join(__dirname, file), ...process.argv.slice(2)];
  setupMaster({ exec: args[0], args: args.slice(1) });

  const worker = fork();

  worker.on('message', (data) => {
    switch (data) {
      case 'reset':
        worker.process.kill();
        isRunning = false;
        start(file);
        break;
      case 'uptime':
        worker.send(process.uptime());
        break;
    }
  });

  worker.on('exit', (_, code) => {
    isRunning = false;
    console.error(chalk.red(`[⚠️ EXODIN] El bot se cerró con código: ${code}`));
    if (code === 0) {
      watchFile(args[0], () => {
        unwatchFile(args[0]);
        start(file);
      });
    }
  });

  mostrarInfoSistema();
  yargs(process.argv.slice(2)).exitProcess(false).parse();

  if (!rl.listenerCount('line')) {
    rl.on('line', (line) => {
      worker.send(line.trim());
    });
  }
}

// Ejecución principal
mostrarBanner();
start('main.js');