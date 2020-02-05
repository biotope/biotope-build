import React from 'react';
import style from './js-react-hello.css';

export const JsReactHello = () => (
  <div>
    <div>
      <span>{PLACEHOLDERS.JS_REACT}</span>&nbsp;
      <span className={style.reactSuccess}>OK</span>
    </div>
    <style>{style.default}</style>
  </div>
);
