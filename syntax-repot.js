import fs from 'fs';
import path from 'path';
import syntaxError from 'syntax-error'; // Para verificar errores de sintaxis
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(__dirname);

// Obtenemos las carpetas desde el package.json
let folders = ['.', ...Object.keys(require(path.join(__dirname, './package.json')).directories)];
let files = [];

// Recorremos las carpetas y buscamos los archivos .js
for (let folder of folders) {
    for (let file of fs.readdirSync(folder).filter(v => v.endsWith('.js'))) {
        files.push(path.resolve(path.join(folder, file)));
    }
}

// Recorremos cada archivo .js encontrado y verificamos la sintaxis
for (let file of files) {
    if (file === __filename) continue; // Ignorar el archivo de reporte
    console.error('Revisando', file);

    const error = syntaxError(fs.readFileSync(file, 'utf8'), file, {
        sourceType: 'module',  // Tipo de fuente, especialmente para ES Modules
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
    });

    if (error) {
        console.error(`¡Error de sintaxis en ${file}:`);
        console.error(error); // Mostrar el error encontrado
    } else {
        console.log(`Sin errores de sintaxis en ${file}`);
    }
}