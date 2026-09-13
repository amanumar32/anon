export const command_list = {
    // Home commands
    menu: { name: 'menu', description: 'Display a list of all commands', category: 'home', param: ['category'] },
    support: { name: 'support', description: 'Contact and support the developer', category: 'home' },
    repo: { name: 'repo', description: 'The bot\'s Github repository', category: 'home' },
    owner: { name: 'owner', description: 'Bot owner', category: 'home' },
    feedback: { name: 'feedback', description: 'Send us a feedback', category: 'home', param: ['message'] },
    report: { name: 'report', description: 'Report a bug, error or typo', category: 'home' },
    donate: { name: 'donate', description: 'Support the developer', category: 'home' },

    // Status commands
    ping: { name: 'ping', description: 'Check the bot\'s latency', category: 'status' },
    uptime: { name: 'uptime', description: 'Check the bot\'s uptime', category: 'status' },
    status: { name: 'status', description: 'Check the bot\'s status', category: 'status' },

    //Tools commands
    calc: { name: 'calc', description: 'Calculate a mathematical expression', category: 'tools', param: ['expression'] },
    hash: { name: 'hash', description: 'Hash a string', category: 'tools', param: ['string'] },
    qr: { name: 'qr', description: 'Generate a QR code', category: 'tools', param: ['text'] },
    morse: { name: 'morse', description: 'Convert text to morse code and back', category: 'tools', param: ['text'] },

    // Owner commands
    prefix: { name: 'prefix', description: 'Change the bot\'s command prefix', category: 'owner', param: ['prefix'] },
    notification: { name: 'notification', description: 'Toggle bot notifications', category: 'owner', param: ['on/off'] },
    mode: { name: 'mode', description: 'Change the bot\'s mode', category: 'owner', param: ['public/private'] },
    respond: { name: 'respond', description: 'Toggle bot responses to messages', category: 'owner', param: ['on/off'] },
    sudo: { name: 'sudo', description: 'Handle sudo users', category: 'owner', param: ['add/remove', 'on/off'] },
    blacklist: { name: 'blacklist', description: 'Blacklist a group', category: 'owner', param: ['group'] },
    whitelist: { name: 'whitelist', description: 'Whitelist a group', category: 'owner', param: ['group'] },
    ban: { name: 'ban', description: 'Ban a user', category: 'owner', param: ['user'] },
    unban: { name: 'unban', description: 'Unban a user', category: 'owner', param: ['user'] },
    background: { name: 'background', description: 'Handle bot backgrounds', category: 'owner', param: ['add/remove'] },
}

const white_space = `​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​`;

const morse_code_map = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.',
    'f': '..-.', 'g': '--.', 'h': '....', 'i': '..', 'j': '.---',
    'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---',
    'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-',
    'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--',
    'z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
    '!': '-.-.--', '/': '-..-.', '-': '-....-', ':': '---...',
    ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '@': '.--.-.',
    ' ': '/', '': ' ',
    '&': '.-...', '(': '-.--.', ')': '-.--.-', '$': '...-..-',
    '_': '..--.-', '"': '.-..-.', '#': '...-.-', '*': '-..--',
    '\n': '\n',
};