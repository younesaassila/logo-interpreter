class Interpreter {
  /**
   * Initializes the interpreter.
   * @param {string} text The text to parse.
   * @param {boolean} ignoreComments The interpreter will ignore user comments.
   * (True by default)
   */
  constructor(text, ignoreComments = true) {
    this.text = text;
    this.text = this.text.trim();
    this.text = this.text.toLowerCase();
    this.replaceEscapeCharacters();
    if (ignoreComments) { this.ignoreComments(); }
  }

  /**
   * 🔒 Private Method
   * Replaces every part of the text matching the comment regex with an empty
   * space.
   */
  ignoreComments() {
    this.text = this.text.replace(/\/\*([\s\S]*?)\*\//g, '');
  }

  /**
   * 🔒 Private Method
   * Replaces every part of the text matching an escape character with a space.
   */
  replaceEscapeCharacters() {
    this.text = this.text.replace(/\s|\t|\n|\r/g, ' ');
  }

  /**
   * Returns an array of tokens from the specified text.
   */
  getTokens() {
    let tokens = [];
    let currentToken = "";
    let bracketCount = 0;
    
    // Loop through every character of the text.
    for (let i = 0; i < this.text.length; i++) {
      let char = this.text.charAt(i);
      
      // Count opened brackets in order to return all the content inside as a
      // single token. Also replace the character by an empty string if the
      // character is a bracket from the outermost brackets in order to not
      // add it to the current token.
      if (char === '[') {
        bracketCount++;
        if (bracketCount === 1) { char = ''; }
      } else if (char === ']') {
        bracketCount--;
        if (bracketCount === 0) { char = ''; }
      }

      // If one or more brackets are opened, just copy every single character
      // to the current token.
      if (bracketCount > 0) {
        currentToken += char;
      }

      // If the character is not a space, add it to the current token.
      else if (char !== ' ') {
        currentToken += char;

        // If this is the loop's last iteration before continuing the script,
        // push the current token to the tokens array.
        if (i + 1 >= this.text.length) {
          tokens.push(currentToken);
          currentToken = "";
        }       
      }

      // The current character is a space character. If the current token is
      // not an empty string, push the current token to the tokens array.
      else if (currentToken !== "") {
        tokens.push(currentToken);
        currentToken = "";
      }
    }

    return tokens;
  }

  /**
   * Returns an array of commands from the specified text.
   */
  getCommands() {
    const tokens = this.getTokens();
    let commands = [];
    let currentCommand = new Command();

    // Loop through every token in tokens.
    for (let [index, token] of tokens.entries()) {
      // Check if the token corresponds to an existing Logo command name.
      if (logoCommands[token]) {
        // Check for an existing current command:
        // If the current command has been modified, check if has at least
        // a name. In that case, push it to the commands array.
        if (currentCommand.name !== "") {
          commands.push(currentCommand);
        }
        // Create a new command a set its values.
        currentCommand = new Command();
        currentCommand.name = token;
        currentCommand.execute = logoCommands[token];
      }
      
      // Otherwise, add the token to the current command's args array.
      else {
        currentCommand.args.push(token);
      }

      // If this is the loop's last iteration before continuing the script
      // and if the current command has a name, push the current command
      // to the commands array.
      if ((index + 1 >= tokens.length) && (currentCommand.name !== "")) {
        commands.push(currentCommand);
      }
    }

    return commands;
  }
}
