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
            const mode = (() => { switch (text.replace('chess', '').trim()) { case 'start': return 'start'; case 'quit': return 'quit'; case 'join': return 'join'; case 'board': return 'board'; case 'history': return 'history'; case 'help': return 'help' } })();
            const usage = `*Usage:*\n\n- ${cache.configs.prefix}chess start - start a new chess game.\n- ${cache.configs.prefix}chess join - join an existing chess game\n- ${cache.configs.prefix}chess quit - resign from the current game\n- ${cache.configs.prefix}chess history - see the full game history\n- ${cache.configs.prefix}chess board - display the current game board\n- ${cache.configs.prefix}chess help - display the chess help list\n- Send a valid sans chess move to perform a move (e.g., e2e4)`;
            const data = session.get(from) || { time: Date.now(), players: [], game: null, history: [], status: '' };
            if (mode === 'start') {
                if (cache.configs.mode !== 'public' && !cache.database.data.sudo.length) throw new Error(`Public mode required to start a chess game. Send \`${cache.configs.prefix}mode public\` to continue.`);
                if (session.has(from)) throw new Error("A game is already in progress.");
                data.players.push(userid);
                data.status = 'pending';
                session.set(from, data);
                setTimeout(() => {
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
                try { move = data.game.move(text.trim()) } catch (e) { throw new Error("Invalid move") };
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
    async wordlink(send, text, from, msg, userid) {
        const session = this.sessions.wordlink;
        try {
            const mode = (() => { switch (text.replace('wordlink', '').trim()) { case 'start': return 'start'; case 'quit': return 'quit'; case 'join': return 'join'; case 'help': return 'help' } })();
            const usage = `*Usage:*\n\n- ${cache.configs.prefix}wordlink start - start a new wordlink game.\n- ${cache.configs.prefix}wordlink join - join an existing wordlink game\n- ${cache.configs.prefix}wordlink quit - resign from the current game\n- ${cache.configs.prefix}wordlink help - display the wordlink help list\nSend a word to play (no prefix needed).`;
            const data = session.get(from) || { time: Date.now(), players: [], next: '', conditions: { character: '', length: '' }, status: '', round: 1 };
            const conditions = () => { data.conditions = { character: 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 'abcdefghijklmnopqrstuvwxyz'.length)], length: Math.floor(Math.random() * 6) + 3 } };
            function next_player(next, remove = true) {
                if (remove) data.players = data.players.filter(p => p !== next);
                data.next = data.players[(data.players.indexOf(next) + 1 > data.players.length - 1) ? data.players[0] : data.players.indexOf(next)];
                if (data.next === data.players[0]) data.round += 1;
                if (data.players.length === 1) data.status = 'win';
                conditions();
            }
            function start_timeout(next) {
                setTimeout(() => {
                    if (next === data.next) {
                        next_player(next);
                        send.text(from, `@${next.split('@')[0]} ran out of time.\n\n*Round:* ${data.round}\n*Character:* ${data.status === 'win' ? '_null_' : data.conditions.character}\n*Length:* ${data.status === 'win' ? '_null_' : data.conditions.length}\n\n> *Status:* ${data.status}\n> *${data.status === 'win' ? 'Winner' : 'Next'}:* ${data.next}`, msg, [data.players]);
                    }
                }, 60 - ((data.round - 1) * 10))
            }
            function start_game() {
                data.status = 'active';
                conditions();
                send.text(from, `Game started.\n\n*Round:* ${data.round}\n*Character:* ${data.conditions.character}\n*Length:* ${data.conditions.length}\n\n> *Status:* active\n> *Next:* ${data.next}`, msg, [data.players]);
                start_timeout(data.next);
            }
            if (mode === 'start') {
                if (session.has(from)) throw new Error("A game is already in progress.");
                data.players.push(userid);
                data.status = 'pending';
                data.next = userid;
                session.set(from, data);
                setTimeout(() => {
                    if (data.status === 'pending') {
                        if (data.players.length < 2) {
                            session.delete(from);
                            throw new Error("Pending game has been deleted due to lack of activity.");
                        } else start_game();
                    }
                }, 1000 * 60 * 5);
                send.text(from, `Wordlink game started by @${userid.split('@')[0]}. Type \`${cache.configs.prefix}wordlink join\` to join the game.\n\n> Game will start with 6 players or automatically, after 5 minutes.`, msg, [userid]);
            } else if (mode === "join") {
                if (data.status !== 'pending') throw new Error("No pending games in this chat.");
                data.players.push(userid);
                data.players.length >= 6 ? start_game() : send.text(from, `@${userid.split('@')[0]} joined the game.\n\n*Players:*\n\n${data.players.map(p => `- @${p.split('@')[0]}`).join('\n')}`, msg, [data.players]);
            } else if (mode === "help") {
                send.text(from, usage, msg);
            } else if (mode === 'quit') {
                next_player(userid);
                start_timeout(data.next);
                send.text(from, `@${userid.split('@')[0]} quit.\n\n*Round:* ${data.round}\n*Character:* ${data.status === 'win' ? '_null_' : data.conditions.character}\n*Length:* ${data.status === 'win' ? '_null_' : data.conditions.length}\n\n> *Status:* ${data.status}\n> *${data.status === 'win' ? 'Winner' : 'Next'}:* ${data.next}`, msg, [data.players]);
            } else {
                if (!session.get(from)) throw new Error("No pending games in this chat.");
                if (!data.players.includes(userid)) throw new Error("You are not a player in this game.");
                if (data.next !== userid) throw new Error("Invalid turn.");
                const word = text.trim();
                const response = await axios.get(`https://api.datamuse.com/words?sp=${word}`).catch(() => { });
                let issue = '';
                if (!word.startsWith(data.conditions.character)) issue = `"${word}" doesn't start with *${data.conditions.character}*.`;
                else if (word.length < data.conditions.length) issue = `"${word}" doesn't have up to *${data.conditions.length}* characters.`;
                else if (response.data[0]?.word?.toLowerCase() !== word || !response.data[0]) issue = `"${word}" is not a valid English word.`;
                if (issue) throw new Error(issue);
                next_player(userid, false);
                start_timeout(data.next);
                send.text(from, `@${userid.split('@')[0]} scored with "${word}"\n\n*Round:* ${data.round}\n*Character:* ${data.status === 'win' ? '_null_' : data.conditions.character}\n*Length:* ${data.status === 'win' ? '_null_' : data.conditions.length}\n\n> *Status:* ${data.status}\n> *${data.status === 'win' ? 'Winner' : 'Next'}:* ${data.next}`, msg, [data.players]);
            }
        } catch (error) {
            console.error('Error in wordlink:', error.message);
            send.text(from, error.message, msg);
        } finally {
            this.sessions.wordlink = session;
        }
    }
    async ttt(send, text, from, msg, userid) {
        const session = this.sessions.ttt;
        try {
            const mode = (() => { switch (text.replace('ttt', '').trim()) { case 'start': return 'start'; case 'quit': return 'quit'; case 'join': return 'join'; case 'help': return 'help' } })();
            const usage = `*Usage:*\n\n- ${cache.configs.prefix}ttt start - start a new tic-tac-toe game.\n- ${cache.configs.prefix}ttt join - join an existing tic-tac-toe game\n- ${cache.configs.prefix}ttt quit - resign from the current game\n- ${cache.configs.prefix}ttt help - display the tic-tac-toe help list\n- Send a number (1 - 9) to perform a move`;
            const data = session.get(from) || { time: Date.now(), players: [], game: null, status: '' };
            if (mode === 'start') {
                if (session.has(from)) throw new Error("A game is already in progress.");
                data.players.push(userid);
                data.status = 'pending';
                session.set(from, data);
                setTimeout(() => {
                    if (data.status === 'pending') {
                        session.delete(from);
                        throw new Error("Pending game has been deleted due to lack of activity.");
                    }
                }, 1000 * 60 * 5);
                send.text(from, `Tic-tac-toe game started by @${userid.split('@')[0]}. Type \`${cache.configs.prefix}ttt join\` to join the game.`, msg, [userid]);
            } else if (mode === 'join') {
                if (data.status !== 'pending') throw new Error("No pending games in this chat.");
                data.players.push(userid);
                data.status = 'active';
                data.game = Array(9).fill(null);
                data.time = Date.now();
                session.set(from, data);
                setTimeout(() => {
                    if (session.has(from) && Date.now() - session.get(from).time >= 1000 * 60 * 15) {
                        session.delete(from);
                        throw new Error(`Current game deleted due to lack of activity. Start a new game with \`${cache.configs.prefix}ttt start\`.`);
                    }
                }, 1000 * 60 * 15);
                const board = await _functions.get_board('ttt', data.game);
                await send.text(from, usage, null, data.players);
                await send.image(from, board.image, `*Tic-tac-toe game started.*\n\n*X:* @${data.players[0].split('@')[0]}\n*O:* @${data.players[1].split('@')[0]}\n\n${board.text}\n\n> *Status:* ${data.status}\n> *Next:* X`, msg, data.players);
            } else if (mode === 'quit') {
                if (!session.has(from)) throw new Error("No active game in this chat.");
                if (!data.players.includes(userid)) throw new Error("You are not a player in this game.");
                const winner = data.players[userid === data.players[0] ? 1 : 0];
                const board = await _functions.get_board('ttt', data.game);
                await send.image(from, board.image, `*Surrender*.\n\n*X:* @${data.players[0].split('@')[0]}\n*O:* @${data.players[1].split('@')[0]}\n\n${board.text}\n\n> *Status:* surrender\n> *Winner:* @${winner.split('@')[0]}`, msg, data.players);
                session.delete(from);
            } else if (mode === 'help') {
                send.text(from, usage, msg);
            } else {
                if (!session.has(from)) throw new Error("No active game in this chat.");
                if (!data.players.includes(userid)) throw new Error("You are not a player in this game.");
                const symbol = data.players.indexOf(userid) === 0 ? 'X' : 'O';
                if ((data.game.filter(cell => cell !== null).length % 2 === 0 ? 'X' : 'O') !== symbol) throw new Error("Invalid turn.");
                const move = parseInt(text.trim()) - 1;
                if (isNaN(move) || move < 0 || move > 8) throw new Error("Invalid move. Please provide a number between 1 and 9.");
                if (data.game[move] !== null) throw new Error("This cell is already occupied.");
                data.game[move] = symbol;
                data.time = Date.now();
                const board = await _functions.get_board('ttt', data.game);
                if ([[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].some(pattern => pattern.every(index => data.game[index] === symbol))) data.status = 'win';
                else if (data.game.every(cell => cell !== null)) data.status = 'draw';
                else data.status = 'active';
                await send.image(from, board.image, `*${symbol} -> ${move + 1}*\n\n*X:* @${data.players[0].split('@')[0]}\n*O:* @${data.players[1].split('@')[0]}\n\n${board.text}\n\n> *Status:* ${data.status}\n> *${data.status === 'active' ? 'Next' : 'Winner'}:* ${data.status === 'active' ? `${symbol === 'X' ? 'O' : 'X'} ` : data.status === 'win' ? `@${userid.split('@')[0]} ` : '_none_'}`, msg, data.players);
                if (['win', 'draw'].includes(data.status)) session.delete(from);
            }
        } catch (error) {
            console.error('Error in ttt:', error.message);
            send.text(from, error.message, msg);
        } finally {
            this.sessions.ttt = session;
        }

    }
    async hangman(send, text, from, msg, userid) {
        const session = this.sessions.hangman;
        try {
            throw new Error("> This feature is still under development");
        } catch (error) {
            console.error('Error in hangman:', error.message);
            send.text(from, error.message, msg);
        } finally {
            this.sessions.hangman = session;
        }
    }
}

export const _casual = new Casual();