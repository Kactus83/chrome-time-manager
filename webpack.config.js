const path = require('path');

module.exports = {
    entry: {
        'src/background/index': './src/background/index.ts',
        'src/pop-up/index': './src/pop-up/index.ts',
        'src/dashboard/index': './src/dashboard/index.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '.'),
    },
};
