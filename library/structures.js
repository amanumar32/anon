export const command_list = {
    // Home commands
    menu: { name: 'menu', description: 'Display a list of all commands', category: 'home', param: ['category'] }, //
    support: { name: 'support', description: 'Contact and support the developer', category: 'home' },//
    repo: { name: 'repo', description: 'The bot\'s Github repository', category: 'home' },//
    owner: { name: 'owner', description: 'Bot owner', category: 'home' },//
    feedback: { name: 'feedback', description: 'Send us a feedback or report a bug', category: 'home', param: ['message'] },//
    donate: { name: 'donate', description: 'Support the developer', category: 'home' },//
    help: { name: 'help', description: 'Get help on how to use a command', category: 'home', param: ['command'] },//

    // Status commands
    ping: { name: 'ping', description: 'Check the bot\'s latency', category: 'status' },//
    uptime: { name: 'uptime', description: 'Check the bot\'s uptime', category: 'status' },//
    status: { name: 'status', description: 'Check the bot\'s full status', category: 'status' },//
    version: { name: 'version', description: 'Check the bot\'s version and available updates', category: 'status' },//
    alive: { name: 'alive', description: 'Check if the bot is alive and running', category: 'status' },//

    //Tools commands
    calc: { name: 'calc', description: 'Calculate a mathematical expression', category: 'tools', param: ['expression'] },//
    hash: { name: 'hash', description: 'Hash a string', category: 'tools', param: ['string'] },//
    qr: { name: 'qr', description: 'Generate a QR code', category: 'tools', param: ['text'] },//
    morse: { name: 'morse', description: 'Convert text to morse code and back', category: 'tools', param: ['text'] },//
    pick: { name: 'pick', description: 'Pick a random option from a list', category: 'tools', param: ['opt1, opt2, ...'] },//
    coin: { name: 'coin', description: 'Heads or tails', category: 'tools' },//
    dice: { name: 'dice', description: 'Roll a dice', category: 'tools' },//

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
    vv: { name: 'vv', description: 'Anti-view once command', category: 'media', requirements: ['&'] },
    tostic: { name: 'tostic', description: 'Convert a picture/video to a sticker', category: 'media', param: ['c?'], requirements: ['&'], note: 'Add the `c` parameter to crop the sticker, or leave it blank otherwise' },
    toimg: { name: 'toimg', description: 'Convert a sticker to an image', category: 'media', requirements: ['&'] },
    tovid: { name: 'tovid', description: 'Convert a sticker to a video', category: 'media', requirements: ['&'] },
    pack: { name: 'pack', description: 'Siphon a sticker as your own', category: 'media', param: ['pack|author?'], requirements: ['&'] },
    song: { name: 'song', description: 'Download your favorite songs', category: 'media', param: ['title', 'artist'] },
    vid: { name: 'vid', description: 'Download a video from YouTube', category: 'media', param: ['title'] },
    img: { name: 'img', description: 'Download images from the internet', category: 'media', param: ['query'] },
    download: { name: 'download', description: 'Download media from supported URLs', category: 'media', param: ['url'], note: 'Supported platforms include: YouTube, Facebook, Instagram, and Direct URLs' },
    upload: { name: 'upload', description: 'Upload an image and get a direct URL', category: 'media', requirements: ['&'] },
    emix: { name: 'emix', description: 'Combine two emojis together and get a sticker', category: 'media', param: ['emoji 1 + emoji 2'] },

    // Owner commands
    configs: { name: 'configs', description: 'View the bot\'s configurations', category: 'owner' },//
    database: { name: 'database', description: 'View the bot\'s database', category: 'owner' },//
    prefix: { name: 'prefix', description: 'Change the bot\'s command prefix', category: 'owner', param: ['set?', 'prefix'] },//
    notification: { name: 'notification', description: 'Toggle bot notifications', category: 'owner', param: ['on/off'] },//
    mode: { name: 'mode', description: 'Change the bot\'s mode', category: 'owner', param: ['public/private'] },//
    respond: { name: 'respond', description: 'Toggle bot responses to messages', category: 'owner', param: ['on/off'] },//
    sudo: { name: 'sudo', description: 'Handle sudo users', category: 'owner', param: ['add/remove', 'on/off'], requirements: ['@'], note: 'Sudo users can use the bot while in private mode' },//
    blacklist: { name: 'blacklist', description: 'Blacklist a group', category: 'owner', param: ['group'] },
    whitelist: { name: 'whitelist', description: 'Whitelist a group', category: 'owner', param: ['group'] },
    ban: { name: 'ban', description: 'Ban a user', category: 'owner', requirements: ['@'] },
    unban: { name: 'unban', description: 'Unban a user', category: 'owner', requirements: ['@'] },
    background: { name: 'background', description: 'Handle bot backgrounds for the menu', category: 'owner', param: ['add/remove'], requirements: ['&'] },
    update: { name: 'update', description: 'Update the bot to the latest committed version', category: 'owner' },//
    setresponse: { name: 'setresponse', description: 'Set a static response message from your responses as an alternative to `GEMINI_AI_API_KEY`', category: 'owner', param: ['response'] },
    env: { name: 'env', description: 'Add an env value automatically', category: 'owner', param: ['key', 'value'] },
    prompt: { name: 'prompt', description: 'Set a custom prompt for your AI responses', category: 'owner', param: ['prompt'] },
    setname: { name: 'setname', description: 'Change your name on the bot', category: 'owner', param: ['name'] },
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