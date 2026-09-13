import fs from 'fs';

export const cache = {
    configs: {
        user: { name: '', number: '', id: '' },
        bot: { name: 'Anon', version: 'v1.0.0' },
        settings: { public: false, respond: false }
    }
}

export async function recache(sock = null, mode = 'update') {
    const configPath = 'configs.json';
    const directories = ['./logs', './database'];

    directories.forEach(dir => fs.mkdirSync(dir, { recursive: true }));
    if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify(cache.configs, null, 4));

    if (mode === 'start') {
        const local_configs = JSON.parse(fs.readFileSync(configPath) || "{}");
        Object.keys(cache.configs).forEach(sec => Object.keys(cache.configs[sec]).forEach(val => cache.configs[sec][val] = local_configs[sec][val] || cache.configs[sec][val]));
        cache.configs.user.id = (sock?.user?.lid.split(':')[0] + '@lid') || cache.configs.user.id;
    } else {
        fs.writeFileSync(configPath, JSON.stringify(cache.configs, null, 4));
    }
}