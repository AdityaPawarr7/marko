Implementation
Level 0:  Project preliminaries
Create a web application using html, css and javascript.

A portion of this page (a header) should give a title, your name and have space for information about how to use the project. 

The page should include a canvas element that initially displays a 3D cube object (described through vertices and edges), with a camera that can move left/right and forward/back using arrow controls. 

Level 1:  Wire-frame, pinhole camera
Realize a version of your envisioned game, using the canvas line drawing function.  This version can draw the lines onto a large, high-resolution canvas, on your computer screen. (e.g., 1600 x 1000).

Requirements:

This experience should feature at least 3 different object types, defined by a set of vertices and edges.  Example object types:
StarWars trench run- 1) floors/wall segments, 2) portholes, 3) flyer
Landscape- 1) Ground segment, 2) Mountain, 3) House
Define a model for these objects through vertex coordinates, centered at the origin.  
Create multiple instances of these objects. Each instances should include:
a vector to define the position in 3D space,
a scaling factor, to define how big it is (are all space ships or trees the same size, or do they vary?) 
apply these translation and scaling operations to the base object to display each instance. 
Note- we are just doing translation or scaling here, no rotation.
Some objects should have color information, and be drawn with the specified color. 
Use a pinhole camera projection to place the vertices for these objects along a 2D plane. 
Scale this placement to the raster display- our canvas defined above
Camera should be able to move in 2 directions using keypress inputs:
example- forward/back by incrementing or decrementing z,  and left/right by decrementing or incrementing x.  Camera does not rotate. 
Consider what to do to handle or prevent situations where your camera moves past your objects (objects are behind camera or camera is inside objects).
User should be able to do some action using keypresses in the scene using keypresses. 
There should be a keypress to reset the scene back to the initial camera and object coordinates.
Level 2: Lower resolution, line drawing
The user should be able to toggle to a different version of your application- keypress to switch, or select a different tab or click button to open a different window.  This time, instead of drawing lines using the canvas line element, you are going to draw your own lines onto a mock lower resolution canvas. 

Instead of a high resolution canvas (e.g, 1600 x 1000), we are going create a mock 320x200 pixel canvas, where each pixel is a 5x5 pixel square.  You will initialize a 2d array of dimensionality 320x200, initially storing the background color.  When you want to fill in a pixel with a particular color, write that color to the 2d array.  In the draw function, draw each pixel as a Each 'pixel' is a 5x5 pixel rectangle element you are drawing onto the canvas

Replace the javascript canvas operation to draw a line, with your own function, that fills in suitable pixels to represent this line to the raster display.  Once all edges have been considered, and pixels filled in, draw the pixel grid. 

Starting point here: pixel-grid-test-1.htmlDownload pixel-grid-test-1.html

Reference line drawing starting point here: 01-03-lines.pptx

Level 3- Triangles and triangle fill 
The user should be able to toggle to a different version of your application- keypress to switch, or select a different tab or click button to open a different window. 

In this version, instead of drawing vertices and edges, we are going to fill in triangles.  Take your models previously defined in terms of vertices and edges.  Now define them as surfaces consisting in triangles- three vertices per triangle.  Assign a color to the surface.

Using triangle drawing approaches discussed in class, determine which pixels are 'covered' by which triangle.  Take into account occlusion using a depth storage approach, to identify the nearest triangle covering the pixel. 

After filling in this buffer with suitable color information, draw it to the screen using 5x5 pixel squares. 