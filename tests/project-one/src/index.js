import classnames from 'classnames';
import { camelCase } from 'change-case';
import { answer } from 'question';
import { logStyle } from './style';
import { logger } from './logger';
import { errorLogger } from './error';

console.log(ENVIRONMENT);
console.log(process.env.NODE_ENV);
console.log(`ENVIRONMENT-${`${ENVIRONMENT}-${answer}-${ENVIRONMENT}`}-ENVIRONMENT`);

// This next part ensures that the word "ENVIRONMENT" is not replaced in comments and strings
// HELLO ENVIRONMENT
// // // HELLO ENVIRONMENT
/* HELLO ENVIRONMENT */
/* /* HELLO ENVIRONMENT */
console.log('MY ENVIRONMENT !!!');

logStyle();

if (process.env.NODE_ENV === 'production') {
  logger(camelCase('hello development!'));
} else {
  logger(camelCase('hello production!'));
}

errorLogger(classnames('hello ERROR world!', { yay: true }));
