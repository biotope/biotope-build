import React from 'react';
import style from './ts-react-hello.scss';

export class TsReactHello extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  public render(): JSX.Element {
    return (
      <div>
        <div>{PLACEHOLDERS.TS_REACT} <span className={style.reactSuccess}>OK</span></div>
        <style>{style.default}</style>
      </div>
    );
  }
}
