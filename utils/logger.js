import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../../access.log"),
  { flags: "a" }
);

// Custom token for request body
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

// Development format
const devFormat = ":method :url :status :response-time ms - :body";

// Production format
const prodFormat = ":remote-addr - :method :url :status :response-time ms";

export const logger = morgan(
  process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  {
    stream:
      process.env.NODE_ENV === "production" ? accessLogStream : process.stdout,
    skip: (req) => req.path === "/healthcheck",
  }
);

// Error logger
export const errorLogger = (err, req, res, next) => {
  const log = `${new Date().toISOString()} - ${err.stack || err.message}\n`;
  fs.appendFileSync(path.join(__dirname, "../../error.log"), log);
  next(err);
};
