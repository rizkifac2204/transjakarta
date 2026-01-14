// libs/getLogs.js
import pino from "pino";
import fs from "fs";
import path from "path";
import { createStream } from "rotating-file-stream";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const streams = {}; // cache per fileName

const getLogs = (fileName = "application") => {
  if (streams[fileName]) return streams[fileName];

  const stream = createStream(
    (time, index) => {
      if (!time) return `${fileName}-latest.log`;
      const date = new Date(time);
      return `${fileName}-${date.toISOString().slice(0, 10)}.log`;
    },
    {
      path: logDir,
      size: "10M", // rotate every 10 MegaBytes written
      interval: "1d", // rotate daily
      compress: "gzip", // compress rotated files
    }
  );

  const logger = pino(
    {
      level: "error",
      base: { service: "my-app" },
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label) => ({ level: label }),
      },
      messageKey: "msg",
      serializers: {
        err: (err) => {
          return {
            message: err.message,
            stack: err.stack?.split("\n").slice(0, 3).join(" "), // hanya 3 baris stack
          };
        },
      },
    },
    stream
  );

  streams[fileName] = logger;
  return logger;
};

export default getLogs;
