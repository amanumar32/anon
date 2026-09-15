import fs from 'fs';

export const sentence_case = (str = '') => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
export const clean_id = (id) => id ? id.split(':')[0].split('@')[0] : '';
export const list_env_keys = (example = false) => {
    if (!fs.existsSync(`./.env${example ? '.example' : ''}`)) {
        fs.writeFileSync(`./.env${example ? '.example' : ''}`, '# env');
        return [];
    };
    return `${fs.readFileSync(`./.env${example ? '.example' : ''}`)}`.split('\n').map(i => i.trim()).filter(e => !e.startsWith('#')).map(a => a.split('=')[0]);
};