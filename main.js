import { home } from "./commands/home.js";
import { cache, recache } from "./init.js";
import Send from "./library/send.js";
import { command_list } from "./library/structures.js";

class Main {
    constructor(sock) {
        this.sock = sock;
        this.send = new Send(sock);
        this.startTime = Date.now();
    }
    async init() {
        try {
            console.log('Bot connected successfully!');
            if (cache.configs.notifications) await this.send.text(cache.configs.id, `*✅ Bot Activated*\n\nTime: ${new Date().toLocaleString()}\n\n> You can turn this off with \`${cache.configs.prefix}notification off\``);
            setInterval(() => recache(null, 'update'), 5 * 60 * 1000);
        } catch (error) {
            console.error('Error starting bot:', error.message);
        }
    }
    async event(update) { }
    async message(messages, type) {
        try {
            const msg = messages[0];
            if (type !== "notify" || !msg.message) return;

            const from = msg.key.remoteJid;
            const userid = msg.key.participant || msg.key.remoteJid;
            const user_number = msg.key.participantAlt || msg.key.remoteJidAlt;
            const username = msg.pushName || "Unknown";
            const context = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';
            const command = context.toLowerCase();
            const quoted = msg.message?.extendedTextMessage?.contextInfo || null;
            const quoted_msg = quoted?.quotedMessage || null;
            const quoted_text = quoted_msg?.conversation || quoted_msg?.extendedTextMessage?.text || '';
            const quoted_jid = quoted?.participant || '';

            if (!command.startsWith(cache.configs.prefix) && !['ping', 'bot', 'uptime', 'stats', 'prefix'].includes(command)) return;
            const text = command.slice(1);

            const isPublic = cache.configs.mode === 'public';
            const isOwner = [cache.configs.id, cache.configs.number + '@s.whatsapp.net'].includes(userid);
            const isSudo = cache.configs.sudoOn && cache.configs.sudo.includes(userid);
            const willRespond = cache.configs.respond;

            if ([...cache.configs.blacklist, ...cache.configs.banned].some(id => from === id || userid === id) && !['whitelist', 'help'].includes(text)) return;
            if (!isPublic && !isOwner && !isSudo) return;

            console.log(`{ "context": "${context}", "from": "${from}", "id": "${userid}", "number": "${user_number}", "username": "${username}", "quoted": "${quoted_text}", "date": "${new Date().toLocaleString()}" }`);

            const commands = Object.values(command_list);

            if (commands.filter(i => i.category === 'owner').map(e => e.name).some(c => text.startsWith(c))) {
                if (!isOwner) return this.send.text(from, 'You seem to have stumbled upon an owner only command...', msg);
                //owner commands
            } else {
                if (text.startsWith('menu')) home.menu(this.send, text, msg, from);
            }

        } catch (error) {
            console.error('Error in message handler:', error.message);
        }
    }
}

export default Main;