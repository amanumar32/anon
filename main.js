import { cache, recache } from "./init.js";
import Send from "./library/send.js";

class Main {
    constructor(sock) {
        this.sock = sock;
        this.send = new Send(sock);
        this.startTime = Date.now();
    }
    async init() {
        try {
            console.log('Bot connected successfully!');
            await this.send.text(cache.configs.user.id, `*✅ Bot Activated*\n\nTime: ${new Date().toLocaleString()}`);
            setInterval(() => recache(null, 'update'), 5 * 60 * 1000);
        } catch (error) {
            console.error('Error starting bot:', error.message);
        }
    }
    async event(update) { }
    async message(messages, type) { }
}

export default Main;