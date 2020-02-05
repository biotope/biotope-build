import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import json from './assets/static.json';

const addToBody = (text) => {
  const element = document.createElement('div');
  element.innerHTML = text;
  document.body.appendChild(element);
};

addToBody(`"${(json && json.text) || ''}"`);

(async () => {
  const response = await fetch('resources/copied-resource.txt');
  const result = await response.text();
  addToBody(result);
})();
