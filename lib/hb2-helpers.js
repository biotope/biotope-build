const config = require('./../config');
const colors = require('colors/safe');
const _ = require('lodash');

module.exports = (handlebars) => {
    /**
     * defines a default variable value, that gets overwritten by context data
     */
    handlebars.registerHelper('bioDef', function (a, b) {
        return a ? a : b;
    });


    /**
     * creates image src for generated assets
     */
    handlebars.registerHelper('bioImg', function (width, height, src) {
        const splitSrc = src.split('.');
        const fileEnding = splitSrc.pop();
        return '_assets/generated/' + splitSrc.join() + '_' + width + 'x' + height + '.' + fileEnding;
    });

    /**
     * creates fill text
     */
    handlebars.registerHelper('bioText', function (count, max) {
        if (max !== 0 && typeof max !== 'undefined' && max > count) {
            count = Math.floor(Math.random() * max) + count;
        }
        let text = 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now. When, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream; and, as I lie close to the earth, a thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath of that universal love which bears and sustains us, as it floats around us in an eternity of bliss; and then, my friend, when darkness overspreads my eyes, and heaven and earth seem to dwell in my soul and absorb its power, like the form of a beloved mistress, then I often think with longing, Oh, would I could describe these conceptions, could impress upon paper all that is living so full and warm within me, that it might be the mirror of my soul, as my soul is the mirror of the infinite God! O my friend -- but it is too much for my strength -- I sink under the weight of the splendour of these visions! ';
        text = text + text + text;
        return text.substr(0, count);
    });

    /**
     * defines a code block to allow curly brackts for other frameworks
     * use with {{{{code}}}} {{{{/code}}}} (4 curly brackets for literal string contents)
     */
    handlebars.registerHelper('bioCode', function (content) {
        return content.fn();
    });

    /**
     * stringify an json/js object for debugging
     */
    handlebars.registerHelper('bioStringify', function (object) {
        return JSON.stringify(object);
    });

    /**
     * stringify an json/js object for debugging
     */
    handlebars.registerHelper('bioParseJSON', function (data, options) {
        return options.fn(JSON.parse(data));
    });

    /**
     * include a partial
     */
    handlebars.registerHelper('bioInclude', function (partialName, context) {
        if (typeof partialName !== 'string') {
            return '';
        }

        const partials = handlebars.partials;
        let partial = partials[partialName];

        if (typeof partial !== 'function') {
            partial = handlebars.compile(partial);
        }

        // if partial doesn't exist use block failover
        if (!partial) {
            console.log(colors.red('partial ', partialName, ' not found: block helper fallback will be used'));
            return context.fn(this);
        }

        let objectData = {};

        if (config.global.debug) {
            console.log(colors.green(`[hbs-helpers] partialName: ${partialName}`));
        }

        if (context.hash.hasOwnProperty('object')) {
            if (typeof context.hash.object === 'string') {
                objectData = JSON.parse(context.hash.object);
            }
            if (typeof context.hash.object === 'object') {
                objectData = context.hash.object;
            }

            if (config.global.debug && Object.keys(objectData).length > 0) {
                console.log(colors.green(`objectData: ${JSON.stringify(objectData)}`));
            }
        }

        const partialData = {};
        _.extend(partialData, this);
        _.extend(partialData, objectData);
        _.extend(partialData, context.hash);

        if (config.global.debug) {
            console.log(colors.green(`DATA: ${JSON.stringify(partialData)}`));
        }

        return new handlebars.SafeString(partial(partialData));
    });

    /**
     * {{#bioCompare}}...{{/bioCompare}}
     *
     * @credit: OOCSS
     * @param left value
     * @param operator The operator, must be between quotes ">", "==", "<=", etc...
     * @param right value
     * @param options option object sent by handlebars
     * @return {String} formatted html
     *
     * @example:
     * {{#bioCompare unicorns "<" ponies}}
     * I knew it, unicorns are just low-quality ponies!
     * {{/bioCompare}}
     *
     * {{#bioCompare value ">=" 10}}
     * The value is greater or equal than 10
     * {{else}}
     * The value is lower than 10
     * {{/bioCompare}}
     */
    handlebars.registerHelper('bioCompare', function (left, operator, right, options) {
        /*jshint eqeqeq: false*/
        if (arguments.length < 3) {
            throw new Error('Handlebars Helper "bioCompare" needs 2 parameters');
        }
        if (options === undefined) {
            options = right;
            right = operator;
            operator = '===';
        }
        var operators = {
            '==': function (l, r) {
                return l == r;
            },
            '===': function (l, r) {
                return l === r;
            },
            '!=': function (l, r) {
                return l != r;
            },
            '!==': function (l, r) {
                return l !== r;
            },
            '<': function (l, r) {
                return l < r;
            },
            '>': function (l, r) {
                return l > r;
            },
            '<=': function (l, r) {
                return l <= r;
            },
            '>=': function (l, r) {
                return l >= r;
            },
            'typeof': function (l, r) {
                return typeof l == r;
            }
        };
        if (!operators[operator]) {
            throw new Error('Handlebars Helper "bioCompare" doesn\'t know the operator ' + operator);
        }
        var result = operators[operator](left, right);
        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    /**
     * allows math operations between two values
     * {{math 10 '+' 15}} returns 25
     * {{math 15 '-' 10}} returns 5
     * {{math 10 '/' 2}} returns 5
     * {{math 5 '*' 10}} returns 50
     * {{math 10 '%' 3}} returns 1
     */
    handlebars.registerHelper("bioMath", function(lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    });

};
