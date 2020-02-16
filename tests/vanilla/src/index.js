import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import { classes } from './style';
import json from './assets/static.json';

const toggleImage = (target) => () => {
  target.classList.toggle(classes.withImage);
  target.classList.toggle(classes.withBase64);
};

const addElementTo = (parent, text) => {
  const element = document.createElement('div');
  element.innerHTML = text;
  parent.appendChild(element);
};

(async () => {
  const contentElement = document.getElementById('content');
  const toggleButton = document.getElementById('toggle');

  document.body.classList.add(classes.withBase64);
  toggleButton.addEventListener('click', toggleImage(document.body));

  addElementTo(contentElement, `-> ${(json && json.text) || ''} <-`);

  const response = await fetch('resources/copied-resource.txt');
  const result = await response.text();
  addElementTo(contentElement, result);
})();
