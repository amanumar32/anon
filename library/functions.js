export const sentence_case = (str = '') => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
export const clean_id = (id) => id ? id.split(':')[0].split('@')[0] : '';