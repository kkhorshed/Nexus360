import winston from 'winston';
import config from '../config';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create a write stream for Morgan
export const logStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

export const logger = winston.createLogger({
  level: config.logLevel,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// If we're not in production, log to the console with colors
if (config.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}
