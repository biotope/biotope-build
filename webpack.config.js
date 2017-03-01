module.exports = {
    watch: false,
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.jsx']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: ['/node_modules/']
            },
            {
                test: /\.(j|t)sx$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                },
                exclude: ['/node_modules/']
            }
        ]
    }
};