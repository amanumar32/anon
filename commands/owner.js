import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { cache, recache } from '../init.js';

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
        const param = text.replace('prefix', '').trim() + '';
        let message;
        if (!param) message = `> *Prefix:* ${cache.configs.prefix}`;
        else if (param.match()) { //match non-letter and numbers
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
    async respond(send, from, msg, text) {
        const param = text.replace(/respond/i, '').trim();
        let message;
        if (!['on', 'off'].includes(param)) message = `*Usage:* \`${cache.configs.prefix}respond on/off\``;
        else {
            cache.configs.respond = param === 'on';
            message = `🤖 Auto-respond turned *${param}*`;
            if (!process.env.GEMINI_AI_API_KEY && cache.configs.respond) message += `\n\n> Auto-responses may not function properly as \`GEMINI_AI_API_KEY\` has not been provided in \`.env\`. You can:\n> - Use \`${cache.configs.prefix}env GEMINI_AI_API_KEY <your-api-key>\` to add one automatically\n> - Define a static message you want to use with \`${cache.configs.prefix}setresponse <your-static-message>\`\n> - Add it to \`.env\` manually`;
        }
        recache();
        send.text(from, message, msg);
    }
    async sudo() { }
    async blacklist() { }
    async whitelist() { }
    async ban() { }
    async unban() { }
    async background() { }
    async update(send, from, msg) {
        let sent;
        try {
            await send.react(from, '🔄', msg.key);
            sent = await send.text(from, 'Checking for updates...', msg);
            await exec_as('git --version').catch(() => { throw new Error('Git is required to update automatically and is not installed on your machine. Your options are:\n\n- Install git from https://git-scm.com/install/ *(recommended)*\n- Download the updated zip from the repository and extract the files to your machine.') });
            if (!fs.existsSync('.git')) {
                await send.edit(from, 'No repository found. Initializing...', sent.key);
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
            if (stdout.includes('Already up to date')) return send.edit(from, '✅ You\'re already running on the latest version!', sent.key);
            await send.edit(from, 'Checking dependencies...', sent.key);
            if (stdout.includes('package.json')) await exec_as('npm install');
            await recache();
            await send.edit(from, '✅ Update completed. The bot will now restart...\n\n> This will stop the process. If you don\'t have pm2 running, you may need to start the bot again manually.', sent.key);
            await exec_as('pm2 restart all').catch(() => { });
            setTimeout(() => process.exit(0), 500);
        } catch (error) {
            console.error('Error processing update:', error.message);
            await send.edit(from, error.message, sent.key);
        }
    }
}

export const _owner = new Owner();