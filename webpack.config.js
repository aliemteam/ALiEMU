module.exports = {
    entry: {
        'aliemu-plugins/inc/dashboards/educator-dashboard/EducatorDashboard': './wp-content/plugins/aliemu-plugins/inc/dashboards/educator-dashboard/EducatorDashboard.tsx',
    },
    output: {
        filename: '[name].js',
        path: __dirname,
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'babel?presets[]=es2015,presets[]=react!ts',
            },
            {
                test: /\.css$/,
                loader: 'style!css',
            },
        ],
    },
    resolve: {
        extensions: ['', '.ts', '.tsx', '.js'],
    },
};
