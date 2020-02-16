import styleInject from 'style-inject';
import style from './index.scss';

styleInject(style.default);

export const classes = Object.keys(style)
  .filter((key) => key !== 'default')
  .reduce((accumulator, key) => ({
    ...accumulator,
    [key]: style[key],
  }), {});
