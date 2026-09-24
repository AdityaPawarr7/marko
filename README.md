# MarKo

By Cameron Pocisk and Aditya Pawar

# Introduction

In this assignment- we iterated over three levels of implementing our game with different ways to draw the lines.

The inspiration for our game from our cats- Margo & Koko. Our initial concept was having them shoot/catch treats but we ended up with a more Subway Surfer-esque implementation where we play as the cat and avoid/swat obstacles!

more about this in the Design Aspect. 


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

To actually get the cube from 3D space onto the 2D canvas, every vertex gets pushed through the same few steps:

1. First we find the vertex's position relative to the camera instead of the world origin- camVert = vertex - camera. This is really what makes the camera "move".

2. Then we divide by z to get the actual pinhole projection- u = camVert.x / camVert.z and v = camVert.y / camVert.z. Dividing by z is the part that gives us perspective- the farther something is, the bigger z is, so u and v shrink, which is exactly why far away stuff looks smaller.

3. u and v come out as small numbers centered around 0, so we scale them up by the canvas size and shift by half the canvas so (0,0) lands in the middle of the screen instead of the top left corner.

4. One more flip happens right before we draw- canvas y grows downward, but our 3D y grows upward, so we draw at canvas.height - v instead of just v. Skip this and the cube renders upside down.

Controls

- Arrow Up - move the camera forward (increase z)
- Arrow Down - move the camera backward (decrease z)
- Arrow Left - move the camera left (decrease x)
- Arrow Right - move the camera right (increase x)
- R - reset the camera back to its starting position

## Level 1
### Making a wireframe Cat (Cam)

#### Setting Up Verticies and Edges (Cam)
#### Multiple Instances (Adi)
#### Scaling and Translating Edge Vertex sets (idk)
#### Camera movement (Adi)
#### User action (Adi)
#### Reset Game (Adi)


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