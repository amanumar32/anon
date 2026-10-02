import fs from 'fs';
import app from './api/app.js';

let initialized = false;
const package_json = JSON.parse(fs.readFileSync('./package.json'));
const structures_json = JSON.parse(fs.readFileSync('./library/structures.json'));

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
        data: {
            sudo: [],
            banned: [],
            blacklist: [],
            backgrounds: [],
            groupSettings: {}
        },
        memberActivity: {},
        commandStats: {}
    },
    bot_name: package_json.name,
    author: package_json.author,
    homepage_url: package_json.homepage,
    bot_id: '',
    current_version: package_json.version,
    latest_version: '',
    port: process.env.PORT || 3000,
    process_count: 0,
    process_limit: 3,
    repo_url: package_json.repository.url.replace(/^git\+/, '').replace(/\.git$/, '') + '.git',
    last_owner_message: Date.now(),
    configs_path: './configs.json',
    database_path: './database',
    necessary_directories: ['./logs', './database'],
    command_list: Object.fromEntries(Object.entries(structures_json.command_list).map(([key, value]) => [key, { name: key, ...value }])),
    white_space: structures_json.white_space,
    morse_code_map: structures_json.morse_code_map,
    default_background_links: structures_json.default_background_links,
    last_recache_update: Date.now(),
    start_time: Date.now()
}

export async function recache(mode = 'update') {
    try {
        cache.necessary_directories.forEach(dir => fs.mkdirSync(dir, { recursive: true }));
        if (!fs.existsSync(cache.configs_path)) fs.writeFileSync(cache.configs_path, JSON.stringify(cache.configs, null, 4));

        if (mode === 'start') {
            if (initialized) return true;
            cache.configs = JSON.parse(fs.readFileSync(cache.configs_path)) || cache.configs;
            Object.keys(cache.database).forEach(key => {
                const file_path = `${cache.database_path}/${key}.json`;
                if (!fs.existsSync(file_path)) fs.writeFileSync(file_path, JSON.stringify(cache.database[key], null, 4));
                else cache.database[key] = JSON.parse(fs.readFileSync(file_path)) || cache.database[key];
            });
            const urlObj = new URL(cache.repo_url);
            fetch(`https://raw.githubusercontent.com/${urlObj.pathname.replace(/^\//, '').replace(/\.git$/, '')}/refs/heads/main/package.json`).then((response) => response.json().then(data => cache.latest_version = data?.version || cache.current_version)).catch(e => cache.latest_version = cache.current_version);
            if (!fs.existsSync('.env')) fs.writeFileSync('.env', fs.readFileSync('.env.example'));
            initialized = true;
            console.log('Database loaded successfully!');
            if (cache.configs.developer.api_enabled) app.listen(cache.port, () => console.log(`Server running on port ${cache.port}`));
        } else {
            fs.writeFileSync(cache.configs_path, JSON.stringify(cache.configs, null, 4));
            Object.keys(cache.database).forEach(key => fs.writeFileSync(`${cache.database_path}/${key}.json`, JSON.stringify(cache.database[key], null, 4)));
            cache.last_recache_update = Date.now();
        }
        return true;
    } catch (error) {
        console.error('Error in recache:', error);
        return false;
    }
}