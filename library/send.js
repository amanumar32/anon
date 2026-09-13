
class Send {
    constructor(sock) {
        this.sock = sock;
    }

    async text(to, content = '', quoted = null, mentions = []) {
        try {
            return await this.sock.sendMessage(to, { text: content, mentions }, { quoted, contextInfo: { mentionedJid: mentions } });
        } catch (error) { throw error; }
    }

    async image(to, image, caption = '', quoted = null, mentions = [], options = { mimetype: 'image/jpeg' }) {
        try {
            return await this.sock.sendMessage(to, { image, caption, mentions, mimetype: options.mimetype }, { quoted });
        } catch (error) {
            throw error;
        }
    }

    async video(to, video, caption = '', quoted = null, mentions = [], gifPlayback = false) {
        try {
            return await this.sock.sendMessage(to, { video, caption, mentions, gifPlayback }, { quoted });
        } catch (error) { throw error; }
    }

    async delete(to, key) {
        try {
            return await this.sock.sendMessage(to, { delete: key });
        } catch (error) { throw error; }
    }

    async edit(to, newText, key) {
        try {
            return await this.sock.sendMessage(to, { text: newText, edit: key });
        } catch (error) { throw error; }
    }

    async react(to, emoji, key) {
        try {
            return await this.sock.sendMessage(to, { react: { text: emoji, key } });
        } catch (error) { throw error; }
    }

    async groupUpdate(jid, participants, action = 'add') {
        try {
            return await this.sock.groupParticipantsUpdate(jid, participants, action);
        } catch (error) { throw error; }
    }

    async audio(to, audio, quoted = null, mentions = [], ptt = false, mimetype = 'audio/mpeg') {
        try {
            return await this.sock.sendMessage(to, { audio, mentions, ptt, mimetype }, { quoted });
        } catch (error) {
            throw error;
        }
    }

    async sticker(to, sticker, quoted = null) {
        try {
            return await this.sock.sendMessage(to, { sticker }, { quoted });
        } catch (error) { throw error; }
    }

    async contact(to, details = { name: '', number: '', org: '' }, quoted = null) {
        try {
            return await this.sock.sendMessage(to, {
                contacts: {
                    name: details.name,
                    contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${details.name};;;\nFN:${details.name}\nORG:${details.org}\nTEL;type=cell;type=VOICE;waid=${details.number}:${details.number}\nEND:VCARD` }]
                }
            }, { quoted });
        } catch (error) { throw error; }
    }

    async poll(to, question, options, quoted = null) {
        try {
            const pollMessage = {
                poll: {
                    name: question,
                    values: options,
                    selectableOptionsCount: 1
                }
            };
            return await this.sock.sendMessage(to, pollMessage, { quoted });
        } catch (error) { throw error; }
    }
    async document(to, document, quoted = null, fileName = '', caption = '', mimetype = 'text/plain') {
        try {
            await this.sock.sendMessage(to, { document, fileName, mimetype, caption }, { quoted });
        } catch (error) { throw error; }
    }
}

export default Send