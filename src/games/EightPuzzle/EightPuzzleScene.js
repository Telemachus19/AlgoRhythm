import Scene from "../../scenes/Scene.js";
import MenuScene from "../../scenes/MenuScene.js";

export default class EightPuzzleScene extends Scene {
  constructor(engine) {
    super(engine);
    // State: 0 represents the empty tile
    // TODO: Implement Different goal states
    this.solvedState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    this.currentState = [...this.solvedState];
    this.emptyIndex = 8;
    this.isSolved = false;
  }

  enter() {
    // should setupDom() be an abstract contained in the Scene?
    this.setupDOM();
    this.shuffle();
  }

  setupDOM() {
    this.container.innerHTML = `
            <div class="puzzle-container">
                <div class="puzzle-hud">8-PUZZLE</div>
                <div id="puzzle-grid" class="puzzle-grid"></div>
                <div id="puzzle-msg" class="puzzle-message">Use Arrow Keys to Move</div>
            </div>
        `;
    this.renderGrid();
  }
  // Puzzle Generator
  shuffle() {
    // Start solved and make valid moves to ensure solvability
    this.currentState = [...this.solvedState];
    this.emptyIndex = 8;

    let moves = 50; // Shuffle depth
    let lastMove = -1;

    for (let i = 0; i < moves; i++) {
      const neighbors = this.getNeighbors(this.emptyIndex);
      // Don't undo immediate last move
      const validNeighbors = neighbors.filter((n) => n !== lastMove);
      const randomNeighbor =
        validNeighbors[Math.floor(Math.random() * validNeighbors.length)];

      this.swap(this.emptyIndex, randomNeighbor);
      lastMove = this.emptyIndex; // The old empty index is now where the tile came from
      this.emptyIndex = randomNeighbor;
    }

    this.isSolved = false;
    this.renderGrid();
    document.getElementById("puzzle-msg").innerText = "Use Arrow Keys to Move";
  }

  getNeighbors(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const neighbors = [];
    if (row > 0) neighbors.push(index - 3); // Up
    if (row < 2) neighbors.push(index + 3); // Down
    if (col > 0) neighbors.push(index - 1); // Left
    if (col < 2) neighbors.push(index + 1); // Right

    return neighbors;
  }

  swap(i, j) {
    const temp = this.currentState[i];
    this.currentState[i] = this.currentState[j];
    this.currentState[j] = temp;
  }

  update(dt) {
    if (this.engine.input.isPressed("Escape")) {
      this.engine.sceneManager.changeScene(MenuScene);
      return;
    }

    if (this.isSolved) {
      if (this.engine.input.isPressed("Space")) {
        this.shuffle();
      }
      return;
    }
    // TODO: this doesn't feel natural at all
    // Arrow Key moves the "Blank" space in that direction
    // (Swapping with the tile currently in that direction)
    let targetIndex = -1;
    const input = this.engine.input;
    const row = Math.floor(this.emptyIndex / 3);
    const col = this.emptyIndex % 3;

    if (input.isPressed("ArrowUp") && row > 0)
      targetIndex = this.emptyIndex - 3;
    if (input.isPressed("ArrowDown") && row < 2)
      targetIndex = this.emptyIndex + 3;
    if (input.isPressed("ArrowLeft") && col > 0)
      targetIndex = this.emptyIndex - 1;
    if (input.isPressed("ArrowRight") && col < 2)
      targetIndex = this.emptyIndex + 1;

    if (targetIndex !== -1) {
      this.swap(this.emptyIndex, targetIndex);
      this.emptyIndex = targetIndex;
      this.checkWin();
      this.renderGrid();
    }
  }

  checkWin() {
    const win = this.currentState.every(
      (val, index) => val === this.solvedState[index],
    );
    if (win) {
      this.isSolved = true;
      document.getElementById("puzzle-msg").innerText =
        "SOLVED! Press Space to Shuffle";
    }
  }

  renderGrid() {
    const grid = document.getElementById("puzzle-grid");
    grid.innerHTML = this.currentState
      .map((val, index) => {
        const isEmpty = val === 0;
        const isCorrect = !isEmpty && val === index + 1;
        let classes = "puzzle-tile";
        if (isEmpty) classes += " empty";
        if (this.isSolved) classes += " correct";

        return `<div class="${classes}">${isEmpty ? "" : val}</div>`;
      })
      .join("");
  }
}
