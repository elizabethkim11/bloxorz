# bloxorz.js

Hello! This is a 5-level 3D logical puzzle game, where the player moves a 2x1 block (aka bloxorz) around a platform with the goal of landing it upright onto a target square, which is shaded light blue.
We derived inspiration from the online web game Bloxorz, and impleneted our version using WebGL.

Be careful, since if you fall off the platform your progress will be reset to Level 1.

To run the game on your device:
* Git clone the repository
* Open the folder in Webstorm
* Run the index.html file
* Local host will open the game on a new window

Controls:
* j - left
* i - up
* k - down
* l - right
* Enter - reset to level 1
* m - toggle music on/off

To start the game, simply press Enter when you see the title page. Use the controls listed above to move your block around the platform. As you move around the block, the number of moves for that specific level is listed on the control panel.

The main scene called by main-scene.js is Bloxorz, which is defined under bloxorz.js. This is where we designed the overall layout of the game. There is a Tile object and a Block object, and both get called in our display function. The main class used is Bloxorz, which is extended from Bloxorz_Base and Scene. 
We made use of helper functions including display_block, next_stage, and draw_tile_platform to implement our game.

Enjoy!
