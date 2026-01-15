export default class InputHandler {
  constructor() {
    this.keys = {};
    this.downKeys = {}; // Keys currently being held down (for single press logic)

    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "Space", "Enter"].indexOf(e.code) > -1) {
        e.preventDefault();
      }
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
      this.downKeys[e.code] = false;
    });
  }

  isDown(code) {
    return this.keys[code];
  }

  isPressed(code) {
    if (this.keys[code] && !this.downKeys[code]) {
      this.downKeys[code] = true;
      return true;
    }
    return false;
  }
}
