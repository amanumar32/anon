import { _home } from "./commands/home.js";
import { _owner } from "./commands/owner.js";
import { _stats } from "./commands/status.js";
import { _tools } from "./commands/tools.js";
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
            if (cache.configs.notifications) await this.send.text(cache.bot_id, `*✅ Bot Activated*\n\nTime: ${new Date().toLocaleString()}\n\n> You can turn this off with \`${cache.configs.prefix}notification off\``);
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

            if (!command.startsWith(cache.configs.prefix) && !['ping', 'bot', 'uptime', 'stats', 'status', 'prefix', 'version', 'alive'].includes(command)) return;
            const text = `${command.slice(1)}`.trim();

            const isPublic = cache.configs.mode === 'public';
            const isOwner = msg.key.fromMe || [cache.bot_id, cache.configs.number + '@s.whatsapp.net'].includes(userid);
            const isSudo = cache.configs.sudoOn && cache.database.sudo.includes(userid);
            const willRespond = cache.configs.respond;

            if (!isPublic && !isOwner && !isSudo) return;
            if ([...cache.database.blacklist, ...cache.database.banned].some(id => from === id || userid === id) && !['whitelist', 'support'].includes(text)) return;

            console.log(`{ "context": "${context}", "from": "${from}", "id": "${userid}", "number": "${user_number}", "username": "${username}", "quoted": "${quoted_text}", "date": "${new Date().toLocaleString()}" }`);

            const commands = Object.values(command_list);

            if (commands.filter(i => i.category === 'owner').map(e => e.name).some(c => text.startsWith(c))) {
                if (!isOwner) return this.send.text(from, 'You seem to have stumbled upon an owner only command...', msg);
                //Owner
                else if (text.startsWith('prefix')) _owner.prefix(this.send, from, msg, text);
                else if (text.startsWith('notification')) _owner.notifications(this.send, from, msg, text);
                else if (text.startsWith('mode')) _owner.mode(this.send, from, msg, text);
                else if (text.startsWith('respond')) _owner.respond(this.send, from, msg, text);
                else if (text.startsWith('sudo')) _owner.sudo(this.send, from, text, msg);
                else if (text.startsWith('blacklist')) return;
                else if (text.startsWith('whitelist')) return;
                else if (text.startsWith('ban')) return;
                else if (text.startsWith('database')) _owner.database(this.send, from, msg);
                else if (text.startsWith('configs')) _owner.configs(this.send, from, msg);
                else if (text.startsWith('unban')) return;
                else if (text.startsWith('background')) return;
                else if (text.startsWith('update')) _owner.update(this.send, from, msg);

            } else {
                //Home
                if (text.startsWith('menu')) _home.menu(this.send, text, msg, from);
                else if (text.startsWith('support')) _home.support(this.send, msg, from);
                else if (text.startsWith('repo')) _home.repo(this.send, from, msg);
                else if (text.startsWith('owner')) _home.owner(this.send, from, msg);
                else if (text.startsWith('feedback')) _home.feedback(this.send, from, msg, text);
                else if (text.startsWith('donate')) _home.donate(this.send, from, msg);
                else if (text.startsWith('help')) _home.help(this.send, from, text, msg);

                //Status
                else if ([text, command].includes('ping')) _stats.ping(this.send, from, msg);
                else if ([text, command].includes('uptime')) _stats.uptime(this.send, from, msg, this.startTime);
                else if ([text, command].some(r => ['status', 'stats'].includes(r))) _stats.status(this.send, from, msg, this.startTime);
                else if ([text, command].includes('version')) _stats.version(this.send, from, msg);
                else if ([text, command].some(r => ['bot', 'alive'].includes(r))) _stats.alive(this.send, from, msg);

                //Tools
                else if (text.startsWith('calc')) _tools.calc(this.send, from, text, msg);
                else if (text.startsWith('hash')) _tools.hash(this.send, from, context, msg, quoted_text);
                else if (text.startsWith('qr')) _tools.qr(this.send, from, context, msg, quoted_text);
                else if (text.startsWith('morse')) _tools.morse(this.send, context, msg, from, quoted_text);
                else if (text.startsWith('pick')) _tools.pick(this.send, from, text, msg);
                else if (text.startsWith('coin')) _tools.coin(this.send, from, msg);
                else if (text.startsWith('dice')) _tools.dice(this.send, from, msg);

                //Fun
                else if (text.startsWith('joke')) return;
                else if (text.startsWith('fact')) return;
                else if (text.startsWith('quote')) return;
                else if (text.startsWith('td')) return;
                else if (text.startsWith('wyr')) return;
                else if (text.startsWith('nhie')) return;
                else if (text.startsWith('chess')) return;
                else if (text.startsWith('wordlink')) return;

                //Media
                else if (text.startsWith('vv')) return;
                else if (['tostic', 'stic'].some(r => text.startsWith(r))) return;
                else if (text.startsWith('toimg')) return;
                else if (text.startsWith('tovid')) return;
                else if (['pack', 'take'].some(r => text.startsWith(r))) return;
                else if (['song', 'play', 'music'].some(r => text.startsWith(r))) return;
                else if (['vid', 'video'].some(r => text.startsWith(r))) return;
                else if (['img', 'image'].some(r => text.startsWith(r))) return;
                else if (['download', 'dl'].some(r => text.startsWith(r))) return;
                else if (['upload', 'ul'].some(r => text.startsWith(r))) return;
                else if (text.startsWith('emix')) return;

            }

        } catch (error) {
            console.error('Error in message handler:', error.message);
        }
    }
}

export default Main;