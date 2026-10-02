import axios from "axios";
import getEmojiMixUrl from 'emoji-mixer';
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { _functions } from "../library/functions.js";
import { cache } from "../init.js";

class Media {
    async vv(send, msg, quotedMsg, from) {
        try {
            send.react(from, '🔓', msg.key);
            if (cache.process_count >= cache.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            if (!quotedMsg) throw new Error("Please reply to a view-once message.");
            const media = quotedMsg.imageMessage || quotedMsg.videoMessage || quotedMsg.audioMessage || null;
            if (media?.viewOnce !== true) throw new Error("The quoted message is not a view-once media.");
            const type = media?.mimetype?.split('/')[0] || '';
            const caption = media?.caption || '';
            const buffer = await downloadMediaMessage({ key: { remoteJid: from }, message: quotedMsg }, 'buffer', {});
            if (type === 'image') await send.image(from, buffer, caption, msg);
            else if (type === 'video') await send.video(from, buffer, caption, msg);
            else if (type === 'audio') await send.audio(from, buffer, msg);
            else throw new Error('Invalid media type!');
        } catch (error) {
            console.error('Error in vv:', error.message);
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
    async tostic(send, text, from, msg, quotedMsg) {
        try {
            send.react(from, '🎨', msg.key);
            if (cache.process_count >= cache.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            const message = quotedMsg || msg.message;
            const media = await downloadMediaMessage({ key: { remoteJid: from }, message }, 'buffer', {});
            const data = await _functions.convert(media, { from: '*', to: 'sticker', options: { crop: text.split(' ')[1]?.trim() === 'c', type: !(message?.videoMessage || message?.ptvMessage) ? 'image' : 'video' } });
            await send.sticker(from, data, msg);
        } catch (error) {
            console.error('Error creating sticker:', error.message);
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
    async toimg(send, text, from, msg, quotedMsg) {
        try {
            send.react(from, '🖼️', msg.key);
            if (cache.process_count >= cache.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            const media = await downloadMediaMessage({ key: { remoteJid: from }, message: quotedMsg }, 'buffer', {});
            const data = await _functions.convert(media, { from: 'sticker', to: 'image' });
            await send.image(from, data, '', msg);
        } catch (error) {
            console.error('Error creating image:', error.message);
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
    async tovid(send, text, from, msg, quotedMsg) {
        try {
            send.react(from, '🎥', msg.key);
            if (cache.process_count >= cache.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            const media = await downloadMediaMessage({ key: { remoteJid: from }, message: quotedMsg }, 'buffer', {});
            const data = await _functions.convert(media, { from: 'sticker', to: 'video' });
            await send.video(from, data, '', msg);
        } catch (error) {
            console.error('Error creating video:', error.message);
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
    async pack(send, context, from, msg, quotedMsg, username) {
        try {
            send.react(from, '🎨', msg.key);
            if (cache.process_count >= cache.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            const message = quotedMsg || msg.message;
            if (!message?.stickerMessage) throw new Error('Please reply to a sticker!');
            const args = context.slice(1)?.replace(/(pack|take|siphon)/i, '')?.split('|')?.map(i => i.trim()) || [];
            const media = await downloadMediaMessage({ key: { remoteJid: from }, message }, 'buffer', {});
            const data = await _functions.convert(media, { from: 'sticker', to: 'sticker', options: { pack: args[0] || username || '', author: args[1] || '' } });
            await send.sticker(from, data, msg);
        } catch (error) {
            console.error('Error creating pack:', error.message);
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
    async song(send, text, from, msg) {
        try {
            send.react(from, '🎵', msg.key);
            if (cache.process_count >= cache.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            const query = text.replace(/(song|play)/i, '').trim();
            if (!query) throw new Error('No query provided!');
            const data = await _functions.download_query(query, 'audio');
            await send.image(from, { url: data.thumbnail }, `*${data.title || query}*`);
            await send.audio(from, { url: data.url }, msg);
        } catch (error) {
            console.error('Error downloading audio:', error.message);
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
    async vid(send, text, from, msg) {
        try {
            send.react(from, '📽️', msg.key);
            if (cache.process_count >= cache.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            const query = text.replace(/(vid|video)/i, '').trim();
            if (!query) throw new Error('No query provided!');
            const data = await _functions.download_query(query, 'video');
            await send.video(from, { url: data.url }, `*${data.title || query}*`, msg);
        } catch (error) {
            console.error('Error downloading video:', error.message);
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
    async img(send, from, text, msg) {
        try {
            send.react(from, '🖼️', msg.key);
            if (cache.process_count >= cache.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            const query = text.replace(/(image|img|pins)/i, '').trim();
            if (!query) throw new Error('No query provided!');
            if ((!process.env.GOOGLE_IMAGE_API_KEY || !process.env.GOOGLE_IMAGE_ENGINE_ID) && !process.env.UNSPLASH_API_KEY) throw new Error('No valid image API key provided in `.env`.');
            let images = [];
            await axios.get('https://www.googleapis.com/customsearch/v1', { params: { key: process.env.GOOGLE_IMAGE_API_KEY, cx: process.env.GOOGLE_IMAGE_ENGINE_ID, q: query, searchType: 'image', num: 8, safe: 'active' }, timeout: 10000 }).then(response => images = response.data?.items?.map(item => item.link) || []);
            if (!images.length && process.env.UNSPLASH_API_KEY) await axios.get('https://api.unsplash.com/search/photos', { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}` }, params: { query } }).then(response => images = response.data?.results?.map(item => item.urls.regular) || []);
            if (!images.length) throw new Error(`No images found for ${query}...`);
            for (const image of images) {
                try {
                    await send.image(from, { url: image }, '', msg);
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (e) {
                    console.warn('Failed to send image:', e.message);
                }
            }
        } catch (error) {
            console.error('Error downloading image:', error.message);
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
    async download(send, context, from, msg) {
        try {
            send.react(from, '🔄', msg.key);
            if (cache.process_count >= cache.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            const query = context.slice(1).replace(/(dl|download)/i, '').trim();
            if (!query) throw new Error('No query provided!');
            const data = await _functions.download_query(query);
            if (data.type === 'video') await send.video(from, { url: data.url }, `*${data.title || '...'}*`, msg);
            else if (data.type === 'image') await send.image(from, { url: data.url }, '', msg);
        } catch (error) {
            console.error('Error downloading query:', error.message);
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
    async upload(send, from, msg, quotedMsg, _return = false) {
        /**
         * TODO: Change upload endpoint to use reflection upload (to avoid using imgbb) and add support for video uploads.
         */
        try {
            if (!_return) send.react(from, '🔄', msg.key);
            if (cache.process_count >= cache.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            const media = quotedMsg || msg.message || null;
            if (!media?.imageMessage && !media?.stickerMessage) throw new Error('Only images and stickers can be uploaded.');
            if (!process.env.IMGBB_API_KEY) throw new Error('No `IMGBB_API_KEY` api key provided in `.env`');
            const buffer = await downloadMediaMessage({ key: { remoteJid: from }, message: media }, 'buffer', {});
            const form = new FormData();
            const mimetype = (media.stickerMessage || media.imageMessage)?.mimetype || 'image/jpeg';
            const blob = new Blob([buffer], { type: mimetype });
            const ext = mimetype?.split('/')[1].replace('jpeg', 'jpg') || 'jpg';
            form.append('image', blob, `upload.${ext}`);
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, form);
            const url = response.data?.data?.display_url || '';
            if (!url) throw new Error('No response from API.');
            if (_return) return { url }
            await send.text(from, `*Image URL:* ${url}`, msg);
        } catch (error) {
            console.error('Image upload error:', error.message);
            if (_return) throw error;
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
    async emix(send, from, text, msg) {
        try {
            await send.react(from, '🫟', msg.key);
            if (cache.process_count >= cache.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            const args = text.replace(/(emix|emoji)/i, '')?.split('+')?.map(i => i.trim()) || [];
            if (args.length !== 2 || !args[0] || !args[1]) throw new Error(`*Usage:* ${cache.configs.prefix}emix 😅+🙂‍↔️`);
            const url = await getEmojiMixUrl(args[0], args[1]);
            if (!url) throw new Error('These emojis cannot be mixed..');
            const data = await _functions.convert(url, { from: 'sticker', to: 'sticker', options: { pack: cache.bot_name, author: cache.author } });
            await send.sticker(from, data, msg);
        } catch (error) {
            console.error('Error combining emojis:', error.message);
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
}

export const _media = new Media();