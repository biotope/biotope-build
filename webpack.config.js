module.exports = {
    watch: false,
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: ['/node_modules/']
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                },
                exclude: ['/node_modules/']
            }
        ]
    }
};