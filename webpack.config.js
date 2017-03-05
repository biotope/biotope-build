var excludes = [
    '/node_modules/',
    '/patterns/',
    '/dist/',
    '/test/',
    '/.tmp/'
];

var babelOptions = {
    babelrc: false,
    cacheDirectory: true,
    presets: [
        'es2015',
        'react'
    ]
};

module.exports = {
    watch: false,

    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.jsx']
    },

    externals: {
        jquery: 'jQuery',
        react: 'React',
        'react-dom': 'ReactDOM'
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
                        loader: 'babel-loader',
                        options: babelOptions
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                target: 'es2015'
                            }
                        }
                    }
                ],
                exclude: excludes
            }
        ]
    }
};
