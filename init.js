import fs from 'fs';

let initialized = false;
const pkg = JSON.parse(fs.readFileSync('./package.json'));

export const cache = {
    configs: {
        name: '',
        number: '',
        mode: 'private',
        respond: false,
        blacklist: [],
        banned: [],
        sudo: [],
        sudoOn: true,
        backgrounds: [],
        notifications: true,
        prefix: '.'
    },
    database: {
        groupSettings: {}
    },
    bot_name: pkg.name,
    author: pkg.author,
    homepage_url: pkg.homepage,
    bot_id: '',
    current_version: pkg.version,
    latest_version: '',
    repo_url: pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '') + '.git',
}

export async function recache(sock = null, mode = 'update') {
    try {
        const config_path = 'config.json';
        const database_path = './database/data.json';
        ['./logs', './database'].forEach(dir => fs.mkdirSync(dir, { recursive: true }));
        if (!fs.existsSync(config_path)) fs.writeFileSync(config_path, JSON.stringify(cache.configs, null, 4));
        if (!fs.existsSync(database_path)) fs.writeFileSync(database_path, JSON.stringify(cache.database, null, 4));

        if (mode === 'start') {
            if (initialized) return true;
            cache.configs = JSON.parse(fs.readFileSync(config_path)) || cache.configs;
            cache.database = JSON.parse(fs.readFileSync(database_path)) || cache.database;
            cache.bot_id = sock?.user?.id ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : (sock?.user?.lid ? sock?.user?.lid.split(':')[0] + '@lid' : '');
            const urlObj = new URL(cache.repo_url);
            fetch(`https://raw.githubusercontent.com/${urlObj.pathname.replace(/^\//, '').replace(/\.git$/, '')}/refs/heads/main/package.json`).then((data) => data.json().then(e => cache.latest_version = e?.version || cache.current_version)).catch(e => { console.warn('Failed to fetch committed version:', e.message); cache.latest_version = cache.latest_version });
            initialized = true;
            console.log('Database loaded successfully!');
            return true;
        } else {
            fs.writeFileSync(config_path, JSON.stringify(cache.configs, null, 4));
            fs.writeFileSync(database_path, JSON.stringify(cache.database, null, 4));
            console.log('Database updated successfully!');
            return true;
        }
    } catch (error) {
        console.error('Error in recache:', error);
        return false;
    }
}