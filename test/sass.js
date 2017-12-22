import test from 'ava';
import {fromString} from './helpers/pipe';

import sass from '../pipes/sass';
import cleanCss from '../pipes/cleanCss';

test('simple variable', t => {
    const input = '$foo: red; body { background: $foo; }';
    const expected = 'body {\n  background: red; }\n\n/*# sourceMappingURL=style.css.map */\n';

    return fromString(input, 'style.scss', sass)
        .then(output => {
            const contents = output.contents.toString();
            t.is(contents, expected, 'Sass compiled as expected');
        });
});

test('bem element', t => {
    const input = '.test { &__headline { color: #fff; } }';
    const expected = '.test__headline {\n  color: #fff; }\n\n/*# sourceMappingURL=style.css.map */\n';

    return fromString(input, 'style.scss', sass)
        .then(output => {
            const contents = output.contents.toString();
            t.is(contents, expected, 'Sass compiled as expected');
        });
});

test('percentage helper', t => {
    const input = '.test { width: percentage( 0.5 ); }';
    const expected = '.test {\n  width: 50%; }\n\n/*# sourceMappingURL=style.css.map */\n';

    return fromString(input, 'style.scss', sass)
        .then(output => {
            const contents = output.contents.toString();
            t.is(contents, expected, 'Sass compiled as expected');
        });
});

test('percentage digits after the decimal point', t => {
    const input = '.test { width: percentage( 1/3 ); }';
    const expected = '.test {\n  width: 33.33333%; }\n\n/*# sourceMappingURL=style.css.map */\n';

    return fromString(input, 'style.scss', sass)
        .then(output => {
            const contents = output.contents.toString();
            t.is(contents, expected, 'Expected 5 digits after the decimal point');
        });
});

test('autoprefixer', t => {
    const input = '.pref { transform: rotate(180deg); }';
    const expected = '.pref {\n  -webkit-transform: rotate(180deg);\n      -ms-transform: rotate(180deg);\n          transform: rotate(180deg); }\n\n/*# sourceMappingURL=style.css.map */\n';

    return fromString(input, 'style.scss', sass)
        .then(output => {
            const contents = output.contents.toString();
            t.is(contents, expected, 'Sass compiled as expected');
        });
});

test('empty input', t => {
    const input = '';
    const expected = '\n/*# sourceMappingURL=style.css.map */\n';

    return fromString(input, 'style.scss', sass)
        .then(output => {
            const contents = output.contents.toString();
            t.is(contents, expected, 'Sass compiled as expected');
        });
});

test('minified css', t => {
    const input = '$foo: red; body { background: $foo; }';
    const expected = 'body{background:red}';

    return fromString(input, 'style.scss', sass.pipe(cleanCss))
        .then(output => {
            const contents = output.contents.toString();
            t.is(contents, expected, 'Sass compiled as expected');
        });
});