class Turtle {
  /**
   * Initializes the turtle.
   */
  constructor() {
    // Reset the turtle to its default values.
    this.reset();
  }

  /**
   * Translates the turtle by the given amount of steps.
   * @param {number} steps 
   */
  forward(steps) {
    if (typeof steps === 'number') {
      // Convert the turtle's angle (in degrees) to radians.
      const radians = this.angle / 360 * 2 * Math.PI;
      // Calculate the turtle's new position.
      const deltaX = Math.cos(radians) * parseInt(steps);
      const deltaY = Math.sin(radians) * parseInt(steps);
      // Begin the drawing process.
      context.beginPath();
      context.moveTo(this.x, this.y);
      // Update the turtle's position.
      this.x += deltaX;
      this.y += deltaY;
      // Draw the line from the previous position to the current one.
      if (this.pendown) {
        context.strokeStyle = this.pencolor;
        context.lineWidth = this.pensize;
        context.lineTo(this.x, this.y);
        context.stroke();
      }
    }
  }

  /**
   * Rotates the turtle by the given angle in degrees.
   * @param {number} angle Angle in degrees.
   */
  right(angle) {
    if (typeof angle === 'number') {
      this.angle = (this.angle + parseInt(angle)) % 360;
    }
  }

  /**
   * Draws a triangle representing the turtle on the canvas.
   */
  drawTurtle() {
    // Save current values of pendown and pensize.
    const pendown = this.pendown;
    const pensize = this.pensize;
    // Set pendown to be true to make sure the turtle is drawn.
    this.pendown = true;
    // Limit pensize to 3 in order not to draw an oversized turtle.
    this.pensize = pensize > 3 ? 3 : pensize;

    // This sequence draws a triangle representing the turtle.
    this.right(-90);
    this.forward(17);
    this.right(135);
    this.forward(24);
    this.right(90);
    this.forward(24);
    this.right(135);
    this.forward(17);
    this.right(90);

    // Restore back the previously saved values.
    this.pendown = pendown;
    this.pensize = pensize;
  }

  /**
   * Resets the turtle to its default values.
   */
  reset() {
    // In order for the coordinates to be centered on the canvas,
    // the turtle needs X and Y offsets.
    this.xOff = parseInt(canvas.width / 2);
    this.yOff = parseInt(canvas.height / 2);

    // Default values of the turtle.
    const x = 0;
    const y = 0;
    const angle = 0;

    this.x = this.xOff + x;
    this.y = this.yOff - y;
    this.angle = (angle - 90) % 360;
    this.pendown = true;
    this.pencolor = "#000000";
    this.pensize = 1;
    this.visible = true;
  }
}
