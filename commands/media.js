import axios from "axios";
import { downloadMediaMessage } from "@whiskeysockets/baileys";

class Media {
    async upload(send, from, msg, quotedMsg, _return = false) {
        try {
            if (!_return) send.react(from, '🔄', msg.key);
            const media = quotedMsg || msg.message || null;
            if (!media?.imageMessage && !media?.stickerMessage) throw new Error('Only images and stickers can be uploaded.');
            if (!process.env.IMGBB_API_KEY) throw new Error('No `IMGBB_API_KEY` api key provided in `.env`');
            const buffer = await downloadMediaMessage({ key: { remoteJid: from }, message: media }, 'buffer', {});
            const form = new FormData();
            const mimetype = (media.stickerMessage || media.imageMessage)?.mimetype || 'image/jpeg';
            const blob = new Blob([buffer], { type: mimetype });
            form.append('image', blob, { filename: `upload.${mimetype?.split('/')[1].replace('jpeg', 'jpg') || 'jpg'}`, contentType: mimetype });
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, form);
            const url = response.data?.data?.display_url || '';
            if (!url) throw new Error('No response from API.');
            if (_return) return { url }
            send.text(from, `*Image URL:* ${url}`, msg);
        } catch (error) {
            console.error('Image upload error:', error.message);
            if (_return) throw error;
            send.text(from, error.message, msg);
        }
    }
}

export const _media = new Media();