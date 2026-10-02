import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import yts from 'yt-search';
import { igdl } from 'ruhend-scraper';
import { cache } from '../init.js';
import { createCanvas } from 'canvas';
import { Sticker } from 'wa-sticker-formatter';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

ffmpeg.setFfmpegPath(ffmpegPath);

class Functions {
    sentence_case = (str = '') => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    clean_id = (id) => id ? id.split(':')[0].split('@')[0] : ''
    list_env_keys = () => `${fs.readFileSync('./.env.example')}`.split('\n').map(i => i.split('=')[0]?.trim()).filter(e => !e.startsWith('#'))
    interpret_weather_code(code = 0) {
        switch (code) {
            case 0: return 'Clear sky';
            case 1: case 2: case 3: return 'Partly cloudy';
            case 45: case 48: return 'Fog';
            case 51: case 53: case 55: return 'Drizzle';
            case 56: case 57: return 'Freezing Drizzle';
            case 61: case 63: case 65: return 'Rain';
            case 66: case 67: return 'Freezing Rain';
            case 71: case 73: case 75: return 'Snow fall';
            case 77: return 'Snow grains';
            case 80: case 81: case 82: return 'Rain showers';
            case 85: case 86: return 'Snow showers';
            case 95: return 'Thunderstorm';
            case 96: case 99: return 'Thunderstorm with hail';
            default: return 'Unknown';
        }
    }
    compare_texts(text1, text2) {
        const m = text1.length;
        const n = text2.length;
        const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) {
            for (let j = 0; j <= n; j++) {
                if (i === 0 || j === 0) {
                    dp[i][j] = 0;
                } else if (text1[i - 1] === text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        const lcs = dp[m][n];
        const val = (2 * lcs) / (m + n);
        return { similar: text1 === text2, percentage: (val * 100).toFixed(2) }
    }
    shuffle_array(array = []) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    progress_bar(percentage = 0) {
        const filled = Math.round(percentage / 10);
        return "■".repeat(filled) + "□".repeat(10 - filled);
    }
    async convert(media, configs = { from: '', to: '', options: {} }) {
        const { from, to, options } = configs;
        const temp = os.tmpdir();
        const input = path.join(temp, `in_${Date.now()}`);
        const ext = to === 'video' ? 'mp4' : to === 'image' ? 'jpg' : options?.ext || '';
        const output = path.join(temp, `out_${Date.now()}${ext ? `.${ext}` : ''}`);
        const frames = path.join(temp, `frames_${Date.now()}`);
        let result;
        try {
            if (!media) throw new Error('No media received for conversion');

            if (!Buffer.isBuffer(media)) await axios.get(media, { responseType: 'arraybuffer', timeout: 60000, maxContentLength: 50 * 1024 * 1024 }).then(response => media = Buffer.from(response.data));
            fs.writeFileSync(input, media);
            fs.mkdirSync(frames, { recursive: true });
            if (from === 'audio' && to === 'audio') {
                await new Promise((resolve, reject) => ffmpeg(input).noVideo().audioCodec('libmp3lame').audioBitrate('128k').audioFrequency(44100).audioChannels(2).toFormat('mp3').save(output).on('end', resolve).on('error', reject));
            } else if (from === 'video' && to === 'video') {
                await new Promise((resolve, reject) => ffmpeg(input).outputOptions(['-c:v libx264', '-c:a aac', '-pix_fmt yuv420p', '-preset ultrafast', '-crf 26', '-threads 2', '-movflags +faststart']).toFormat('mp4').save(output).on('end', resolve).on('error', reject));
            } else if (from === 'gif' && to === 'video') {
                await new Promise((resolve, reject) => ffmpeg(input).outputOptions(['-pix_fmt yuv420p', '-vf scale=512:-2', '-movflags faststart', '-preset ultrafast']).toFormat('mp4').save(output).on('end', resolve).on('error', reject));
            } else if (from === 'image' && to === 'image') {
                await new Promise((resolve, reject) => ffmpeg(input).toFormat('mjpeg').save(output).on('end', resolve).on('error', reject));
            } else if (from === '*' && to === 'sticker') {
                let buffer = null;
                const crop = !!options?.crop;
                const isVideo = options?.type === 'video';
                if (isVideo) {
                    const filter = crop ? 'scale=512:512:force_original_aspect_ratio=increase,crop=512:512' : 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000';
                    await new Promise((resolve, reject) => { ffmpeg(input).inputOptions(['-ss 00:00:00', '-t 00:00:06']).outputOptions(['-vcodec libwebp', `-vf ${filter}`, '-fpsmax 15', '-loop 0', '-preset default', '-an']).toFormat('webp').save(output).on('end', resolve).on('error', (err) => reject(err)); });
                    buffer = fs.readFileSync(output);
                } else {
                    const image = sharp(input, { animated: true });
                    const metadata = await image.metadata();
                    const size = Math.min(metadata.width || 512, metadata.height || 512, 512);
                    buffer = await image.resize({
                        width: crop ? size : 512,
                        height: crop ? size : 512,
                        fit: crop ? 'cover' : 'contain',
                        background: { r: 0, g: 0, b: 0, alpha: 0 }
                    }).webp().toBuffer();
                }
                const sticker = new Sticker(buffer, { pack: cache.bot_name, author: cache.author, type: crop ? 'crop' : 'full', quality: 80 });
                result = await sticker.toBuffer();
            } else if (from === 'sticker' && to === 'sticker') {
                const { pack = '', author = '' } = options;
                const metadata = await sharp(input, { animated: true }).metadata();
                const isAnimated = (metadata.pages || 1) > 1;
                const sticker = new Sticker(input, { pack: pack, author: author, type: 'full', quality: 100, animated: isAnimated });
                result = await sticker.toBuffer();
            } else if (from === 'sticker' && to === 'video') {
                const metadata = await sharp(input).metadata();
                const delays = metadata.delay || [];
                const config = { pages: metadata.pages || 1, delays: delays, isAnimated: (metadata.pages > 1) || (delays.length > 0) };
                for (let i = 0; i < config.pages; i++) {
                    const frame = path.join(frames, `frame_${i.toString().padStart(3, '0')}.png`);
                    await sharp(input, { page: i }).png().toFile(frame);
                }
                let fps = 24;
                if (config.delays.length > 0) {
                    const avg_delay = config.delays.reduce((sum, d) => sum + d, 0) / config.delays.length;
                    fps = Math.round(1000 / avg_delay);
                } else if (config.isAnimated) fps = 10;
                if (isNaN(fps) || fps <= 0) fps = 10;
                await new Promise((resolve, reject) => {
                    const command = ffmpeg().input(path.join(frames, 'frame_%03d.png')).inputOptions([`-framerate ${fps}`]).outputOptions(['-vcodec libx264', '-pix_fmt yuv420p', '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2', '-an', '-preset ultrafast', '-threads 2', '-movflags +faststart']);
                    if (!config.isAnimated) command.inputOptions(['-loop 1']).outputOptions(['-t 3']);
                    command.output(output).toFormat('mp4').on('end', resolve).on('error', reject);
                    command.run();
                });
            } else if (from === 'sticker' && to === 'image') {
                result = await sharp(input).png().toBuffer();
            }
            return result || fs.readFileSync(output);
        } catch (error) {
            console.error(`Conversion error (${from} to ${to}):`, error.message);
            throw error;
        } finally {
            if (fs.existsSync(input)) fs.unlinkSync(input);
            if (fs.existsSync(output)) fs.unlinkSync(output);
            if (fs.existsSync(frames)) fs.rmSync(frames, { recursive: true, force: true });
        }
    }
    async download_query(query = '', type = 'audio') {
        try {
            if (!query) throw new Error('Query required');
            if (!type) /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/i.test(query) ? 'video' : /https?:\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\//i.test(query) ? 'instagram' : /https?:\/\/(?:www\.)?facebook\.com\//i.test(query) ? 'facebook' : 'direct';
            const response = await axios.get(`https://reflection-g7x1.onrender.com/api/download/${type}?query=${query}`);
            if (!response.data?.data) throw new Error("No media received from API");
            return { type, query, url: response.data.data.result.url, thumbnail: response.data.data.result.thumbnail, title: response.data.data.result.title };
        } catch (error) {
            console.error('Error downloading query:', error.message);
            throw error;
        }
    }
    async get_board(type = '', game = null) {
        try {
            let result, buffer;
            if (type === 'chess') {
                const canvas = createCanvas(440, 440);
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#769656';
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        if ((i + j) % 2 === 0) {
                            ctx.fillRect(j * 50, i * 50, 50, 50);
                        } else {
                            ctx.fillStyle = '#eee';
                            ctx.fillRect(j * 50, i * 50, 50, 50);
                            ctx.fillStyle = '#769656';
                        }
                    }
                }
                ctx.fillStyle = '#000';
                ctx.font = '16px Arial';
                for (let i = 0; i < 8; i++) {
                    ctx.fillText(8 - i, 10, i * 50 + 35);
                    ctx.fillText(8 - i, 410, i * 50 + 35);
                }
                ctx.font = '16px Arial';
                for (let j = 0; j < 8; j++) {
                    ctx.fillText(String.fromCharCode(97 + j), j * 50 + 25, 20);
                    ctx.fillText(String.fromCharCode(97 + j), j * 50 + 25, 420);
                }
                ctx.font = '30px Arial';
                const pieces = game.board();
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        const piece = pieces[i][j];
                        if (piece) {
                            const symbol = piece.type;
                            const emoji = piece.color === 'w' ? { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' } : { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
                            ctx.fillText(emoji[symbol], j * 50 + 25, i * 50 + 35);
                        }
                    }
                }
                result = "```\n  a b c d e f g h\n";
                let count = 8;
                for (const row of game.board()) {
                    result += `${count} `;
                    for (const piece of row) {
                        if (!piece) {
                            result += '. ';
                        } else {
                            const symbol = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase(); result += `${symbol} `;
                        }
                    }
                    result += `${count}\n`;
                    count--;
                }
                result += "  a b c d e f g h\n```";
                buffer = canvas.toBuffer('image/png');
            } else if (type === 'ttt') {
                const canvas = createCanvas(300, 300);
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#e3f5ec';
                ctx.fillRect(0, 0, 300, 300);
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(100, 10); ctx.lineTo(100, 290);
                ctx.moveTo(200, 10); ctx.lineTo(200, 290);
                ctx.moveTo(10, 100); ctx.lineTo(290, 100);
                ctx.moveTo(10, 200); ctx.lineTo(290, 200);
                ctx.stroke();
                ctx.font = 'bold 50px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                for (let i = 0; i < 9; i++) {
                    const cell = game[i];
                    if (!cell) continue;
                    const col = i % 3;
                    const row = Math.floor(i / 3);
                    const x = col * 100 + 50;
                    const y = row * 100 + 50;
                    if (cell.toUpperCase() === 'X') {
                        ctx.fillStyle = '#ff4d4d';
                        ctx.fillText('X', x, y);
                    } else if (cell === 'O' || cell === '0') {
                        ctx.fillStyle = '#334bff';
                        ctx.fillText('O', x, y);
                    }
                }
                result = "```\n";
                for (let i = 0; i < 9; i += 3) {
                    const displayCell = (idx) => game[idx] ? ` ${game[idx]} ` : ` ${idx + 1} `;
                    result += `${displayCell(i)}|${displayCell(i + 1)}|${displayCell(i + 2)}\n`;
                    if (i < 6) {
                        result += "---+---+---\n";
                    }
                }
                result += "```";
                buffer = canvas.toBuffer('image/png');
            }
            return { image: buffer, text: result };
        } catch (error) {
            console.error(`Error generating ${type} board:`, error.message);
            throw error;
        }
    };
}

export const _functions = new Functions();