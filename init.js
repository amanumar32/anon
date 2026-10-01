import fs from 'fs';
import app from './api/app.js';

let initialized = false;
const pack = JSON.parse(fs.readFileSync('./package.json'));
const structures = JSON.parse(fs.readFileSync('./library/structures.json'));

export const cache = {
    configs: {
        name: '',
        number: '',
        mode: 'private',
        respond: false,
        sudoOn: true,
        notifications: true,
        prefix: '.',
        static_message: 'Hey <user>! I\'ll respond to you once I\'m online.\n\n> This is an automated message.',
        prompt: 'You are a helpful Assistant.',
        developer: {
            api_enabled: false,
            edited_source_code: false,
            logs_redirect_id: ''
        }
    },
    database: {
        sudo: [],
        banned: [],
        blacklist: [],
        backgrounds: [],
        groupSettings: {},
    },
    bot_name: pack.name,
    author: pack.author,
    homepage_url: pack.homepage,
    bot_id: '',
    current_version: pack.version,
    latest_version: '',
    port: process.env.PORT || 3000,
    process_working: false,
    repo_url: pack.repository.url.replace(/^git\+/, '').replace(/\.git$/, '') + '.git',
    last_owner_message: Date.now(),
    config_path: 'configs.json',
    database_path: './database/data.json',
    necessary_directories: ['./logs', './database'],
    command_list: Object.fromEntries(Object.entries(structures.command_list).map(([key, value]) => [key, { name: key, ...value }])),
    white_space: structures.white_space,
    morse_code_map: structures.morse_code_map,
    default_background_links: structures.default_background_links,
    last_recache_update: Date.now(),
    start_time: Date.now()
}

export async function recache(mode = 'update') {
    try {
        const { config_path, database_path } = cache;
        cache.necessary_directories.forEach(dir => fs.mkdirSync(dir, { recursive: true }));
        if (!fs.existsSync(config_path)) fs.writeFileSync(config_path, JSON.stringify(cache.configs, null, 4));
        if (!fs.existsSync(database_path)) fs.writeFileSync(database_path, JSON.stringify(cache.database, null, 4));

        if (mode === 'start') {
            if (initialized) return true;
            cache.configs = JSON.parse(fs.readFileSync(config_path)) || cache.configs;
            cache.database = JSON.parse(fs.readFileSync(database_path)) || cache.database;
            const urlObj = new URL(cache.repo_url);
            fetch(`https://raw.githubusercontent.com/${urlObj.pathname.replace(/^\//, '').replace(/\.git$/, '')}/refs/heads/main/package.json`).then((response) => response.json().then(data => cache.latest_version = data?.version || cache.current_version)).catch(e => cache.latest_version = cache.current_version);
            if (!fs.existsSync('.env')) fs.writeFileSync('.env', fs.readFileSync('.env.example'));
            initialized = true;
            console.log('Database loaded successfully!');
            if (cache.configs.developer.api_enabled) app.listen(cache.port, () => console.log(`Server running on port ${cache.port}`));
        } else {
            fs.writeFileSync(config_path, JSON.stringify(cache.configs, null, 4));
            fs.writeFileSync(database_path, JSON.stringify(cache.database, null, 4));
            cache.last_recache_update = Date.now();
        }
        return true;
    } catch (error) {
        console.error('Error in recache:', error);
        return false;
    }
}