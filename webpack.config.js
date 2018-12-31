const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = {
  entry: {
    app: './app/scripts/index.js',
    classie: './app/scripts/classie.js',
    dynamics: './app/scripts/dynamics.js',
    main: './app/scripts/main.js',
    login: './app/scripts/login.js'
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: 'index.html' },
      { from: './app/personal.html', to: 'personal.html' },
      { from: './app/fight.html', to: 'fight.html' },
      { from: './app/character.html', to: 'character.html' },
      { from: './app/addMoney.html', to: 'addMoney.html' },
      { from: './app/addCharacter.html', to: 'addCharacter.html' },
      { from: './app/login.html', to: 'login.html'}
    ])
  ],
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.css$/, use: [ 'style-loader', 'css-loader', 'sass-loader' ] },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
          plugins: ['transform-react-jsx', 'transform-object-rest-spread', 'transform-runtime']
        }
      },
      {
        test: /\.(gif|png|jpg|woff|svg|ttf|eot)$/,
        // loader: "style-loader!css-loader"
        // loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        use: [
          {loader: 'url-loader?limit=2048'}
        ]
            
            
        
      },
      {
        test: /\.(htm|html)$/i,
         use:[ 'html-withimg-loader'] 
      },
      { test: /[\\\/]bower_components[\\\/]modernizr[\\\/]modernizr\.js$/,
        loader: "imports?this=>window!exports?window.Modernizr" }
    ]
  }
}

