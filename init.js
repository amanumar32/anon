import fs from 'fs';

const local = JSON.parse(fs.readFileSync('./package.json'));

export const cache = {
    configs: {
        name: '',
        number: '',
        mode: 'private',
        respond: false,
        sudoOn: true,
        notifications: true,
        prefix: '.',
        response: 'Hey <user>! I\'ll respond to you once I\'m online.\n\n> This is an automated message.',
        prompt: 'You are a helpful Assistant.',
        developer: {
            api_enabled: false,
            edited_source_code: false,
            process_limit: 3,
            port: 3000,
            hour_delay_for_response: 2,
            logs_redirect_id: ''
        }
    },
    database: {
        data: {
            sudo: [],
            banned: [],
            blacklist: [],
            backgrounds: [],
        },
        groupSettings: {},
        memberActivity: {},
        commandStats: {}
    },
    main_keys: [],
    bot_name: local.name,
    author: local.author,
    homepage_url: local.homepage,
    bot_id: '',
    current_version: local.version,
    latest_version: '',
    process_count: 0,
    repo_url: local.repository.url.replace(/^git\+/, '').replace(/\.git$/, '') + '.git',
    last_owner_message: Date.now(),
    start_time: Date.now(),
    last_recache_update: Date.now(),
    initialized: false
}

cache.main_keys = Object.keys(cache).filter(i => typeof cache[i] === 'object').slice(0, 2);

export async function recache(mode = 'update') {
    try {
        if (mode === 'start') {
            if (cache.initialized) return true;
            cache.main_keys.forEach(key => {
                if (!fs.existsSync(`${key}.json`)) fs.writeFileSync(`${key}.json`, JSON.stringify(cache[key], null, 4));
                cache[key] = JSON.parse(fs.readFileSync(`${key}.json`)) || cache[key];
            });
            if (!fs.existsSync('.env')) fs.writeFileSync('.env', fs.readFileSync('.env.example'));
            fetch(`https://raw.githubusercontent.com/${new URL(cache.repo_url).pathname.replace(/^\//, '').replace(/\.git$/, '')}/refs/heads/main/package.json`).then((response) => response.json().then(data => cache.latest_version = data?.version || cache.current_version)).catch(e => cache.latest_version = cache.current_version);
            cache.initialized = true;
            console.log('Database loaded successfully!');
        } else {
            cache.main_keys.forEach(key => fs.writeFileSync(`${key}.json`, JSON.stringify(cache[key], null, 4)));
            cache.last_recache_update = Date.now();
        }
        return true;
    } catch (error) {
        console.error('Error in recache:', error);
        return false;
    }
}