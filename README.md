# MarKo
By Cameron Pocisk and Aditya Pawar

# Introduction

In this assignment- we iterated over three levels of implementing our game with different ways to draw the lines.

The inspiration for our game from our cats- Margo & Koko. Our initial concept was having them shoot/catch treats but we ended up with a more Subway Surfer-esque implementation where we play as the cat and avoid/swat obstacles!

more about this in the Design Aspect. 


# Youtube Video

## Game Description 

In the game- you get to play as a cat and your objective is to avoid/swat at obstacles and reach the finish line where you will be rewarded with Churus!

As the level progresses, your character will speed up and the frequency of obstacles will increase as well to ensure a positive game progression in terms of difficultly. 

## Teamwork Strategies
Cameron started this project by making the cat for level 1
(Projection and implementing the new display and list of V and E's)
Then Cameron started to work on the 3d triangles.
### (Adi) (Remove this header when ur done)
Adi say what u did before we came together at the end
In the end we synced up and combined the game logic and 3d objects and trinagle things to make a fun game!

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
### Rendering a Wireframe Cube and the basic pipeline (Adi)

## Level 1
### Making a wireframe Cat (Cam)
Making the wireframe for the cat face was not very easy for me. 
In the end I follow this process
1. Draw a cartoony cat face on graph paper. 
2. Try to find good verticies that represent the shape of the cat && number them
3. Label all of the edges
4. Hard code them into the cat class
5. Use the same method in level 0 for drawing the cube 

#### Multiple Instances (Adi)
#### Scaling and Translating Edge Vertex sets (idk)
For the first cat head wireframe, I applied translations at the start of the construction phase
#### Camera movement (Adi)
#### User action (Adi)
#### Reset Game (Adi)


## Level 2
### Using Custom Lines
#### Cameron Custom Line (primitive) (Cam)
I was the first to change the line function and I did a very simple step over for the lines. This worekd good when the slope was <= 1
This line drawing fn just calculated the slope, and then applied the slope over all of the points on the line
#### Final Custom Line (Adi)
### Display Methods (Adi)
#### The Dom Grid (Cam)
On most of the forks for my development, I was working on a version of the game which was colored by way of thousands of individual HTLM divs in a grid (absolutely no canvas)
To do this I set up a grid in the HTML, also setup a 320x200 array which would hold the HTML element (and later depth).
When coloring the divs, I added them to a set which would all get colored when the game was ready to draw, then the same set got set to the background color at the start of the next frame. 
### Coloring (Adi)
### Clearing (Adi)

## Level 3 (Cam)
### Obstacles (Adi)
### 3d Game Logic (Adi)
### Triangle Class (Cam)
On a seperate branch (CameronDivsFork) I implemented a triangle.
The triangle class has these capabilties that I wrote myself
Calculate Triangle area
Get Barycentric Coordinates
Calculate Depth
Scale, Vector Scale, Translate, Rotate X, Y (Did matrix calculations on paper)
I had AI help generate 2 things: 1: Make Clockwise 2: Apply a depth multiplier 
### Traffic Cone Class (Cam)
Once I made the triangle, I was able to start to make some 3d shapes.
I decided to start with the easiest sounding shape, a pyramid and to make it fun I decided to later color it orange and have adi use it as an obstacle in the game logic.
Once I did make the shape, I was struggling to use the transformations so I had to start it as a 'unit pyramid' which then allowed me to make sensible rotations and scales and then later translations. 
### 3D Shapes and Triangles (Cam)
Once I implemented the Triangle class and got used to making shapes like the pyramid, I made a general shape class. Which used the fundamental pipeline that we have learned in our class about drawing triangles. This did not end up making it in the final game but I was pretty proud of this. On my own branch I did use it to make a cube!

### Cardboard Box Class (Adi)

### occlusion (Cam)
To handle occulsion, I only drew the triangles if the new depth was closer than the old depth 
(New depth via barycentric coords and old depth stored in array)
### Barycentric Coordinates (Cam)
Once I had the triangle area formula, this was relatively straightforward to calculate. I returned the coordinates and they allowed me to determine if any point/pixel was outside the triangle by - area and later the depth by scaling the z coordinates. 
### Translation, Scaling, Rotations (Cam)
These were pretty fun to do, these were mostly doing vector maths. I even went online to see the rotation matricies and then applied them to my X, Y coordinates. 
I did learn that scaleing and rotations after translations were really bad. So near the end I tried implementing a way to queue up all the transformation and apply them at once before drawing in the correct order -- but ran out of time.
#### Clockwise Problem (Cam)
This was one of my only uses of genAI. I did this becuase I was getting paranoid and not being able to trust my area code (fundameltal) made it difficult to debug. This worked out pretty good and helped me focus on the graphics part of the code a lot more. 
### Depth Projection (and its relation to pinhole camera) (Adi)


# Final Thoughts

## What we would have changed
### Cam
There is a lot more to this project than the Vertex and Edges as well as the 3d shapes. Although I tried to implement what I thought was a good portion before the submission, on the final day even though I did a good job and spent a large portion of the whole day on the triangles and shapes there was still more to do. 
### Adi

## Credits (Who did what?)
The names next to the documentation headers explain who did what

## AI Usage

### Cameron
I used genAI to... 
- make the clockwise member function for triangle
- Help me generate a solution to represent depth better
- Debug in a couple very small spots 