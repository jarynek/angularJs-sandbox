module.exports = {
    watch: true,
    mode: 'development',
    entry: {
        homepage: './ts/homepage.ts',
        tasks: './ts/tasks.ts',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: '[name].js'
    }
};