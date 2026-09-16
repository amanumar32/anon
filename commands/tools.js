import { evaluate } from "mathjs";
import { cache } from "../init.js";
import crypto from 'crypto';

class Tools {
    async calc(send, from, text, msg) {
        const expression = text.replace('calc', '').replace(/[×·]/g, '*').replace(/[÷]/g, '/').replace(/[−–—]/g, '-').replace(/[π]/g, 'pi').replace(/[∞]/g, 'Infinity').replace(/[√]/g, 'sqrt').replace(/(\d+)%/g, '($1/100)');
        try {
            const result = evaluate(expression);
            send.text(from, `*Result:* ${result}`, msg);
        } catch (error) {
            send.text(from, 'Please enter a valid expression.', msg);
        }
    }
    async hash(send, from, context, msg, quotedText) {
        const message = context.slice(1).replace(/hash/i, '')?.trim() || quotedText?.trim() || '';
        if (!message) return await send.text(from, 'Please provide a text to hash.', msg);
        try {
            const result = crypto.createHash('sha256').update(message).digest('hex');
            send.text(from, `*SHA-256 Hash:*\n\`\`\`${result}\`\`\``, msg);
        } catch (error) {
            send.text(from, 'An error occurred while generating the hash.', msg);
        }
    }
    async qr(send, from, context, msg, quotedText) {
        const message = context.slice(1).replace(/qr/i, '')?.trim() || quotedText?.trim() || '';
        if (!message) return await send.text(from, 'Please provide a text to convert.', msg);
        const qr_url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(message)}`;
        try {
            send.image(from, { url: qr_url }, `QR Code for "${message}".`, msg);
        } catch (error) {
            console.warn('Error sending qrcode:', error.message);
            send.text(from, `*QR Code Link:*\n${qr_url}`, msg);
        }
    }
    async morse(send, context, msg, from, quotedText) {
        const message = context.slice(1).replace(/morse/i, '')?.trim() || quotedText?.trim() || '';
        if (!message) return await send.text(from, 'Please provide a text to convert.', msg);
        let result = '';
        if (/^[.\-\/\s]+$/.test(message.trim())) {
            const reverse_map = {};
            for (const [char, code] of Object.entries(cache.morse_code_map)) reverse_map[code] = char;
            const words = message.split(' / ');
            for (const word of words) {
                const letters = word.split(' ');
                for (const letter of letters) {
                    if (reverse_map[letter]) result += reverse_map[letter];
                }
                result += ' ';
            }
        } else {
            for (let char of message.toLowerCase()) {
                if (cache.morse_code_map[char]) result += cache.morse_code_map[char] + ' ';
            }
        }
        send.text(from, result.trim() || 'No valid characters to convert', msg);
    }
    async pick(send, from, text, msg) {
        const options = text.replace('pick', '')?.split(',')?.map(i => i?.trim()) || [];
        send.text(from, options.length < 2 ? 'Please provide at least two items separated by "," to pick from.' : `I pick *${options[Math.floor(Math.random() * options.length)]}*.`, msg);
    }
    async coin(send, from, msg) {
        send.text(from, `*${Math.random() < 0.5 ? 'Heads' : 'Tails'}!*`, msg);
    }
    async dice(send, from, msg) {
        send.text(from, `You rolled *${Math.floor(Math.random() * 6) + 1}!*`, msg);
    }
}

export const _tools = new Tools();