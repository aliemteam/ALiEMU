module.exports = {
  entry: {
    'aliemu-plugins/inc/Dashboards/EducatorDashboard/EducatorDashboard': './wp-content/plugins/aliemu-plugins/inc/Dashboards/EducatorDashboard/EducatorDashboard.tsx',
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
    ],
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js'],
  },
};
