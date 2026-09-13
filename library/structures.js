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