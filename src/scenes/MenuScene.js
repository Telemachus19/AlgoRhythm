import Scene from "./Scene.js";
import LinearSearchScene from "../games/LinearSearch/LinearSearchScene.js";
import EightPuzzleScene from "../games/EightPuzzle/EightPuzzleScene.js";

export default class MenuScene extends Scene {
  constructor(engine) {
    super(engine);
    this.options = [
      // Link each game when done, or during testing
      { title: "Linear Search", scene: LinearSearchScene },
      { title: "8-Puzzle", scene: EightPuzzleScene },
      { title: "Binary Search (Locked)", scene: null },
      { title: "Bubble Sort (Locked)", scene: null },
    ];
    this.selectedIndex = 0;
  }

  enter() {
    this.container.innerHTML = `
            <div class="center-flex">
                <h1>AlgoRhythm</h1>
                <div id="menu-list"></div>
                <div class="menu-instructions">
                    [UP/DOWN] Select &nbsp;&bull;&nbsp; [ENTER] Start
                </div>
            </div>
        `;
    this.renderMenu();
  }

  update(dt) {
    const input = this.engine.input;

    if (input.isPressed("ArrowUp")) {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.options.length) % this.options.length;
      this.renderMenu();
    }
    if (input.isPressed("ArrowDown")) {
      this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
      this.renderMenu();
    }
    if (input.isPressed("Enter")) {
      const selected = this.options[this.selectedIndex];
      if (selected.scene) {
        this.engine.sceneManager.changeScene(selected.scene);
      }
    }
  }

  renderMenu() {
    const list = document.getElementById("menu-list");
    list.innerHTML = this.options
      .map(
        (opt, i) => `
            <div class="menu-item ${
              i === this.selectedIndex ? "selected" : ""
            }" id="menu-item-${i}">
                ${opt.title}
            </div>
        `,
      )
      .join("");

    // Ensures selected item is visible (scrolls if necessary)
    const selectedEl = document.getElementById(
      `menu-item-${this.selectedIndex}`,
    );
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }
}
