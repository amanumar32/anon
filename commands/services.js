import gTTS from "gtts";
import fs from 'fs';
import path from "path";
import os from 'os';
import axios from "axios";
import { translate } from "@vitalets/google-translate-api";
import { _functions } from "../library/functions.js";
import { cache } from "../init.js";

class Services {
    constructor() {
        this.history = []
    }
    async weather(send, text, from, msg) {
        try {
            send.react(from, '🌤️', msg.key);
            const city = text.replace('weather', '').trim();
            if (!city) throw new Error('Please provide a city to get the current weather.');
            const data = { latitude: '', longitude: '', name: '', country: '', admin1: '', timezone: '' };
            let response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            for (const key of Object.keys(data)) data[key] = response?.data?.results[0]?.[key] || null;
            if (!data.latitude || !data.longitude) throw new Error('City not found.');
            response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&current_weather=true&hourly=temperature_2m,weathercode,relative_humidity_2m,wind_speed_10m&timezone=auto&forecast_days=1`);
            if (!response.data) throw new Error('Could not fetch weather data.');
            const result = { temperature: response.data.current_weather.temperature, description: interpretWeatherCode(response.data.current_weather.weathercode), windSpeed: response.data.current_weather.windspeed, humidity: response.data.hourly.relative_humidity_2m[0], time: new Date().toLocaleString('en-GB', { timeZone: data.timezone }) };
            send.text(from, `*${data.name}, ${data.country}, ${data.admin1 ? data.admin1 : ''}*\n\n🌡️ Temperature: ${result.temperature}°C\n☁️ Conditions: ${result.description}\n🌬️ Wind Speed: ${result.windSpeed} km/h\n💧 Humidity: ${result.humidity}%\n🕐 Local Time: ${result.time}`, msg);
        } catch (error) {
            console.error('Error fetching weather:', error.message);
            send.text(from, error.message, msg);
        }
    }
    async news(send, text, from, msg) {
        try {
            send.react(from, '📰', msg.key);
            const query = text.replace('news', '').trim() || '';
            if (!process.env.NEWSDATA_IO_API_KEY) throw new Error('No `process.env.NEWSDATA_IO_API_KEY` found in `.env`.');
            const response = await axios.get(`https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_IO_API_KEY}&language=en${query ? `&q=${encodeURIComponent(query)}` : ''}`);
            if (!response.data) throw new Error('No news found.');
            const data = await response.data;
            const articles = data.results.filter(article => ['title', 'description', 'link'].some(r => typeof article[r] === 'string')).slice(0, 6).map(article => ({ title: article.title.trim(), description: article.description.trim() || 'No description available', link: article.link.trim() }));
            if (!articles.length) throw new Error('No articles found');
            send.text(from, `📰 ${query ? `Search for ${query} news...` : 'Latest news...'}\n\n${articles.map((article, index) => `${index + 1}. *${article.title}*\n- _${article.description}_\n\n> *Read more:* ${article.link}\n\n`).join('')}`);
        } catch (error) {
            console.error('Error fetching news:', error.message);
            send.text(from, error.message, msg);
        }
    }
    async tts(send, from, msg, context, quotedText) {
        try {
            send.react(from, '▶️', msg.key);
            if (cache.process_count >= cache.configs.developer.process_limit) throw new Error('Background process limit reached! Please wait till some processes are completed...');
            cache.process_count += 1;
            const message = context.slice(1).replace(/tts/i, '').trim() || quotedText;
            if (!message) throw new Error('Please provide a text to convert.');
            const file = path.join(os.tmpdir(), `tts_${Date.now()}.mp3`);
            const gtts = new gTTS(message, 'en');
            gtts.save(file, async function (err) {
                if (err) throw new Error();
                await send.audio(from, { url: file }, msg);
                if (fs.existsSync(file)) fs.unlinkSync(file);
            });
        } catch (error) {
            console.error('Error creating tts:', error.message);
            send.text(from, error.message, msg);
        } finally {
            cache.process_count -= 1;
        }
    }
    async stt(send, from, msg) {
        send.text(from, '> *This feature is either under development or will be removed soon...*', msg);
    }
    async lyrics(send, from, text, msg) {
        try {
            send.react(from, '🎤', msg.key);
            const song = text.replace(/lyrics?/i, '').trim();
            const args = song.split('-');
            if (args.length < 2) throw new Error(`*Usage:* ${cache.configs.prefix}lyrics _Artist_ - _Song Title_`);
            const artist = args[0].trim();
            const title = args[1].trim();
            const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
            const lyrics = response.data?.lyrics || '';
            if (!lyrics) throw new Error('No Lyrics Found!');
            send.text(from, `*${_functions.sentence_case(artist)} - ${_functions.sentence_case(title)}*\n${cache.structures.white_space}\n${lyrics}`, msg);
        } catch (error) {
            console.error('Error fetching lyrics:', error.message);
            send.text(from, error.message, msg);
        }
    }
    async translate(send, text, from, msg, quotedText) {
        try {
            send.react(from, '🔤', msg.key);
            const message = text.replace(/(translate|tr)/, '').trim() || quotedText;
            if (!message) throw new Error('Please provide a text to translate.');
            const response = await translate(message, { to: 'en' });
            send.text(from, `*From:* ${response?.raw.src.toUpperCase() || 'Unknown'}\n\n${response?.text || 'No translation returned.'}`, msg);
        } catch (error) {
            console.error('Error translating:', error.message);
            await send.text(from, error.message, msg);
        }
    }
    async ai(send, msg, from, text, quotedText, _return = false) {
        send.text(from, '> *This feature is either under development or will be removed soon...*', msg);
    }
}

export const _services = new Services();