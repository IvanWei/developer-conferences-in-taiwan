const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;

const isDevMode = NODE_ENV === 'development';
const indexTitle = 'Developer Conferences in Taiwan ' + new Date().getFullYear();

let config = {
  mode: NODE_ENV,
  entry: {
    app: ['./src'],
  },
  output: {
    path: path.resolve(__dirname, './docs'),
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: indexTitle,
      template: path.resolve('./src', 'calendar.pug'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader'
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
};

if (NODE_ENV === 'development') {
  config['devtool'] = 'eval-source-map';
  config['devServer'] = {
    port: 8000,
    compress: true,
    hot: true,
    inline: true,
    open: false,
  };
} else {
  config['devServer'] = {
    contentBase: path.join(__dirname, "docs"),
    port: 8000,
    compress: true,
    hot: true,
    inline: true,
    open: false,
  };
}
module.exports = config;
