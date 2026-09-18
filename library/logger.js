import { createWriteStream, mkdirSync } from "fs";
import { format } from "util";

export default function logger() {
    mkdirSync(process.cwd() + '/logs', { recursive: true });

    const stream = createWriteStream("./logs/full.log", { flags: "a" });

    function write(type, args) {
        stream.write(`${new Date().toISOString()} [${type}] - ${format(...args)}\n`);
    }

    const LOG = console.log;
    const ERROR = console.error;
    const WARN = console.warn;

    console.log = (...args) => {
        write("LOG", args);
        LOG(...args);
    };

    console.error = (...args) => {
        write("ERROR", args);
        ERROR(...args);
    };

    console.warn = (...args) => {
        write("WARN", args);
        WARN(...args);
    }
}