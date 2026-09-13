import fs from 'fs';

let initialized = false;

export const cache = {
    configs: {
        name: '',
        number: '',
        id: '',
        bot: 'Anon',
        version: 'v1.0.0',
        mode: 'private',
        respond: false,
        blacklist: [],
        banned: [],
        sudo: [],
        sudoOn: true,
        backgrounds: [],
        notifications: true,
        prefix: '/'
    },
    database: {
        groupSettings: {}
    }
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
            cache.configs.id = sock?.user?.lid ? sock?.user?.lid.split(':')[0] + '@lid' : cache.configs.id;
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