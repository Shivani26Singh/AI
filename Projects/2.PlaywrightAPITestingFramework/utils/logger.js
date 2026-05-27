const fs = require('fs');
const path = require('path');

const LOG_DIR = path.resolve(__dirname, '..', 'reports', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'test-execution.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function timestamp() {
  return new Date().toISOString();
}

function log(level, message, data = null) {
  const entry = {
    timestamp: timestamp(),
    level,
    message,
    data,
  };
  const line = JSON.stringify(entry);
  fs.appendFileSync(LOG_FILE, line + '\n');

  if (level === 'ERROR') {
    console.error(`[${timestamp()}] [${level}] ${message}`);
  } else {
    console.log(`[${timestamp()}] [${level}] ${message}`);
  }
}

const logger = {
  info: (message, data) => log('INFO', message, data),
  warn: (message, data) => log('WARN', message, data),
  error: (message, data) => log('ERROR', message, data),
  debug: (message, data) => log('DEBUG', message, data),
};

module.exports = logger;
