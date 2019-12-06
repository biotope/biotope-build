import Component, { HTMLFragment } from '@biotope/element';

class BioWorld extends Component {
  public static componentName = 'bio-world';

  public render(): HTMLFragment {
    return this.html`
      <p>Hello <slot /> World!<p>
    `;
  }
}

export { BioWorld };
