import Send from "./library/send.js";
import { cache, recache } from "./init.js";
import { _casual } from "./commands/casual.js";
import { _home } from "./commands/home.js";
import { _media } from "./commands/media.js";
import { _owner } from "./commands/owner.js";
import { _services } from "./commands/services.js";
import { _stats } from "./commands/status.js";
import { _tools } from "./commands/tools.js";

class Main {
    constructor(sock) {
        this.sock = sock;
        this.send = new Send(sock);
    }
    async init() {
        try {
            cache.bot_id = this.sock.user?.lid ? this.sock.user.lid.split(':')[0] + '@lid' : cache.configs.number + '@s.whatsapp.net';
            cache.start_time = Date.now();
            if (cache.configs.notifications) this.send.text(cache.configs.developer.logs_redirect_id || cache.bot_id, `*✅ Bot Activated*\n\nTime: ${new Date(cache.start_time).toLocaleString()}${Math.random() < 0.3 ? `\n\n> You can turn this off with \`${cache.configs.prefix}notification off\`` : ''}`);
            console.log('Bot connected successfully!');
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
            const text = `${command.slice(1)}`.trim();
            const quoted = msg.message?.extendedTextMessage?.contextInfo || null;
            const quoted_msg = quoted?.quotedMessage || null;
            const quoted_text = quoted_msg?.conversation || quoted_msg?.extendedTextMessage?.text || '';
            const quoted_jid = quoted?.participant || '';

            const isPublic = cache.configs.mode === 'public';
            const isOwner = !!msg.key.fromMe || [cache.bot_id, cache.configs.number + '@s.whatsapp.net'].includes(userid);
            const isSudo = cache.configs.sudoOn && cache.database.data.sudo.includes(userid);
            const willRespond = cache.configs.respond;

            if (!isPublic && !isOwner && !isSudo) return;
            if ([...cache.database.data.blacklist, ...cache.database.data.banned].some(id => [from, user_number, userid].includes(id)) && !['whitelist'].includes(text)) return;

            const command_list = Object.values(cache.structures.command_list);

            if (command.startsWith(cache.configs.prefix) || ['ping', 'bot', 'uptime', 'stats', 'prefix'].includes(command)) {
                if (command_list.filter(i => i.category === 'owner').map(e => e.name).some(c => [text, command].some(g => g.startsWith(c)))) {
                    if (!isOwner && command !== 'prefix') return this.send.text(from, 'You seem to have stumbled upon an owner only command...', msg);
                    //Owner
                    if (text.startsWith('configs')) _owner.configs(this.send, from, msg);
                    else if (text.startsWith('database')) _owner.database(this.send, from, msg);
                    else if ([text, command].some(r => r.startsWith('prefix'))) _owner.prefix(this.send, from, msg, text);
                    else if (text.startsWith('notification')) _owner.notifications(this.send, from, msg, text);
                    else if (text.startsWith('mode')) _owner.mode(this.send, from, msg, text);
                    else if (text.startsWith('respond')) _owner.respond(this.send, from, msg, text, context);
                    else if (text.startsWith('sudo')) _owner.sudo(this.send, from, text, msg);
                    else if (['blacklist', 'whitelist'].some(e => text.startsWith(e))) _owner.blacklist(this.send, from, msg, context, text);
                    else if (['ban', 'unban'].some(e => text.startsWith(e))) _owner.ban(this.send, from, msg, text, isOwner);
                    else if (text.startsWith('update')) _owner.update(this.send, from, msg, text);
                    else if (text.startsWith('restart')) _owner.restart(this.send, from, msg);
                    else if (text.startsWith('reset')) _owner.reset(this.send, from, text, msg);
                    else if (text.startsWith('backup')) _owner.backup(this.send, from, msg);
                    else if (text.startsWith('prompt')) _owner.prompt(this.send, from, msg, context);
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
                    else if ([text, command].includes('uptime')) _stats.uptime(this.send, from, msg);
                    else if ([text, command].some(r => ['status', 'stats'].includes(r))) _stats.status(this.send, from, msg);
                    else if ([text, command].includes('version')) _stats.version(this.send, from, msg);
                    else if ([text, command].some(r => ['bot'].includes(r))) _stats.alive(this.send, from, msg);

                    //Tools
                    else if (text.startsWith('calc')) _tools.calc(this.send, from, text, msg);
                    else if (text.startsWith('hash')) _tools.hash(this.send, from, context, msg, quoted_text);
                    else if (text.startsWith('qr')) _tools.qr(this.send, from, context, msg, quoted_text);
                    else if (text.startsWith('morse')) _tools.morse(this.send, context, msg, from, quoted_text);
                    else if (text.startsWith('pick')) _tools.pick(this.send, from, text, msg);
                    else if (text.startsWith('coin')) _tools.coin(this.send, from, msg);
                    else if (text.startsWith('dice')) _tools.dice(this.send, from, msg);

                    //Casual
                    else if (['joke', 'fact', 'quote'].some(r => text.startsWith(r))) _casual.misc(this.send, from, text, msg);
                    else if (['td', 'wyr', 'nhie'].some(r => text.startsWith(r))) _casual.rounds(this.send, text, from, msg);
                    else if (text.startsWith('chess')) _casual.chess(this.send, text, from, msg, userid);
                    else if (text.startsWith('wordlink')) _casual.wordlink(this.send, text, from, msg, userid);
                    else if (text.startsWith('ttt')) _casual.ttt(this.send, text, from, msg, userid);
                    else if (text.startsWith('hangman')) _casual.hangman(this.send, text, from, msg, userid);

                    //Services
                    else if (text.startsWith('weather')) _services.weather(this.send, text, from, msg);
                    else if (text.startsWith('news')) _services.news(this.send, text, from, msg);
                    else if (text.startsWith('tts')) _services.tts(this.send, from, msg, context, quoted_text);
                    else if (text.startsWith('stt')) _services.stt(this.send, from, msg);
                    else if (text.startsWith('lyric')) _services.lyrics(this.send, from, text, msg);
                    else if (['tr', 'translate'].some(r => text.startsWith(r))) _services.translate(this.send, text, from, msg, quoted_text);
                    else if (text.startsWith('ai')) _services.ai(this.send, msg, from, context, quoted_text, username);

                    //Media
                    else if (text.startsWith('vv')) _media.vv(this.send, msg, quoted_msg, from);
                    else if (['tostic', 'stic'].some(r => text.startsWith(r))) _media.tostic(this.send, text, from, msg, quoted_msg);
                    else if (text.startsWith('toimg')) _media.toimg(this.send, text, from, msg, quoted_msg);
                    else if (text.startsWith('tovid')) _media.tovid(this.send, text, from, msg, quoted_msg);
                    else if (['pack', 'take', 'siphon'].some(r => text.startsWith(r))) _media.pack(this.send, context, from, msg, quoted_msg, username);
                    else if (text.startsWith('music')) _media.music(this.send, text, from, msg);
                    else if (['song', 'play'].some(r => text.startsWith(r))) _media.song(this.send, text, from, msg);
                    else if (['vid', 'video'].some(r => text.startsWith(r))) _media.vid(this.send, text, from, msg);
                    else if (['img', 'image', 'pins'].some(r => text.startsWith(r))) _media.img(this.send, from, text, msg);
                    else if (text.startsWith('movie')) _media.movie(this.send, from, text, msg);
                    else if (['download', 'dl'].some(r => text.startsWith(r))) _media.download(this.send, context, from, msg);
                    else if (['upload', 'ul'].some(r => text.startsWith(r))) _media.upload(this.send, from, msg, quoted_msg);
                    else if (text.startsWith('emix')) _media.emix(this.send, from, text, msg);
                }
            } else {
                if (_casual.sessions.chess.has(from) && _casual.sessions.chess.get(from).status === 'active') _casual.chess(this.send, text, from, msg, userid);
                else if (_casual.sessions.wordlink.has(from) && _casual.sessions.wordlink.get(from).status === 'active') _casual.wordlink(this.send, text, from, msg, userid);
                else if (_casual.sessions.ttt.has(from) && _casual.sessions.ttt.get(from).status === 'active') _casual.ttt(this.send, text, from, msg, userid);
                else if (_casual.sessions.hangman.has(from) && _casual.sessions.hangman.get(from).status === 'active') _casual.hangman(this.send, text, from, msg, userid);
                else if (willRespond && Date.now() > (cache.last_owner_message + (1000 * 60 * 60 * cache.configs.developer.hour_delay_for_response))) return; //TODO: Add auto responses for when the owner has been offline for 2hs+ and responses are on.
            }

            if (isOwner) {
                cache.last_owner_message = Date.now();
                if (!cache.configs.name) cache.configs.name = username;
            }

            if (command.startsWith(cache.configs.prefix)) {
                console.log(`{ "context": "${context}", "from": "${from}", "id": "${userid}", "number": "${user_number}", "username": "${username}", "quoted": "${quoted_text}", "date": "${new Date().toLocaleString()}" }`);
                const command_used = Object.keys(cache.structures.command_list).find(p => text.startsWith(p));
                if (command_used) cache.database.commandStats[command_used] = (cache.database.commandStats[command_used] ?? 0) + 1;
            }
            (cache.database.memberActivity[from] ??= {})[userid] = ((cache.database.memberActivity[from][userid] ?? 0) + 1);
            recache();
        } catch (error) {
            console.error('Error in message handler:', error.message);
        }
    }
}

export default Main;