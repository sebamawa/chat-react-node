import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
// const io = new Server(server);
const io = new Server(server, {cors: {origin: "*", methods: ["GET", "POST"]}});

// const { Client, MessageMedia } = require('whatsapp-web.js');
import pkg from 'whatsapp-web.js';
const { Client, MessageMedia } = pkg;
//const qrcode = require('qrcode-terminal');
import qrcode from 'qrcode-terminal';

// utilities imports
//const fs = require('fs');
import fs from 'fs';
//const ora = require('ora');
import ora from 'ora';
// const chalk = require('chalk');
import chalk from 'chalk';

// Variables globales
// para guardar sesion al conectar navegador a dispositivo
const SESSION_FILE_PATH = './session.json';
let client;
let sessionData;
let idMsg = 1;
let contactsArr = [
    {
        name: 'Marcos',
        phone: '59893545877'
    },
    {
        name: 'Cacha',
        phone: '59898585238'
    }
];

// // ruta
// app.get('/', (req, res) => {
//     // res.send(`Bot de Whatsapp ...`);
//     res.sendFile(__dirname + '/index.html');
// });

/**
 * GESTION DE SESION
 */ 

/**
 * Mantiene la sesion una vez conectado el navegador con el dispositivo.
 * Utiliza claves-valor ('cookies').
 */
const withSession = (socket) => {
    // Si existe cargamos el archivo con credenciales de la sesion
    const spinner = ora(`Cargando ${chalk.yellow('Validando session con Whatsapp...')}`);
    // archivo que contiene la sesion
    // sessionData = require(SESSION_FILE_PATH);
    sessionData = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, 'utf-8'))
    spinner.start();
    client = new Client({ // inicia con datos de sesion
        session: sessionData
    });

    // evento ready informa que dispositivo esta listo
    client.on('ready', () => {
        console.log('Client is ready!');
        spinner.stop();
        listenMessage(socket); // escucha por mensajes recibidos
        // listenRevokeMessage(); // escucha por mensajes borrados para todos 
    })

    // si hay error de autentificacion, por ej. poque se vencio la sesion
    client.on('auth_failure', () => {
        spinner.stop();
        console.log('** Error de autentificacion. Vuelva a generar el QRCODE (Borrar el archivo session.json)');
    })

    client.initialize();
}

/**
 * Para cuando conecta por primera vez navegador con dispositivo.
 * Genera QRCODE
 */ 
const withOutSession = async (socket) => {

    console.log('NO hay sesion guardada');
    client = new Client();
    client.on('qr', (qr) => {
        console.log('QR RECEIVED:', qr);
        // socket.emit('qr-code', qr);
        qrcode.generate(qr, {small: true}); // genera codigo y muestra por terminal
        // envia codigo qr a browser por socket
        // qrcode.generate(qr, (qrcode) => {
        //     console.log(qrcode);
        //     socket.emit('qr-code', qrcode);
        // });
    });

    // la funcion authenticated se ejecuta cuando el script verifica que se vinculo 
    // el dispositivo al navegador
    client.on('authenticated', (session) => {
        // se guardan credenciales de sesion para usar luego
        sessionData = session;
        // crea archivo con datos de la sesion
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        listenMessage(socket); // escucha por mensajes recibidos
        // listenRevokeMessage(); // escucha por mensajes borrados para todos 
    });

    await client.initialize(); // espera para llamar a withSession()
    // withSession(socket);
}

/**
 * ENVIO Y RECEPCION DE MENSAJES DE TEXTO Y MEDIA
 */

/**
 * Escucha nuevos mensajes de whatsapp. Se llama desde cliente.on('ready')
 */
 const listenMessage = (socket) => {

    // mensaje de un whatsapp
     client.on('message', (msg) => {
         const {from, to, body, author} = msg; //desestructuro objeto recibido
         //console.log(msg);
         console.log(from, to);
         console.log(body); // no imprime body para grupos

         // determino contacto del mensaje
         let contact = contactsArr.find(contact => from.includes(contact.phone));

         // envio mensaje de whatsapp al browser
         const msgToBrowser = {
            id: idMsg,
            author: author,
            text: body
         }
         // socket.emit('whatsappweb-message', `${contact.name}: ${body}`);
         socket.emit('whatsappweb-message', msgToBrowser);
         idMsg++;
     });

    // espero mensaje del browser y lo reenvio (por ahora solo a Marcos)
        socket.on('browser-message', (msg) => {
        console.log(msg);
        // enviar a quien corresponda (to number)
        sendMessage('59893545877@c.us', msg);
    });
 }

 const listenRevokeMessage = () => {  
     client.on('message_revoke_everyone', (msg, revoked_msg) => {
        const {from, to, body} = revoked_msg; 
        console.log(from, to, body);
        // const {from, to, body} = msg; //desestructuro objeto recibido
        sendMessage(from, 'Vi que borraste un mensaje que decía...');
        sendMessage(from, `*${body}*`);
    })
 }

 const sendMedia = (to, file) => {
    // la libreria dispone de un metodo para cargar el archivo a enviar 
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`);
    // console.log(`./mediaSend/${file}`);
    client.sendMessage(to, mediaFile);
 }

 /**
  * Envia un mensaje.
  * Parms: 
  * to: destinatario
  */ 
 const sendMessage = (to, message) => {
     client.sendMessage(to, message);
 }


// espero conexion sobre el socket del cliente (abrir pagina)
io.on('connection', (socket) => {
    console.log('Socket opened');
    // si existe o no el archivo con datos de la sesion llama a funcion que corresponda
    // CORREGIR: CARGA SESION DE WPWEB CADA VEZ SE CONECTA UN CLIENTE ---> DEMORA
    (fs.existsSync(SESSION_FILE_PATH)) ? withSession(socket) : withOutSession(socket);
});

// // si existe o no el archivo con datos de la sesion llama a funcion que corresponda
// (fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();


server.listen(4000, () => {
    console.log('server listening on port 4000');
});