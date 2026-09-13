export const command_list = {
    // Home commands
    menu: { name: 'menu', description: 'Display a list of all commands', category: 'home', param: ['category'] },
    support: { name: 'support', description: 'Contact and support the developer', category: 'home' },
    repo: { name: 'repo', description: 'The bot\'s Github repository', category: 'home' },
    owner: { name: 'owner', description: 'Bot owner', category: 'home' },
    feedback: { name: 'feedback', description: 'Send us a feedback or report a bug', category: 'home', param: ['message'] },
    donate: { name: 'donate', description: 'Support the developer', category: 'home' },
    help: { name: 'help', description: 'Need help?', category: 'home' },

    // Status commands
    ping: { name: 'ping', description: 'Check the bot\'s latency', category: 'status' },
    uptime: { name: 'uptime', description: 'Check the bot\'s uptime', category: 'status' },
    status: { name: 'status', description: 'Check the bot\'s status', category: 'status' },

    //Tools commands
    calc: { name: 'calc', description: 'Calculate a mathematical expression', category: 'tools', param: ['expression'] },
    hash: { name: 'hash', description: 'Hash a string', category: 'tools', param: ['string'] },
    qr: { name: 'qr', description: 'Generate a QR code', category: 'tools', param: ['text'] },
    morse: { name: 'morse', description: 'Convert text to morse code and back', category: 'tools', param: ['text'] },
    pick: { name: 'pick', description: 'Pick a random option from a list', category: 'tools', param: ['opt1|opt2|...'] },
    coin: { name: 'coin', description: 'Heads or tails', category: 'tools' },
    dice: { name: 'dice', description: 'Roll a dice', category: 'tools' },

    //Fun commands
    joke: { name: 'joke', description: 'Get a random joke', category: 'fun' },
    fact: { name: 'fact', description: 'Get a random fact', category: 'fun' },
    quote: { name: 'quote', description: 'Get a random quote', category: 'fun' },
    td: { name: 'td', description: 'Get a random truth or dare', category: 'fun' },
    wyr: { name: 'wyr', description: 'Get a random would you rather question', category: 'fun' },
    nhie: { name: 'nhie', description: 'Get a random "Never Have I Ever" question', category: 'fun' },
    chess: { name: 'chess', description: 'Play a game of chess with a friend', category: 'fun' },
    wordlink: { name: 'wordlink', description: 'Play a game of wordlink with a friend', category: 'fun' },

    //Media commands
    vv: { name: 'vv', description: 'Anti-view once command', category: 'media', param: ['&'] },
    tostic: { name: 'tostic', description: 'Convert a picture/video to a sticker', category: 'media', param: ['c?', '&'] },
    toimg: { name: 'toimg', description: 'Convert a sticker to an image', category: 'media', param: ['&'] },
    tovid: { name: 'tovid', description: 'Convert a sticker to a video', category: 'media', param: ['&'] },
    pack: { name: 'pack', description: 'Siphon a sticker as your own', category: 'media', param: ['pack|author?', '&'] },
    song: { name: 'song', description: 'Download your favorite songs', category: 'media', param: ['title', 'artist'] },
    vid: { name: 'vid', description: 'Download a video from YouTube', category: 'media', param: ['title'] },
    img: { name: 'img', description: 'Download images from the internet', category: 'media', param: ['query'] },
    download: { name: 'download', description: 'Download media from supported URLs', category: 'media', param: ['url'] },
    upload: { name: 'upload', description: 'Upload an image and get a direct URL', category: 'media', param: ['&'] },
    emix: { name: 'emix', description: 'Combine two emojis together and get a sticker', category: 'media', param: ['emoji 1 + emoji 2'] },

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

export const white_space = `​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​`;

export const morse_code_map = {
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

export const default_background_links = [
    'https://i.ibb.co/6czK1t0q/upload.jpg',
    "https://i.ibb.co/q36VdFqp/upload.jpg",
    'https://i.ibb.co/pvffkk9Y/upload.png',
    'https://i.ibb.co/8hxVNVK/upload.jpg',
    'https://i.ibb.co/Cp9STRyr/upload.jpg',
    'https://i.ibb.co/pNGvpbg/upload.jpg',
]