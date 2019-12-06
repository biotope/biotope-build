import classnames from 'classnames';
import { camelCase } from 'change-case';
import { logStyle } from './style';
import { logger } from './logger';
import { errorLogger } from './error';

logStyle();
logger(camelCase('hello world!'));
errorLogger(classnames('hello ERROR world!', { yay: true }));
