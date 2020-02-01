// HTML elements.
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const saveButton = document.getElementById("save-button");
const codeEditor = document.getElementById("editor");
const live = document.getElementById("live");
const runButton = document.getElementById("run-button");
const commandsManual = document.getElementById("commands");

// Timeout used when resizing the window in order to reduce the number of canvas redraws.
let resizeTimeout;

// Create a new turtle object.
const turtle = new Turtle();

// Loads the list of supported Logo commands shown next to the canvas.
const loadCommandManual = () => {
  const request = new XMLHttpRequest();

  // Displays an error message if the request fails.
  const onError = () => {
    let errorMsg = document.createElement("p");
    errorMsg.className = "command-name";
    errorMsg.innerHTML = "An error occurred while trying to get the JSON file containing the command manual's content.";
    commandsManual.append(errorMsg);
  }

  // Loads the command manual.
  const onLoad = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        const commands = JSON.parse(request.responseText).commands;
        for (command of commands) {
          let commandName = document.createElement("p");
          commandName.className = "command-name";
          commandName.innerHTML = `• ${command.name}`;
          let commandCode = document.createElement("code");
          commandCode.className = "command-code";
          commandCode.innerHTML = command.code;
          let commandDesc = document.createElement("p");
          commandDesc.className = "command-desc";
          commandDesc.innerHTML = command.desc;

          commandsManual.append(commandName);
          commandsManual.append(commandCode);
          commandsManual.append(commandDesc);
        }
      } else {
        onError();
      }
    }
  }

  request.open("GET", "commands.json", false);
  request.onload = onLoad;
  request.onerror = onError;
  request.send(null);
}

// Resets the turtle object and canvas.
const resetCanvas = () => {
  // Set maximum canvas width and height depending on its container.
  const canvasContainer = document.querySelector("#canvas-container");
  const canvasContainerTitleBar = document.querySelector("#canvas-container .title-bar");
  canvas.width = canvasContainer.scrollWidth;
  canvas.height = canvasContainer.scrollHeight - canvasContainerTitleBar.scrollHeight;

  // Reset the canvas to be empty.
  canvas.style.backgroundColor = "#ffffff";
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Reset the turtle.
  turtle.reset();
}

// Gets commands from the code, executes each one of them and draws the turtle.
const executeCode = () => {
  // Get commands from the code that the user typed.
  let code = codeEditor.value;
  let interpreter = new Interpreter(code);
  let commands = interpreter.getCommands();
  // Execute each command in the commands array.
  for (let command of commands) {
    command.execute();
  }
  // Draw the turtle on screen if it is set to be visible.
  if (turtle.visible) {
    turtle.drawTurtle();
  }
}

// Executes the code every time the input changes.
codeEditor.addEventListener("input", () => {
  if (live.checked) {
    resetCanvas();
    executeCode();
  }
});

// Executes the code every time the user clicks on the refresh button.
runButton.addEventListener("click", () => {
  resetCanvas();
  executeCode();
})

// Save the canvas as an image when the save button is clicked.
saveButton.addEventListener("click", () => {
  // In order to save the canvas's background color, we'll need to create
  // a dummy canvas where is drawn a rectangle representing the background
  // with the appropriate color and then the user's drawing.
  dummyCanvas = document.createElement("canvas");
  dummyCanvas.width = canvas.width;
  dummyCanvas.height = canvas.height;
  dummyContext = dummyCanvas.getContext("2d");

  // Create a rectangle with the desired color.
  dummyContext.fillStyle = canvas.style.backgroundColor;
  dummyContext.fillRect(0, 0, dummyCanvas.width, dummyCanvas.height);

  // Draw the original canvas onto the dummy canvas.
  dummyContext.drawImage(canvas, 0, 0);

  // Finally change the reference of the download link.
  saveButton.href =
    dummyCanvas.toDataURL("image/png")
      .replace(/^data:image\/[^;]/, 'data:application/octet-stream');
});

// Redraws the canvas every time the user resizes the window.
window.addEventListener("resize", () => {
  let delay = 20; // ms
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resetCanvas();
    executeCode();
  }, delay);
});

// Update the command manual to show a list of all supported Logo commands.
loadCommandManual();

// Reset the canvas and execute the code (presumably empty by default).
resetCanvas();
executeCode();
