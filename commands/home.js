import { cache } from "../init.js";
import { sentence_case } from "../library/functions.js";
import { default_background_links, white_space } from "../library/structures.js";
import { command_list } from "../library/structures.js";

class Home {
    async menu(send, text, msg, from) {
        const param = text.split(' ')[1];
        const backgrounds = [...default_background_links, ...cache.configs.backgrounds];
        const link = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        const categories = Object.values(command_list).reduce((acc, cmd) => {
            acc[cmd.category] = acc[cmd.category] || [];
            acc[cmd.category].push(cmd);
            return acc;
        }, {});
        let menu = `╭━━━ ■ *${cache.configs.bot}* ■ ━━━\n┃ ◦ *Owner:* ${cache.configs.name}\n┃ ◦ *Version:* ${cache.configs.version}\n┃ ◦ *Prefix:* ${cache.configs.prefix}\n╰━━━━━━━━━━━━━━━━━━━\n${white_space}\n`;
        const format = (category, list) => {
            const header = `┌── ► *${sentence_case(category)}* ◄\n│\n`;
            const footer = `\n│\n└───────────────\n\n`;
            const body = list.map(cmd => param === 'full' ? `│ ◦ /*${cmd.name}* - _${cmd.description}_` : `│  ◦ /${cmd.name}`).join(param === 'full' ? '\n\n' : '\n');
            return header + body + footer;
        };
        if (categories[param]) {
            menu += format(param, categories[param]);
        } else {
            menu += Object.entries(categories).map(([category, list]) => format(category, list)).join('\n');
        }
        menu += `> *${cache.repo.name}*\n`;
        try {
            send.image(from, { url: link }, menu, msg);
        } catch (error) {
            console.warn('Failed to send image, sending text only:', error.message);
            send.text(from, menu, msg);
        }
    }
    async support(send, msg, from) { }
    async repo() { }
    async owner() { }
    async feedback() { }
    async donate() { }
    async help() { }
}

export const home = new Home();