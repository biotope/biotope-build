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
        extensions: ['.js', '.ts', '.tsx', '.jsx', '.scss']
	},

	externals: {
        jquery: 'jQuery'
    },

    // devtool: 'source-map',

    module: {
        rules: [
			{
				test: /\.scss$/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader"
					},
					{
						loader: "sass-loader"
					}
				]
			},
			{
				test: /\.(ts|tsx)$/,
				loader: 'ts-loader',
				exclude: excludes
			},
			{
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    }
                ],
                exclude: excludes
            }
        ]
    }
};
