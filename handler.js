// handler.js

const fs = require('fs');
const path = require('path');

const jugadoresPath = path.join(__dirname, 'data/jugadores.json');
const guerrasPath = path.join(__dirname, 'data/guerras.json');
const eventosPath = path.join(__dirname, 'data/eventos.json');
const roles = require('./roles.json');

// Utilidades
function guardarArchivo(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function cargarArchivo(path) {
  if (!fs.existsSync(path)) return [];
  return JSON.parse(fs.readFileSync(path));
}

function formatearLista(lista) {
  return lista.length > 0 ? lista.map((j, i) => `${i + 1}. ${j}`).join('\n') : 'No hay datos registrados.';
}

function esLiderRemitente(sender) {
  return roles.lideres.includes(sender);
}

function esSubLiderRemitente(sender) {
  return roles.sublideres.includes(sender);
}

module.exports = async function handleMessage(message, client) {
  const content = message.body.toLowerCase();
  const sender = message.from;

  let jugadores = cargarArchivo(jugadoresPath);
  let guerras = cargarArchivo(guerrasPath);
  let eventos = cargarArchivo(eventosPath);

  // Menú principal
  if (content === '!exodi') {
    await client.sendMessage(sender,
      `*Bienvenido al clan EXODI*\n\n` +
      `Comandos disponibles:\n` +
      `- !registro [nombre]\n` +
      `- !jugadores\n` +
      `- !eventos / !eventonuevo\n` +
      `- !nuevaguerra / !guerras\n` +
      `- !dinamica\n\n` +
      `*Comandos de líderes/sublíderes:* (solo si tienes permiso)\n` +
      `- !remover [nombre]\n` +
      `- !limpiarjugadores`
    );
  }

  // Registro
  else if (content.startsWith('!registro ')) {
    const nombre = message.body.split(' ')[1];
    if (jugadores.includes(nombre)) {
      return client.sendMessage(sender, `*${nombre}* ya está registrado.`);
    }
    jugadores.push(nombre);
    guardarArchivo(jugadoresPath, jugadores);
    await client.sendMessage(sender, `Jugador *${nombre}* registrado correctamente.`);
  }

  // Lista de jugadores
  else if (content === '!jugadores') {
    await client.sendMessage(sender, `*Miembros del Clan:*\n${formatearLista(jugadores)}`);
  }

  // Remover jugador (solo líderes/sublíderes)
  else if (content.startsWith('!remover ')) {
    if (!esLiderRemitente(sender) && !esSubLiderRemitente(sender)) {
      return client.sendMessage(sender, 'No tienes permiso para usar este comando.');
    }
    const nombre = message.body.split(' ')[1];
    jugadores = jugadores.filter(j => j !== nombre);
    guardarArchivo(jugadoresPath, jugadores);
    await client.sendMessage(sender, `*${nombre}* ha sido removido del clan.`);
  }

  // Limpiar lista de jugadores (solo líderes)
  else if (content === '!limpiarjugadores') {
    if (!esLiderRemitente(sender)) {
      return client.sendMessage(sender, 'Solo un líder puede ejecutar esto.');
    }
    jugadores = [];
    guardarArchivo(jugadoresPath, jugadores);
    await client.sendMessage(sender, 'Lista de jugadores limpiada.');
  }

  // Nueva guerra
  else if (content.startsWith('!nuevaguerra ')) {
    const rival = message.body.replace('!nuevaguerra ', '');
    guerras.push({ rival, fecha: new Date().toLocaleString() });
    guardarArchivo(guerrasPath, guerras);
    await client.sendMessage(sender, `¡Guerra contra *${rival}* registrada!`);
  }

  // Mostrar guerras
  else if (content === '!guerras') {
    const msg = guerras.map((g, i) => `${i + 1}. *${g.rival}* - ${g.fecha}`).join('\n') || 'No hay guerras.';
    await client.sendMessage(sender, `*Historial de Guerras:*\n${msg}`);
  }

  // Crear evento
  else if (content.startsWith('!eventonuevo ')) {
    const nombreEvento = message.body.replace('!eventonuevo ', '');
    eventos.push({ nombre: nombreEvento, fecha: new Date().toLocaleString() });
    guardarArchivo(eventosPath, eventos);
    await client.sendMessage(sender, `Evento *${nombreEvento}* creado.`);
  }

  // Ver eventos
  else if (content === '!eventos') {
    const msg = eventos.map((e, i) => `${i + 1}. *${e.nombre}* - ${e.fecha}`).join('\n') || 'No hay eventos.';
    await client.sendMessage(sender, `*Eventos del Clan:*\n${msg}`);
  }

  // Dinámica aleatoria
  else if (content === '!dinamica') {
    const dinamicas = [
      'Cuenta tu mejor momento en batalla.',
      'Reta a un miembro del clan a un duelo 1v1.',
      'Envía un sticker que te represente como guerrero.',
      'Haz una cadena con tu emoji favorito.'
    ];
    const dinamica = dinamicas[Math.floor(Math.random() * dinamicas.length)];
    await client.sendMessage(sender, `*Dinámica del día:*\n${dinamica}`);
  }

  // Comando no reconocido
  else if (content.startsWith('!')) {
    await client.sendMessage(sender, 'Comando no reconocido. Usa *!exodi* para ver la lista.');
  }
};