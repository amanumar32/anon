import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { cache } from '../init.js';
import { createCanvas } from 'canvas';
import Sticker from 'wa-sticker-formatter';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

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
    async convert(media, configs = { from: '', to: '', ext: '', options = {} }) {
        const { from, to, ext, options } = configs;
        const temp = os.tmpdir();
        if (!media) return null;
        let input = path.join(temp, `in_${Date.now()}`);
        let output = path.join(temp, `out_${Date.now()}${ext ? `.${ext}` : ''}`);
        let result;

        if (!Buffer.isBuffer(media)) {
            const response = await axios.get(media, { responseType: 'arraybuffer', timeout: 60000, maxContentLength: 50 * 1024 * 1024 });
            media = Buffer.from(response.data);
        }
        try {
            fs.writeFileSync(input, media);
            if (from === 'audio' && to === 'audio') {
                await new Promise((resolve, reject) => ffmpeg(input).noVideo().audioCodec('libmp3lame').audioBitrate('128k').audioFrequency(44100).audioChannels(2).toFormat('mp3').save(output).on('end', resolve).on('error', reject));
            } else if (from === 'video' && to === 'video') {
                await new Promise((resolve, reject) => ffmpeg(input).outputOptions(['-c:v libx264', '-c:a aac', '-pix_fmt yuv420p', '-preset fast', '-crf 23', '-movflags +faststart']).toFormat('mp4').save(output).on('end', resolve).on('error', reject));
            } else if (from === 'gif' && to === 'video') {
                await new Promise((resolve, reject) => ffmpeg(input).outputOptions(['-pix_fmt yuv420p', '-vf scale=512:-2', '-movflags faststart', '-preset ultrafast']).toFormat('mp4').save(output).on('end', resolve).on('error', reject));
            } else if (from === 'image' && to === 'image') {
                await new Promise((resolve, reject) => ffmpeg(input).toFormat('mjpeg').save(output).on('end', resolve).on('error', reject));
            } else if (from === 'image' && to === 'sticker') {
                const crop = !!options?.crop || false;
                const image = sharp(input);
                const metadata = await image.metadata();
                const size = Math.min(metadata.width, metadata.height, 512);
                result = await image.resize({ width: crop ? size : 512, height: crop ? size : 512, fit: crop ? 'cover' : 'contain', withoutEnlargement: !crop }).webp({ quality: 80 }).toBuffer();
            } else if (from === 'sticker' && to === 'sticker') { }
            return result || fs.existsSync(output) ? fs.readFileSync(output) : null;
        } catch (error) {
            console.error(`Conversion error (${from} to ${to}):`, error.message);
            return null;
        } finally {
            if (fs.existsSync(input)) fs.unlinkSync(input);
            if (fs.existsSync(output)) fs.unlinkSync(output);
        }
    }
}

export const _functions = new Functions();