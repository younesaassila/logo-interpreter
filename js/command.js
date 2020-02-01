// This file contains:
// -  A dictionary associating with each command name an execute
//    function (used by the interpreter to detect tokens that correspond
//    to a command declaration).
// -  The Command class.

// Note: Functions that refer to 'this' are actually refering to
// the command object they'll be associated with.
const logoCommands = {
  // FORWARD
  "fd": function () {
    if (this.args[0]) {
      let distance = parseInt(this.args[0]);
      if (!isNaN(distance)) {
        turtle.forward(distance);
      }
    }
  },
  // BACKWARD
  "bd": function () {
    if (this.args[0]) {
      let distance = parseInt(this.args[0]);
      if (!isNaN(distance)) {
        turtle.forward(-distance);
      }
    }
  },
  // RIGHT
  "rt": function () {
    if (this.args[0]) {
      let degrees = parseInt(this.args[0]);
      if (!isNaN(degrees)) {
        turtle.right(degrees);
      }
    }
  },
  // LEFT
  "lt": function () {
    if (this.args[0]) {
      let degrees = parseInt(this.args[0]);
      if (!isNaN(degrees)) {
        turtle.right(-degrees);
      }
    }
  },
  // REPEAT
  "repeat": function () {
    if (this.args[0] && this.args[1]) {
      let count = parseInt(this.args[0]);
      if (!isNaN(count)) {
        let interpreter = new Interpreter(this.args[1]);
        let commands = interpreter.getCommands();
        for (let i = 0; i < count; i++) {
          for (let command of commands) {
            command.execute();
          }
        }
      }
    }
  },
  // PEN UP
  "pu": function () {
    turtle.pendown = false;
  },
  // PEN DOWN
  "pd": function () {
    turtle.pendown = true;
  },
  // PEN SIZE
  "ps": function () {
    if (this.args[0]) {
      let pensize = parseInt(this.args[0]);

      if (!isNaN(pensize)) {
        if (pensize <= 1) {
          turtle.pensize = 1;
        } else {
          turtle.pensize = pensize;
        }
      }
    }
  },
  // SHOW TURTLE
  "st": function () {
    turtle.visible = true;
  },
  // HIDE TURTLE
  "ht": function () {
    turtle.visible = false;
  },
  // HOME
  "home": function () {
    turtle.x = turtle.xOff;
    turtle.y = turtle.yOff;
  },
  // SET X Y
  "setxy": function () {
    if (this.args[0] && this.args[1]) {
      let x = parseInt(this.args[0]);
      let y = parseInt(this.args[1]);

      if (!isNaN(x) && !isNaN(y)) {
        turtle.x = turtle.xOff + x;
        turtle.y = turtle.yOff - y;
      }
    }
  },
  // SET X
  "setx": function () {
    if (this.args[0]) {
      let x = parseInt(this.args[0]);

      if (!isNaN(x)) {
        turtle.x = turtle.xOff + x;
      }
    }
  },
  // SET Y
  "sety": function () {
    if (this.args[0]) {
      let y = parseInt(this.args[0]);

      if (!isNaN(y)) {
        turtle.y = turtle.yOff - y;
      }
    }
  },
  // SET HEADING
  "seth": function () {
    if (this.args[0]) {
      let angle = parseInt(this.args[0]);

      if (!isNaN(angle)) {
        turtle.angle = (angle - 90) % 360;
      }
    }
  },
  // COLOR
  "color": function () {
    if (this.args[0]) {
      let color = this.args[0];
      turtle.pencolor = color;
    }
  },
  // BACKGROUND COLOR
  "bgcolor": function () {
    if (this.args[0]) {
      let color = this.args[0];
      canvas.style.backgroundColor = color;
    }
  },
  // CLEAR SCREEN
  "cs": function () {
    resetCanvas();
  }
}

class Command {
  constructor() {
    this.name = "";
    this.args = [];
  }

  execute() {
    // This method is overriden by the interpreter when it creates a new
    // command object with the function corresponding to the command
    // name specified by the user.
  }
}
