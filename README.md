# Battleship 2 | Client repository
This is the client-side repository of the `Battleship 2` game.
The server (NodeJS) repository is hosted at [https://github.com/battleship2/battleship2.0-server](https://github.com/battleship2/battleship2.0-server).

## Dependencies
The client relies on several well-known libraries such as:
- [Socket.IO](http://socket.io/)
- [Karma](https://karma-runner.github.io)
- [TypeScript](https://www.typescriptlang.org/)
- [Gulp](http://gulpjs.com/)
- ...

**Important note about Gulp:**
_The project is configured to use Gulp v4 and above.
Please refer to this [link](https://demisx.github.io/gulp4/2015/01/15/install-gulp4.html) to check how to configure it in your environment._

## Launch
From the project's root directory, type the following commands:

1. `npm install` -> Install the required NPM dependencies
1. `bower install` -> Install the required Bower dependencies
2. `gulp` or `npm start` -> Start the project

## Tests, Bugs & Contributions
While we do our best to get the whole project tested, do not hesitate to PR us if you ever find a bug. 
To launch all the tests, type the following command:

`gulp test` or `npm test`

## Working with the sources

The project offers a few helpers to make the running up faster.
Refer to this guide to know how and when to use them.

#### Cleaning up

* `gulp scratch`:
Clear the temporary files and set the project into a clean state.

#### Development

* `gulp ts`:
Compile TypeScript sources to JavaScript.

* `gulp serve && gulp browser`:
Starts the livereload server and opens the browser.

* `gulp bower`:
Binds the bower dependencies directly where they belong in the `index.html` file.

* `gulp watch`:
Starts the watchers for any changes in the code.

* `gulp sass`:
Compiles all the SASS files into the `main.css` and `main.min.css` files.

* `gulp deploy`:
Build and prepare the files into the `dist` directory.
**N.B: This does not compile the project for release purposes. See `gulp build` for that.**

#### Compiling

* `gulp build [--{ dev (default) | staging | prod }]`:
Builds the project for the selected environment. See the `./config/environments.json` hook file for more information.

* `gulp zip`:
Creates a zip archive of the `dist` directory for easy deployment purposes.

# What's next?

- Check for warning when leaving or refreshing page if a game is playing
- Plug hits counter to server response
- Plug ships destroyed counter to server response
- Create ships depending on server game configuration
- Set state according to who starts first (from server)
- Draw player bombs
- Check that the bomb coordinates have not already been hit
- Send bomb coordinates to server
- Save player bomb
- Draw opponent bombs

* * *
*Logo made with ❤ by [Arun Thomas](https://www.iconfinder.com/arunxthomas) from [Iconfinder](https://www.iconfinder.com/icons/1342928/citycons_sea_ship_icon#size=128)*
