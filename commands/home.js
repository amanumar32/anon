import { cache } from "../init.js";
import { sentence_case } from "../library/functions.js";
import { default_background_links, white_space } from "../library/structures.js";
import { command_list } from "../library/structures.js";

class Home {
    async menu(send, text, msg, from) {
        const param = text.split(' ')[1];
        const backgrounds = [...default_background_links, ...cache.database.backgrounds];
        const link = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        const categories = Object.values(command_list).reduce((acc, cmd) => {
            acc[cmd.category] = acc[cmd.category] || [];
            acc[cmd.category].push(cmd);
            return acc;
        }, {});
        let menu = `╭━━━ ■ *${cache.bot_name}* ■ ━━━\n┃ ◦ *Owner:* ${cache.configs.name}\n┃ ◦ *Version:* ${cache.current_version}\n┃ ◦ *Prefix:* ${cache.configs.prefix}\n╰━━━━━━━━━━━━━━━━━━━\n${white_space}\n`;
        const format = (category, list) => {
            const header = `┌── ► *${sentence_case(category)}* ◄\n│\n`;
            const footer = `\n│\n└───────────────\n`;
            const body = list.map(cmd => param === 'full' ? `│ ◦ *${cache.configs.prefix}${cmd.name}* - _${cmd.description}_` : `│  ◦ ${cache.configs.prefix}${cmd.name}`).join(param === 'full' ? '\n\n' : '\n');
            return header + body + footer;
        };
        if (categories[param]) {
            menu += format(param, categories[param]);
        } else {
            menu += Object.entries(categories).map(([category, list]) => format(category, list)).join('\n');
        }
        menu += `> *${cache.author}*\n`;
        try {
            send.image(from, { url: link }, menu, msg);
        } catch (error) {
            console.warn('Failed to send image, sending text only:', error.message);
            send.text(from, menu, msg);
        }
    }
    async support(send, msg, from) {
        send.text(from, `*${sentence_case(cache.author)}*\n\n*Homepage:* ${cache.homepage_url}\n*Repository:* ${cache.repo_url}`, msg);
    }
    async repo(send, from, msg) {
        send.text(from, `*Bot repository:* ${cache.repo_url}`, msg);
    }
    async owner(send, from, msg) {
        send.contact(from, { name: cache.configs.name || cache.bot_name, number: cache.configs.number }, msg);
    }
    async feedback(send, from, msg, text) {
        const message = text.replace('feedback', '');
        //feedback sending logic here
        send.text(from, 'Thank you for your feedback! We have received it and will respond soon...')
    }
    async donate(send, from, msg) {
        send.text(from, `*Support the developer with a cup of coffee : ) ...*\n\nThis project was developed and maintained by *Áà Män シ*, a solo developer and freelancer. If you appreciate this project, show some love by buying me a cup of coffee at ${cache.homepage_url}/donate\n\n> Thanks a bunch! 🙃`, msg);
    }
    async help(send, from, text, msg) {
        const param = text.split(' ')[1];
        let message = `Need help? Type \`${cache.configs.prefix}help <command>\` to learn about a command or \`${cache.configs.prefix}support\` to learn more about *${cache.author}*.`;
        if (command_list[param]) message = `*${sentence_case(command_list[param].name)}*\n\n*Usage:* \`${cache.configs.prefix}${command_list[param].name}${command_list[param].param ? ` ${command_list[param].param.map(i => `<${i}>`).join(' ')}` : ''}\`\n*Category:* ${command_list[param].category}\n*Description:* ${command_list[param].description}.\n${command_list[param].requirements ? `*Requirements:* ${command_list[param].requirements.map(i => i.replace('&', 'Quoted media').replace('@', 'Mentioned user')).join(', ')}` : ''}\n${command_list[param].note ? `\n> *Note:* ${command_list[param].note}.` : ''}`;
        send.text(from, message, msg);
    }
}

export const _home = new Home();