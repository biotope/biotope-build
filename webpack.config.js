var excludes = [
    '/node_modules/',
    '/patterns/',
    '/dist/',
    '/.tmp/'
];

module.exports = {
    watch: false,

    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.jsx']
    },

    externals: {
        "jquery": "jQuery",
        "react": "React",
        "react-dom": "ReactDom"
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
                        options: {
                            cacheDirectory: true
                        }
                    }
                ],
                exclude: excludes
            },
            {
                test: /\.tsx$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ],
                exclude: excludes
            }
        ]
    }
};
