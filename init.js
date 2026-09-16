import fs from 'fs';

let initialized = false;
const pkg = JSON.parse(fs.readFileSync('./package.json'));
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
        prompt: ''
    },
    database: {
        sudo: [],
        banned: [],
        blacklist: [],
        backgrounds: [],
        groupSettings: {},
    },
    bot_name: pkg.name,
    author: pkg.author,
    homepage_url: pkg.homepage,
    bot_id: '',
    current_version: pkg.version,
    latest_version: '',
    repo_url: pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '') + '.git',
    edited_source_code: false,
    last_owner_message: Date.now(),
    config_path: 'config.json',
    database_path: './database/data.json',
    necessary_directories: ['./logs', './database'],
    command_list: Object.fromEntries(Object.entries(structures.command_list).map(([key, value]) => [key, { name: key, ...value }])),
    white_space: structures.white_space,
    morse_code_map: structures.morse_code_map,
    default_background_links: structures.default_background_links,
}

export async function recache(sock = null, mode = 'update') {
    try {
        const { config_path, database_path } = cache;
        cache.necessary_directories.forEach(dir => fs.mkdirSync(dir, { recursive: true }));
        if (!fs.existsSync(config_path)) fs.writeFileSync(config_path, JSON.stringify(cache.configs, null, 4));
        if (!fs.existsSync(database_path)) fs.writeFileSync(database_path, JSON.stringify(cache.database, null, 4));

        if (mode === 'start') {
            if (initialized) return true;
            cache.configs = JSON.parse(fs.readFileSync(config_path)) || cache.configs;
            cache.database = JSON.parse(fs.readFileSync(database_path)) || cache.database;
            cache.bot_id = sock?.user?.lid ? sock.user.lid.split(':')[0] + '@lid' : cache.configs.number + '@s.whatsapp.net';
            const urlObj = new URL(cache.repo_url);
            fetch(`https://raw.githubusercontent.com/${urlObj.pathname.replace(/^\//, '').replace(/\.git$/, '')}/refs/heads/main/package.json`).then((response) => response.json().then(data => cache.latest_version = data?.version || cache.current_version)).catch(e => cache.latest_version = cache.current_version);
            if (!fs.existsSync('.env')) fs.writeFileSync('.env', fs.readFileSync('.env.example'));
            initialized = true;
            console.log('Database loaded successfully!');
        } else {
            fs.writeFileSync(config_path, JSON.stringify(cache.configs, null, 4));
            fs.writeFileSync(database_path, JSON.stringify(cache.database, null, 4));
            console.log('Database updated successfully!');
        }
        return true;
    } catch (error) {
        console.error('Error in recache:', error);
        return false;
    }
}