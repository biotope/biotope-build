import style from './style.scss';

export const logStyle = (): void => {
  /* eslint-disable no-console */
  console.log('full object:', style);
  console.log('accessed by kebab:', style['my-cute-class']);
  console.log('accessed by camel:', style.myCuteClass);
  console.log('full style:', style.default);
  /* eslint-enable no-console */

  const styleElement = document.createElement('style');
  styleElement.innerHTML = style.default;
  document.head.appendChild(styleElement);

  document.querySelector('#root').innerHTML = `
    <div class="${style.myCuteClass}">
      <p>color is: ${COLORS.PRIMARY} (${typeof COLORS.PRIMARY})</p>
      <p>z-index is: ${LAYERS.PRIORITY} (${typeof LAYERS.PRIORITY})</p>
    </div>
  `;
};
