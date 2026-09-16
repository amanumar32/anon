import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { cache, recache } from '../init.js';
import { _media } from './media.js';

const exec_as = promisify(exec);

class Owner {
    async configs(send, from, msg) {
        const data = cache.configs;
        send.text(from, `> ■ *Configs* ■\n\n- *Name:* ${data.name}\n- *Number:* ${data.number}\n- *Mode:* ${data.mode}\n- *Auto-respond:* ${data.respond}\n- *Sudo allowed:* ${data.sudoOn}\n- *Notifications:* ${data.notifications}\n- *Prefix:* ${data.prefix}\n`, msg);
    }
    async database(send, from, msg) {
        const data = cache.database;
        send.text(from, `> ■ *Database* ■\n\n- *Banned:* ${data.banned.length} users\n- *Blacklist:* ${data.blacklist.length} groups\n- *Sudo:* ${data.sudo.length} users\n- *Backgrounds:* ${data.backgrounds.length} items\n- *Group settings:* ${Object.keys(data.groupSettings).length} groups\n`, msg);
    }
    async prefix(send, from, msg, text) {
        const param = text.replace('prefix', '').trim();
        let message;
        if (!param) message = `> *Prefix:* ${cache.configs.prefix}`;
        else if (param.match(/^[^\p{L}\p{N}\s]+$/u) && param.length === 1) {
            cache.configs.prefix = param;
            message = `> *Prefix updated:* ${cache.configs.prefix}`;
        } else message = 'This prefix is invalid! Please use a different prefix.';
        recache();
        send.text(from, message, msg);
    }
    async notifications(send, from, msg, text) {
        const param = text.replace(/notifications?/i, '').trim();
        let message;
        if (!['on', 'off'].includes(param)) message = `*Usage:* \`${cache.configs.prefix}notification on/off\``;
        else {
            cache.configs.notifications = param === 'on';
            message = `🔔 Notifications turned *${param}*`;
        }
        recache();
        send.text(from, message, msg);
    }
    async mode(send, from, msg, text) {
        const param = text.replace(/mode/i, '').trim();
        let message;
        if (!['public', 'private'].includes(param)) message = `*Usage:* \`${cache.configs.prefix}mode public/private\``;
        else {
            cache.configs.mode = param;
            message = `🌍 Mode set to *${param}*`;
            if (param === 'public') message += '\n\n> All users can use the bot anywhere';
        }
        recache();
        send.text(from, message, msg);
    }
    async respond(send, from, msg, text, context) {
        const param = text.split(' ')[1]?.trim();
        let message;
        if (['on', 'off'].includes(param)) {
            cache.configs.respond = param === 'on';
            message = `🤖 Auto-respond turned *${param}*`;
            if (!process.env.GEMINI_AI_API_KEY && cache.configs.respond) message += `\n\n> Auto-responses may not function properly as \`GEMINI_AI_API_KEY\` has not been provided in \`.env\`.`;
        } else if (param === 'set') {
            const new_message = context?.slice(1)?.replace(/respond set\s+/i, '')?.trim();
            if (new_message) {
                cache.configs.static_message = new_message;
                message = 'Custom message set successfully.'
            } else message = 'Please provide a custom message to set.'
        } else message = `*Usage:* \`${cache.configs.prefix}respond on/off/set\``;
        recache();
        send.text(from, message, msg);
    }
    async sudo(send, from, text, msg) {
        const param = text.split(' ')[1];
        const target = msg.message?.extendedTextMessage?.contextInfo?.participant || msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
        let message;
        let mentions = [];
        if (['on', 'off'].includes(param)) {
            cache.configs.sudoOn = param === 'on';
            message = `*Sudo mode turned ${param}*`;
            if (param === 'on') message += '\n\n> Sudo users can now use the bot anywhere, even in private mode.'
        } else if (['add', 'remove'].includes(param)) {
            if (target) {
                mentions.push(target);
                const includes = cache.database.sudo.includes(target);
                const add = param === 'add';
                if ((add && includes) || (!add && !includes)) message = `@${target.split('@')[0]} *is ${add ? 'already' : 'not'} a sudo user*`;
                else {
                    cache.database.sudo = add ? [...cache.database.sudo, target] : cache.database.sudo.filter(i => i !== target);
                    message = `@${target.split('@')[0]} *has been ${add ? 'added' : 'removed'} as a sudo user*`;
                }
            } else message = `*Please mention a user to ${param} as a sudo*`;
        } else if (param === 'list') {
            mentions = [...mentions, ...cache.database.sudo];
            message = `> ■ *Sudo users* ■\n\n${cache.database.sudo?.map(i => `- @${i.split('@')[0]}`).join('\n') || '_none_'}`;
        } else message = `*Usage:* \`${cache.configs.prefix}sudo on/off/add/remove/list\``;
        recache();
        send.text(from, message, msg, mentions || null);
    }
    async blacklist(send, from, msg, context, text) {
        const mode = text.startsWith('blacklist') ? 'blacklist' : 'whitelist';
        const target = context.split(' ')[1]?.trim() || from;
        let message;
        if (target) {
            const includes = cache.database.blacklist.includes(target);
            const add = mode === 'blacklist';
            if ((add && includes) || (!add && !includes)) message = `This group is ${add ? 'already' : 'not'} blacklisted`;
            else {
                cache.database.blacklist = add ? [...cache.database.blacklist, target] : cache.database.blacklist.filter(i => i !== target);
                message = `*Group has been ${mode}ed*`;
            }
        } else message = `*Please provide a group to ${mode}*`;
        recache();
        send.text(from, message, msg);
    }
    async ban(send, from, msg, text, isOwner) {
        const mode = text.startsWith('ban') ? 'ban' : 'unban';
        const target = msg.message?.extendedTextMessage?.contextInfo?.participant || msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
        let message;
        let mentions = [];
        if (target) {
            if (isOwner) message = 'Cannot ban bot owner!';
            else {
                mentions.push(target);
                const includes = cache.database.banned.includes(target);
                const add = mode === 'ban';
                if ((add && includes) || (!add && !includes)) message = `@${target.split('@')[0]} *is ${add ? 'already' : 'not'} banned*`;
                else {
                    cache.database.banned = add ? [...cache.database.banned, target] : cache.database.banned.filter(i => i !== target);
                    message = `@${target.split('@')[0]} *has been ${mode}ned*`;
                }
            }
        } else message = `*Please mention a user to ${mode}*`;
        recache();
        send.text(from, message, msg, mentions || null);
    }
    async background(send, from, msg, text, context, quotedMsg) {
        try {
            const param = text.split(' ')[1]?.trim();
            let message;
            if (param === 'add') {
                send.react(from, '🔄', msg.key);
                const url = (await _media.upload(send, from, msg, quotedMsg, true)).url;
                if (!url) throw new Error('Failed to upload image, please try again later.');
                if (cache.database.backgrounds.includes(url)) throw new Error('This image is already included in your backgrounds.');
                cache.database.backgrounds.push(url);
                message = `Added image to your backgrounds. Type ${cache.configs.prefix}menu to check it out!`;
            } else if (param === 'remove') {
                const url = context.split(' ')[2]?.trim();
                if (!cache.database.backgrounds.includes(url)) throw new Error('This image is not in your background database.');
                cache.database.backgrounds = cache.database.backgrounds.filter(i => i !== url);
                message = 'Removed background successfully!';
            }
            recache();
            send.text(from, message, msg);
        } catch (error) {
            console.error('Failed to add background:', error.message);
            send.text(from, error.message, msg);
        }
    }
    async update(send, from, msg, text, _return = false) {
        const will_restart = text.replace('update', '')?.trim() === 'restart';
        let sent;
        try {
            if (!_return) await send.react(from, '🔄', msg.key);
            sent = _return ? null : await send.text(from, 'Checking for updates...', msg);
            await exec_as('git --version').catch(() => { throw new Error('Git is required to update automatically and is not installed on your machine. Your options are:\n\n- Install git from https://git-scm.com/install/ *(recommended)*\n- Download the updated zip from the repository and extract the files to your machine.') });
            if (!fs.existsSync('.git')) {
                if (!_return) await send.edit(from, 'No repository found. Initializing...', sent.key);
                await exec_as('git init');
                await exec_as(`git remote add origin ${cache.repo_url}`);
                await exec_as('git add .').catch(() => { });
                await exec_as('git commit -m "initial local backup"').catch(() => { });
                await exec_as('git branch -M main');
                await exec_as('git fetch origin');
                await exec_as('git reset --hard origin/main').catch(async () => await exec_as('git checkout -b main origin/main || git checkout -b master origin/master'));
            } else {
                await exec_as('git fetch origin');
                await exec_as('git stash -u').catch(() => { });
                await exec_as('git checkout main 2>/dev/null || git checkout master 2>/dev/null || git checkout -b main origin/main || git checkout -b master origin/master').catch(async () => await exec_as('git reset --hard origin/main').catch(() => { }));
            }
            const branch_res = await exec_as('git rev-parse --abbrev-ref HEAD').catch(() => ({ stdout: 'main' }));
            const current_branch = branch_res.stdout.trim() || 'main';
            const { stdout } = await exec_as(`git pull origin ${current_branch}`);
            if (cache.edited_source_code) await exec_as('git stash pop').catch(() => { });
            if (stdout.includes('Already up to date')) return _return ? true : send.edit(from, '✅ You\'re already running on the latest version!', sent.key);
            if (!_return) await send.edit(from, 'Checking dependencies...', sent.key);
            if (stdout.includes('package.json') || _return) await exec_as('npm install').catch(() => { });
            await recache();
            if (!_return) await send.edit(from, `✅ Update completed. ${will_restart ? 'The bot will now restart...' : `You can restart the bot with \`${cache.configs.prefix}restart\` to load changes.`}`, sent.key);
            if (will_restart && !_return) this.restart(send, from, msg, true);
        } catch (error) {
            console.error('Error processing update:', error.message);
            if (_return) throw error;
            send.edit(from, error.message, sent.key);
        }
    }
    async restart(send, from, msg, _return = false) {
        if (!_return) send.text(from, '*Restarting...*\n\n> You may need to start the server manually.', msg);
        await exec_as('pm2 restart all').catch(() => { });
        setTimeout(() => process.exit(0), 500);
    }
    async reset(send, from, text, msg) {
        try {
            const param = text.replace('reset', '')?.trim();
            if (param === 'true') {
                await send.react(from, '🔄', msg.key);
                cache.edited_source_code = false;
                await this.update(send, from, msg, text, true);
                const backup = (await this.backup(send, from, msg, true)).url;
                if (backup) [cache.config_path, cache.database_path].forEach(e => fs.rmSync(e, { force: true }));
                await send.text(from, `☑️ Reset to default settings.\n*Backup:* ${backup || '_Failed: Your files were not deleted._'}\n\nRestarting...\n> You may need to start the server manually.`, msg);
                this.restart(send, from, msg, true);
            } else send.text(from, `This will reset the bot to it's default state. All changes and modifications to the code will be discarded. Your configs and databases will be backed up.\nSend \`${cache.configs.prefix}reset true\` to proceed.`, msg);
        } catch (error) {
            console.log('Error resetting bot:', error.message);
            send.text(from, error.message, msg);
        }
    }
    async backup(send, from, msg, _return = false) {
        return { url: '' }
    }
    async env(send, from, msg, text) { }
    async prompt(send, from, msg, context) { }
}

export const _owner = new Owner();