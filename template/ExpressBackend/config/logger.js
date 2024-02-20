const { createLogger, format, transports } = require("winston");
const { combine, timestamp, colorize, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] : ${message} `;
});

const developmentLogger = () => {
  return createLogger({
    level: "debug",
    format: combine(
      colorize(),
      timestamp({ format: "MMM dd YYYY  HH:MM:SS :" }),
      myFormat
    ),
    transports: [new transports.Console()],
  });
};

const productionLogger = () => {
  return createLogger({
    level: "info",
    format: combine(
      colorize(),
      timestamp({ format: "ddd MMM dd YYYY h :m:s tt" }),
      myFormat
    ),
    transports: [
      new transports.File({ filename: "error.log", level: "error" }),
      new transports.File({ filename: "combined.log" }),
    ],
  });
};

let logger = null;

// *Logger for Development Env.
if (process.env.NODE_ENV == "development") {
  logger = developmentLogger();
}

//*Logger for Production ENV.
if (process.env.NODE_ENV == "production") {
  logger = productionLogger();
}

module.exports = logger;

// *In Production add this code to transport to store logs in file
// @new winston.transports.File({ filename: "error.log", level: "error" }),
// @new winston.transports.File({ filename: "combined.log" }),
