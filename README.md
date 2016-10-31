# How to use this project?

A few steps are in order to get **BattleShip 2.0** up and running in your environment.

## Setup

To get the project started, fetch the sources form this repository:

* `cd path/to/save/the/repository/locally`
* `git clone https://github.com/Adrael/battleship2.0.git`

Then, install the required dependencies:

* `npm install`
* `bower install`

## Getting started

To launch the game in your browser, simply use `gulp` at the root of the project.
The browser will **refresh automatically** upon changes in the code as watchers will be set up.

### Working with the sources

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

## Tests

### client
To run the tests, use the `npm test` command. It will use Karma, Jasmine and PhantomJS to automatically run the tests described in `./tests/bs`.

### server
To run the server-side tests, use the `gulp test-server` command. These tests are run Mocha and Chai.

## References

* https://fr.wikipedia.org/wiki/Bataille_navale_(jeu)
* https://en.wikipedia.org/wiki/Battleship_(game)
* https://coolors.co/ff5e5b-acede7-a3d8ec-f8f8ff-36393b

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
