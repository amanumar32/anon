import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { cache } from '../init.js';

const exec_as = promisify(exec);

class Owner {
    async configs() { }
    async database() { }
    async prefix() { }
    async notifications() { }
    async mode() { }
    async respond() { }
    async sudo() { }
    async blacklist() { }
    async whitelist() { }
    async ban() { }
    async unban() { }
    async background() { }
    async update(send, from, msg) {
        try {
            await send.react(from, '🔄', msg.key);
            const sent = await send.text(from, 'Checking for updates...', msg);
            try {
                await exec_as('git --version');
            } catch (error) {
                await send.edit(from, 'Git is required to update automatically and is not installed on your machine. Your options are:\n\n- Install git from https://git-scm.com/install/ *(recommended)*\n- Download the updated zip from the repository and extract the files to your machine.', sent.key);
                return;
            }
            if (!fs.existsSync('.git')) {
                send.edit(from, 'No repository found. Initializing...', sent.key);
                return; //todo: remove after test
                await exec_as('git init');
                await exec_as(`git remote add origin ${cache.repo_url}`);
                await exec_as('git branch -M main');
                await exec_as('git fetch origin');
                await exec_as('git checkout -f origin/main || git checkout -f origin/master');
            }
            const { stdout } = await exec_as('git pull');
            if (stdout.includes('Already up to date')) return send.edit(from, '✅ You\'re already running on the latest version!', sent.key);
            send.edit(from, 'Checking dependencies...', sent.key);
            if (stdout.includes('package.json')) await exec_as('npm install');
            await send.edit(from, '✅ Update completed. The bot will now restart...\n\n> This will stop the process. If you don\'t have pm2 running, you may need to start the bot again manually.', sent.key);
            await exec_as('pm2 restart all').catch(e);
            setTimeout(() => process.exit(0), 500);
        } catch (error) {
            console.error('Error processing update:', error.message);
        }
    }
}

export const _owner = new Owner();