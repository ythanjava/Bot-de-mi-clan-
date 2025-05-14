const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const NeDB = require('nedb');
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// Crear base de datos
const db = new NeDB({ filename: 'session_data.db', autoload: true });

// Verificar si la base de datos está vacía y agregar datos si es necesario
const loadSessions = () => {
    return new Promise((resolve, reject) => {
        db.find({}, (err, sessions) => {
            if (err) reject('Error al cargar las sesiones.');
            resolve(sessions);
        });
    });
};

// Guardar la sesión en la base de datos
const saveSession = (sessionData) => {
    return new Promise((resolve, reject) => {
        db.insert(sessionData, (err, newDoc) => {
            if (err) reject('Error al guardar la sesión.');
            resolve(newDoc);
        });
    });
};

// Cargar la sesión o crear una nueva si no existe
const loadOrCreateSession = async () => {
    try {
        const sessions = await loadSessions();
        if (sessions.length > 0) {
            console.log("Cargando sesión existente...");
            return sessions[0];  // Asumiendo que solo hay una sesión
        } else {
            console.log("Creando nueva sesión...");
            const newSession = {
                createdAt: new Date(),
                active: true,
                data: {}
            };
            return await saveSession(newSession);
        }
    } catch (error) {
        console.error(error);
    }
};

// Función para actualizar el estado de la sesión
const updateSessionStatus = async (sessionId, status) => {
    db.update({ _id: sessionId }, { $set: { active: status } }, {}, (err, numReplaced) => {
        if (err) console.error('Error al actualizar la sesión:', err);
        else console.log('Sesión actualizada con éxito.');
    });
};

// Configuración y manejo de eventos del cliente
client.on('qr', (qr) => {
    console.log('Escanea el siguiente código QR:', qr);
});

client.on('authenticated', async (session) => {
    console.log('Sesión autenticada con éxito.');
    // Guarda la sesión de autenticación en la base de datos
    await saveSession({ ...session, createdAt: new Date() });
});

client.on('auth_failure', (msg) => {
    console.error('Fallo de autenticación:', msg);
});

client.on('ready', () => {
    console.log('Cliente listo para enviar mensajes');
    client.sendMessage('numero_de_telefono', '¡Hola! El bot está listo.');
});

// Arrancar el cliente y cargar la sesión
client.initialize()
    .then(async () => {
        const session = await loadOrCreateSession();
        if (session && session.active) {
            console.log('Cargando bot con sesión activa.');
        } else {
            console.log('Iniciando sesión nueva.');
        }
    })
    .catch(err => {
        console.error('Error al inicializar el cliente:', err);
    });