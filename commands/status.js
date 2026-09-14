import { cache } from "../init.js";

class Stats {
    async ping(send, from, msg, _return = false) {
        const start = Date.now();
        const sent = await send.text(from, '', msg);
        const end = Date.now();
        const latency = end - start;
        if (_return) return { sent, latency };
        await send.edit(from, `> *Pong:* ${latency} ms`, sent.key);
    }
    async uptime(send, from, msg, startTime, _return = false) {
        const uptime = (ms => `${Math.floor(ms / 864e5)}d ${Math.floor(ms / 36e5) % 24}h ${Math.floor(ms / 6e4) % 60}m ${Math.floor(ms / 1e3) % 60}s`)(Date.now() - startTime);
        if (_return) return { uptime }
        await send.text(from, `> *Uptime:* ${uptime}`, msg);
    }
    async status(send, from, msg, startTime) {
        const ping = (await this.ping(send, from, msg, true));
        const uptime = (await this.uptime(send, from, msg, startTime, true)).uptime;
        const version = (await this.version(send, from, msg, true))

        const message = `> ■ *Status* ■\n\n- *Bot Name:* ${cache.bot_name}\n- *Bot Owner:* ${cache.configs.name}\n\n- *Version:* ${version.current}\n- *Uptime:* ${uptime}\n- *Ping:* ${ping.latency} ms\n- *Prefix:* ${cache.configs.prefix}\n\n- *Mode:* ${cache.configs.mode}\n- *Response:* ${cache.configs.respond}\n\n- *Sudo:* ${cache.configs.sudoOn}\n- *Date and Time:* ${new Date().toLocaleString()}\n${version.update ? `\n> *Update Available: ${version.latest}*. Send \`${cache.configs.prefix}update\` to update now.` : ''}`;
        await send.edit(from, message, ping.sent.key);
    }
    async version(send, from, msg, _return = false) {
        const current = cache.current_version;
        const latest = cache.latest_version || cache.current_version;
        const update = current !== latest;
        if (_return) return { current, latest, update };
        await send.text(from, `> *Version:* ${current}${update ? `\n\n*> *Update Available: ${latest}*. Send \`${cache.configs.prefix}update\` to update now.` : ''}`)
    }
    async alive(send, from, msg) {
        send.text(from, '*Bot is active!*', msg);
    }
}

export const _stats = new Stats();