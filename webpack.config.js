module.exports = {
  entry: './src/frontend/index.tsx',
  output: {
    filename: 'bundle.min.js',
    path: `${__dirname}/build`,
  },
  devtool: 'source-map',
  devServer: {
    contentBase: `${__dirname}/build`,
    compress: true,
    port: 3001,
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.json',
      '.gif',
      '.png',
      '.jpg',
      '.jpeg',
      '.svg',
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.webpack.json',
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
};
