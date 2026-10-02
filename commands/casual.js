import axios from "axios";
import { cache } from "../init.js";
import { Chess } from "chess.js";
import { _functions } from "../library/functions.js";

class Casual {
    constructor() {
        this.sessions = {
            wordlink: new Map(),
            chess: new Map(),
            ttt: new Map(),
            hangman: new Map()
        }
    }
    async misc(send, from, text, msg) {
        try {
            const mode = text.startsWith('joke') ? 'joke' : text.startsWith('fact') ? 'fact' : 'quote';
            let result = '';
            const get = async (url = '') => await axios.get(url).then((response) => { return response.data });
            if (mode === 'joke') {
                const data = await get('https://official-joke-api.appspot.com/random_joke');
                result = data ? `${data?.setup}\n${data?.punchline}`.trim() : 'The real joke is the fact that I Couldn\'t find any jokes. 🥲🥲';
            } else if (mode === 'fact') {
                const data = await get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
                result = data ? data?.text : "Did you know I couldn't get a fact at this time? 😅😅";
            } else if (mode === 'quote') {
                const data = await get('https://type.fit/api/quotes');
                const random = data[Math.floor(Math.random() * data.length)] || null;
                result = random ? `${random?.text} - _${random?.author || 'Unknown'}_` : `Couldn't fetch a quote - _${cache.bot_name}_`;
            }
            send.text(from, result, msg);
        } catch (error) {
            console.error('Error in misc:', error.message);
            send.text(from, error.message, msg);
        }
    }
    async rounds(send, text, from, msg) {
        try {
            const mode = text.startsWith('td') ? 'td' : text.startsWith('wyr') ? 'wyr' : 'nhie';
            let result, type;
            if (mode === 'td') {
                const args = text.replace('td', '')?.trim();
                const list = ['truth', 'dare'];
                type = args.startsWith('t') ? list[0] : args.startsWith('d') ? list[1] : list[Math.floor(Math.random() * 2)];
            }
            else if (mode === "wyr") type = 'wyr';
            else type = 'nhie';
            const response = await axios.get(`https://api.truthordarebot.xyz/api/${type.toUpperCase()}?rating=pg13`);
            result = response?.data?.question || `Couldn't fetch a *${type}* question. Please try again later.`;
            send.text(from, `*${result}*`, msg);
        } catch (error) {
            console.error('Error in rounds:', error.message);
            send.text(from, error.message, msg);
        }
    }
    async chess(send, text, from, msg, userid) {
        const session = this.sessions.chess;
        try {
            const mode = (() => { switch (text.replace('chess', '').trim()) { case 'start': return 'start'; case 'quit': return 'quit'; case 'join': return 'join'; case 'board': return 'board'; case 'history': return 'history'; case 'help': return 'help'; default: return 'move'; } })();
            const usage = `*Usage:*\n\n- ${cache.configs.prefix}chess start - start a new chess game.\n- ${cache.configs.prefix}chess join - join an existing chess game\n- ${cache.configs.prefix}chess quit - resign from the current game\n- ${cache.configs.prefix}chess history - see the full game history\n- ${cache.configs.prefix}chess board - display the current game board\n- ${cache.configs.prefix}chess help - display the chess help list\n- ${cache.configs.prefix}chess <move> (e.g., ${cache.configs.prefix}chess e2e4) - perform a move`;
            const data = session.get(from) || { time: Date.now(), players: [], game: null, history: [], status: '' };
            if (mode === 'start') {
                if (cache.configs.mode !== 'public' && !cache.database.data.sudo.length) throw new Error(`Public mode required to start a chess game. Send \`${cache.configs.prefix}mode public\` to continue.`);
                if (session.has(from)) throw new Error("A game is already in progress.");
                data.players.push(userid);
                data.status = 'pending';
                session.set(from, data);
                setTimeout(async () => {
                    if (data.status === 'pending') {
                        session.delete(from);
                        throw new Error("Pending game has been deleted due to lack of activity.");
                    }
                }, 1000 * 60 * 5);
                await send.text(from, `Chess game started by @${userid.split('@')[0]}. Type \`${cache.configs.prefix}chess join\` to join the game.`, msg, [userid]);
            } else if (mode === 'join') {
                if (data.status !== 'pending') throw new Error("No pending games in this chat.");
                data.players.push(userid);
                data.status = 'active';
                data.game = new Chess();
                data.time = Date.now();
                session.set(from, data);
                setTimeout(() => {
                    if (session.has(from) && Date.now() - session.get(from).time >= 1000 * 60 * 15) {
                        session.delete(from);
                        throw new Error(`Current game deleted due to lack of activity. Start a new game with \`${cache.configs.prefix}chess start\`.`);
                    }
                }, 1000 * 60 * 15);
                const board = await _functions.get_board('chess', data.game);
                await send.text(from, usage, null, data.players);
                await send.image(from, board.image, `*Chess game started.*\n\n*White:* @${data.players[0].split('@')[0]}\n*Black:* @${data.players[1].split('@')[0]}\n\n${board.text}\n\n> *Status:* ${data.status}\n> *Next:* ${data.game.turn() === 'w' ? 'White' : 'Black'}`, msg, data.players);
            } else if (mode === 'quit') {
                if (!session.get(from)) throw new Error(`No active game. Start one with \`${cache.configs.prefix}chess start\``);
                if (!data.players.includes(userid)) throw new Error("You are not a player in this game.");
                const winner = data.players[userid === data.players[0] ? 1 : 0];
                const board = await _functions.get_board('chess', data.game);
                await send.image(from, board.image, `*Surrender*.\n\n*White:* @${data.players[0].split('@')[0]}\n*Black:* @${data.players[1].split('@')[0]}\n\n${board.text}\n\n> *Status:* surrender\n> *Winner:* @${winner.split('@')[0]}`, msg, data.players);
                session.delete(from);
            } else if (mode === 'board') {
                const board = await _functions.get_board('chess', data.game);
                await send.image(from, board.image, `*Game board.*\n\n*White:* @${data.players[0].split('@')[0]}\n*Black:* @${data.players[1].split('@')[0]}\n\n${board.text}\n\n> *Status:* ${data.status}\n> *Next:* ${data.game.turn() === 'w' ? 'White' : 'Black'}`, msg, data.players);
            } else if (mode === 'help' || mode === 'history') {
                const message = mode === 'help' ? usage : data.history.join('\n');
                await send.text(from, message, msg);
            } else {
                if (!session.get(from)) throw new Error(`No active game. Start one with \`${cache.configs.prefix}chess start\``);
                if (!data.players.includes(userid)) throw new Error("You are not a player in this game.");
                if (data.players[data.game?.turn() === 'w' ? 0 : 1] !== userid || data.players.length < 2) throw new Error("Invalid turn.");
                let move;
                try { move = data.game.move(text.replace('chess', '').trim()) } catch (e) { throw new Error("Invalid move") }
                data.time = Date.now();
                if (data.game.isCheckmate()) data.status = 'win';
                else if (data.game.isDraw()) data.status = 'draw';
                else if (data.game.isCheck()) data.status = 'check';
                else data.status = 'active';
                const board = await _functions.get_board('chess', data.game);
                await send.image(from, board.image, `*${move.san}.*\n\n*White:* @${data.players[0].split('@')[0]}\n*Black:* @${data.players[1].split('@')[0]}\n\n${board.text}\n\n> *Status:* ${data.status}\n> *${data.status === 'active' || data.status === 'check' ? 'Next' : 'Winner'}:* ${data.status === 'active' || data.status === 'check' ? data.game.turn() === 'w' ? 'White' : 'Black' : data.status === 'win' ? `@${userid.split('@')[0]}` : '_none_'}`, msg, data.players);
                data.history.push(move.san);
                if (data.game.isGameOver()) session.delete(from);
            }
        } catch (error) {
            console.error('Error in chess:', error.message);
            send.text(from, error.message, msg);
        } finally {
            this.sessions.chess = session;
        }
    }
}

export const _casual = new Casual();