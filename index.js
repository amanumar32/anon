import { default as makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { text } from "input";
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import { cache, recache } from "./init.js";
import Main from './main.js';
import dotenv from 'dotenv';
import logger from "./library/logger.js";
import app from "./api/app.js"

dotenv.config({ quiet: true });
logger();

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
    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("group-participants.update", async (update) => main.event(update));

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log("Scan the QR code below to connect the bot to your WhatsApp account:");
            qrcode.generate(qr, { small: true });
            if (!sock.authState.creds.registered) {
                const number = cache.configs.number || await text('Phone number (with country code): ') || '';
                const code = await sock.requestPairingCode(number.replace(/[^\d]/g, ''));
                console.log(`\n🔗 Pairing Code: ${code}\n`);
                if (!cache.configs.number) cache.configs.number = number;
                recache();
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
recache('start').then(() => { if (cache.configs.developer.api_enabled) app.listen(cache.configs.developer.port, () => console.log(`Server running on port ${cache.configs.developer.port}`)) });