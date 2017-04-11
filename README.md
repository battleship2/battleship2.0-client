<p align="center">
  <img src="https://raw.githubusercontent.com/battleship2/battleship2.0-client/master/src/assets/img/logos/logo.png" alt="battleship 2 logo"/>
  <h1 align="center">Battleship 2 | Client</h1>
  <h5 align="center">"Together, we are an ocean"</h5>
  <small align="center">RYUONOSUKE SATORO</small>
</p>

This is the client-side repository of the `Battleship 2` game.
The server (NodeJS) repository is hosted at [https://github.com/battleship2/battleship2.0-server](https://github.com/battleship2/battleship2.0-server).

## Dependencies
The client relies on several well-known libraries such as:
- [Socket.IO](http://socket.io/)
- [Karma](https://karma-runner.github.io)
- [TypeScript](https://www.typescriptlang.org/)
- [Angular](https://angular.io/)
- [Gulp](http://gulpjs.com/)
- ...

**Important note about Gulp:**
_The project is configured to use Gulp v4 and above.
Please refer to this [link](https://demisx.github.io/gulp4/2015/01/15/install-gulp4.html) to check how to configure it in your environment._

## Launch
From the project's root directory, type the following commands:

1. `npm install` -> Install the required NPM dependencies
2. `gulp` or `npm start` -> Start the project

## Tests, Bugs & Contributions
While we do our best to get the whole project tested, do not hesitate to PR us if you ever find a bug. 
To launch all the tests, type the following command:

`npm test`

## Working with the sources

The project offers a few helpers to make the running up faster.
Refer to this guide to know how and when to use them.

#### Cleaning up

* `gulp clean`:
Clear the temporary files and set the project into a clean state.

#### Bundling

* `gulp build`:
Build and prepare the files into the `dist` directory with development target.
**N.B: This does not compile the project for release purposes. See `gulp build:prod` for that.**

* `gulp build:staging`:
Build and prepare the files into the `dist` directory with staging target.
This step imitates the production bundle with all the development assets (console logging, debugging, tools, etc.)
**N.B: This does not compile the project for release purposes. See `gulp build:prod` for that.**

* `gulp build:prod`:
Build and prepare the files into the `dist` directory with production target.
Will produce a minified, optimized bundle for fast delivery into browsers.

Please note that each of the above environments is configured through a property file (see `./src/environments/environment[.TARGET].ts`).

# What's next?

- Finish Angular 2 migration
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
*Logo made with ❤  by [Arun Thomas](https://www.iconfinder.com/arunxthomas) from [Iconfinder](https://www.iconfinder.com/icons/1342928/citycons_sea_ship_icon#size=128)*
