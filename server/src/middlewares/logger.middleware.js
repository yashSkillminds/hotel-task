import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.json(),
  transports: [
    // logs with level error or higher here
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
    }),

    // logs with level info or higer here
    new winston.transports.File({
      filename: './logs/combined.log',
    }),
  ],
});

// when not in production print the logs on console
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}
