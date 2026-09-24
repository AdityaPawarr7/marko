# MarKo

By Cameron Pocisk and Aditya Pawar

[Play MarKo](https://marko-eosin.vercel.app/)

# Introduction

In this assignment- we iterated over three levels of implementing our game with different ways to draw the lines and then rendering them. 

The inspiration for our game from our cats- Margo & Koko. Our initial concept was having them shoot/catch treats but we ended up with a more Subway Surfer-esque implementation where we play as the cat and avoid/swat obstacles!

More about this in the Design Aspect. 


## Youtube Video

## Game Description 

In the game- you get to play as a cat and your objective is to avoid/swat at obstacles and reach the finish line where you will be rewarded with Churus!

As the level progresses, your character will speed up and the frequency of obstacles will increase as well to ensure a positive game progression in terms of difficultly. 

## Teamwork Strategies


# Design (Adi and Cameron)

Our first iteration was having Koko and Margo shooting hearts at obstacles to break them and then they can reach the finish. 

We started off with the concept of drawing our cat's head using the vertices and edges as shown below.

![Margo's Hand-Drawn Version]()

Once we had that implemented- we started to work on the concept of the game. The environment for our game was going to be a track that keeps repeating N number of times as specified for the length of the level. We wanted the cat to have space to move around lanes which also allows for the characters to be scaled up which helped with the clarity of the objects we made. 

Attached below is the image of the initial Track Segment

![Track Segment Hand Drawn]()

Once we had the track segment finalized- we were able to represent it as a Cube but some missing edges to give the effect of being in an alley along with a long z width to make it a long track segment. 

After the scenery was set- we could move onto making the obstacles to render in the space along with the game logic. 


# Levels of Implementation

## Level 0
### Rendering a Wireframe Cube and the basic pipeline 

Before touching any of the actual game objects, Level 0 was really just about getting the whole pinhole camera pipeline working end to end on the simplest shape possible- a cube, defined as 8 vertices and 12 edges centered at the origin.

For the Menu- we made a simple HTML file that lists our different Levels and the buttons to get directed to the levels. Level 0 and Level 1 are simple redirects that ports you in the WireFrame Cube view and the Game drawn out by the JavaScript ctx function. Level 2 and Level 3 directs you to an individual page that has a menu on it and controls listed as well.

The camera starts out sitting back on the z-axis at {x: 0, y: 0, z: -10}, so it's looking at the cube from a distance instead of starting inside it.

To actually get the cube from 3D space onto the 2D canvas, every vertex gets pushed through the same pipeline. 

First we find the vertex's position relative to the camera instead of the world origin- camVert = vertex - camera- since this is really what makes the camera "move". Then we divide by z to get the actual pinhole projection- u = camVert.x / camVert.z and v = camVert.y / camVert.z- which is where the perspective comes from, since the farther something is, the bigger z is, so u and v shrink down, and that's exactly why far away stuff looks smaller. 

Those numbers come out small and centered around 0, so we scale them up by the canvas size and shift by half the canvas so (0,0) lands in the middle of the screen instead of the top left corner. Last thing- canvas y grows downward but our 3D y grows upward, so right before we draw we flip it to canvas.height - v, otherwise the cube renders upside down.

### Controls

- Arrow Up - move the camera forward (increase z)
- Arrow Down - move the camera backward (decrease z)
- Arrow Left - move the camera left (decrease x)
- Arrow Right - move the camera right (increase x)
- R - reset the camera back to its starting position

## Level 1

### Making a wireframe Cat (Cam)

#### Setting Up Verticies and Edges  (Cam)

#### Multiple Instances (Adi)

Once we had the track segment and obstacle models set up as vertices and edges, we needed a way to actually place a bunch of copies of them into the world without redefining the shape every time. So each instance just stores its own position vector (x, y, z) and a scale value, and we loop through and spawn a bunch of TrackSegment and Obstacle objects (const-mageddon) at different z positions (random lanes for the obstacles) to build the track out ahead of the camera.


#### Scaling and Translating Edge Vertex sets (Adi)

The base vertices for each object stay defined around the origin- we make sure to never touch them directly. When we go to project an instance, we take each base vertex, multiply it by that instance's scale, then add on the instance's position before subtracting the camera. That's really the only transform happening here- scale then translate, no rotation, which was all we needed since the track is just going straight.

#### Camera Movement (Adi)

In terms of the actual gameplay- the camera keeps moving forward on it's own instead of a keypress. The z value increases every frame so it feels like the game is running constantly. In order to go Left and Right- you can use the Arrow Keys to switch the lane we're in which in turn increments/decrements the camera's x position slowly for a smooth transition.

A neat tid-bit we added is a small bob to the cat while it's running- bobPhase increases every frame, and we take the sin of that and multiply it by a small amplitude (BOB_AMPLITUDE) to nudge the cat's y position up and down. The camera itself does not move but it's the cat model translating which makes it more immersive. 

#### User action (Adi)

The user action that we allow is for swatting at an obstacle when you're within a range set by a constant. The key to swat is clicking the space-bar which will destroy the object by triggering the .destroyed condition as true for the object Obstacle. 


#### Reset Game (Adi)

If you do run into an object instead of swatting at it or avoiding it by changing lanes. checkCollisions() catches it and in turn calls resetGame() which puts the camera back at (0,0,0) and in the middle lane. Undestroys the object that you may have destroyed for the level to be played again. 

### Controls

- Arrow Left / Arrow Right - switch lanes
- Space - swat the obstacle in front of you
- P - pause
- Escape - back to menu
- + : Zoom In
- - : Zoom Out


## Level 2

### Using Custom Lines
#### Cameron Custom Line (primitive) (Cam)
#### Great/final Custom Line (Adi)
### Display Methods (Adi)
#### The Dom Grid (Cam)
### Coloring (Adi)
### Clearing (Adi)

## Level 3 (Cam)

### Obstacles (Adi)
### 3d Game Logic (Adi)
### 3D Shapes and Triangles (Cam)
### Triangle Class (Cam)

### Traffic Cone Class (Cam)

### Cardboard Box Class (Cam)

### occlusion (Cam)
### Barycentric Coordinates (Cam)
### Translation, Scaling, Rotations (Cam)
#### Clockwise Problem (Cam)
### Depth Projection (and its relation to pinhole camera) (Adi)


# Final Thoughts

## What we would have changed

## Reflecting on quality of solutions

## Credits (Who did what?)
### Cam

### Adi