const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = env => {
  return {
    mode: 'development',
    entry: [
      'core-js/modules/es.promise',
      'core-js/modules/es.array.iterator',
      path.resolve(__dirname, 'src/index.js')
    ],
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true,
      writeToDisk: true
    },
    output: {
      filename: '[name].[hash].bundle.js',
      chunkFilename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    optimization: {
      moduleIds: 'hashed',
      runtimeChunk: 'single',
      usedExports: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'your app',
        template: 'index.html'
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
      })
      // TODO set up to work in production env
      // new WorkboxPlugin.GenerateSW({
      //   // these options encourage the ServiceWorkers to get in there fast
      //   // and not allow any straggling "old" SWs to hang around
      //   clientsClaim: true,
      //   skipWaiting: true
      // })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.(sa|sc|c)ss$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [
            process.env.NODE_ENV !== 'production'
              ? { loader: 'style-loader', options: {} }
              : {
                  loader: MiniCssExtractPlugin.loader
                },
            { loader: 'css-loader', options: {} },
            { loader: 'postcss-loader', options: {} },
            {
              loader: 'resolve-url-loader',
              options: {}
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: ['file-loader']
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: ['file-loader']
        },
        {
          test: /\.(csv|tsv)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: ['csv-loader']
        },
        {
          test: /\.xml$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: ['xml-loader']
        }
      ]
    }
  };
};
