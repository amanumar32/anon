import { cache } from "../init.js";
import { _functions } from "../library/functions.js";

class Home {
    async menu(send, text, msg, from) {
        const param = text.split(' ')[1];
        const backgrounds = [...cache.default_background_links, ...cache.database.backgrounds];
        const link = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        const categories = Object.values(cache.command_list).reduce((acc, cmd) => {
            acc[cmd.category] = acc[cmd.category] || [];
            acc[cmd.category].push(cmd);
            return acc;
        }, {});
        let menu = `╭━━━ ■ *${cache.bot_name}* ■ ━━━\n┃ ◦ *Owner:* ${cache.configs.name}\n┃ ◦ *Version:* ${cache.current_version}\n┃ ◦ *Prefix:* ${cache.configs.prefix}\n╰━━━━━━━━━━━━━━━━━━━\n${cache.white_space}\n`;
        const format = (category, list) => `┌── ► *${_functions.sentence_case(category)}* ◄\n│\n` + list.map(cmd => `│ ◦  ${cache.configs.prefix}${cmd.name}`).join('\n') + `\n│\n└───────────────\n`;
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
        send.text(from, `*${_functions.sentence_case(cache.author)}*\n\n*Homepage:* ${cache.homepage_url}\n*Repository:* ${cache.repo_url}`, msg);
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
        if (cache.command_list[param]) message = `*${_functions.sentence_case(cache.command_list[param].name)}*\n\n*Usage:* \`${cache.configs.prefix}${cache.command_list[param].name}${cache.command_list[param].param ? ` ${cache.command_list[param].param.map(i => `<${i}>`).join(' ')}` : ''}\`\n*Category:* ${cache.command_list[param].category}\n*Description:* ${cache.command_list[param].description}.\n${cache.command_list[param].requirements ? `*Requirements:* ${cache.command_list[param].requirements.map(i => i.replace('&', 'Quoted media').replace('@', 'Mentioned user')).join(', ')}` : ''}\n${cache.command_list[param].note ? `\n> *Note:* ${cache.command_list[param].note}.` : ''}`;
        send.text(from, message, msg);
    }
}

export const _home = new Home();