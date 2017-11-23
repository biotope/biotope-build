var excludes = [
    '/node_modules/',
    '/patterns/',
    '/dist/',
    '/test/',
    '/.tmp/'
];

var babelOptions = {
    babelrc: false,
    presets: [
        'env'
    ]
};

module.exports = {
    watch: false,

    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.jsx']
    },

    externals: {
        jquery: 'jQuery'
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: excludes
            },
            {
                test: /\.jsx$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    }
                ],
                exclude: excludes
            },
            {
                test: /\.tsx$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ],
                exclude: excludes
            }
        ]
    }
};
