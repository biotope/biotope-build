import Component, { HTMLFragment } from '@biotope/element';

class BioWorld extends Component {
  public static componentName = 'bio-world';

  public render(): HTMLFragment {
    return this.html`
      <span>Hello World!<span>
    `;
  }
}

export { BioWorld };
