import { default as makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { createInterface } from "readline";
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import { cache, recache } from "./init.js";
import Main from './main.js';
import { re } from "mathjs";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve)).catch(e => console.warn("Readline failed to initialize. proceeding with default phone number"));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'error' }),
        syncFullHistory: false,
        auth: state,
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });
    const main = new Main(sock);
    await recache(sock, 'start');

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("group-participants.update", async (update) => main.event(update));

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log("Scan the QR code below to connect the bot to your WhatsApp account:");
            qrcode.generate(qr, { small: true });
            if (!sock.authState.creds.registered) {
                const number = cache.configs.number || await question('Phone number (with country code): ') || '';
                const code = await sock.requestPairingCode(number.replace(/[^\d]/g, ''));
                console.log(`\n🔗 Pairing Code: ${code}\n`);
                if (!cache.configs.number) cache.configs.number = number;
            }
        }
        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) startBot();
        } else if (connection === "open") await main.init();
    });

    sock.ev.on("messages.upsert", async ({ messages, type }) => await main.message(messages, type));
}

startBot();