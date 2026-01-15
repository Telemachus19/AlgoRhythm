import Scene from "../../scenes/Scene.js";
// I need to impletemen a gotomenu it will be easier thean importing the menu scene
import MenuScene from "../../scenes/MenuScene.js";

export default class LinearLockScene extends Scene {
  constructor(engine) {
    super(engine);

    this.arraySize = 20;
    this.baseSpeed = 0.5;
    this.currentSpeed = 0.5;
    // Calculated dynamically now, should i be deleted? no please no
    this.itemTotalWidth = 0;

    this.data = [];
    this.targetValue = 0;
    this.targetIndex = 0;
    this.currentIndex = 0;

    this.timer = 0;
    this.isPlaying = false;
    this.score = 0;
    this.level = 1;
    this.message = "";

    this.stripEl = null;
    this.boxes = [];
  }

  enter() {
    this.setupDOM();
    this.startLevel();
  }
  // needs some edits to ensure it doens't conflict with any other css
  setupDOM() {
    this.container.innerHTML = `
            <div class="game-hud">
                <div>SCORE: <span id="score-el">0</span></div>
                <div>LEVEL: <span id="level-el">1</span></div>
            </div>
            
            <div class="target-display">
                FIND TARGET
                <span id="target-el">?</span>
            </div>

            <div class="array-container">
                <div class="scanner-reticle"></div>
                <div class="array-strip" id="strip-el"></div>
            </div>

            <div class="message-overlay" id="msg-el"></div>
        `;

    this.stripEl = document.getElementById("strip-el");
  }

  startLevel() {
    this.arraySize = 20 + this.level * 5;
    this.currentSpeed = Math.max(0.1, 0.5 - this.level * 0.05);

    this.data = [];
    this.boxes = [];
    this.stripEl.innerHTML = "";

    // Use a Set to ensure O(1) lookups for uniqueness
    const usedNumbers = new Set();

    for (let i = 0; i < this.arraySize; i++) {
      let val;
      do {
        // Range 10-999 to ensure enough unique numbers for higher levels
        val = Math.floor(Math.random() * 990) + 10;
      } while (usedNumbers.has(val));

      usedNumbers.add(val);
      this.data.push(val);

      const box = document.createElement("div");
      box.className = "data-box";
      box.textContent = val;
      this.stripEl.appendChild(box);
      this.boxes.push(box);
    }

    if (this.boxes.length > 0) {
      const firstBox = this.boxes[0];
      const rect = firstBox.getBoundingClientRect();
      const style = window.getComputedStyle(firstBox);
      const margin =
        parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      this.itemTotalWidth = rect.width + margin;
    }

    const minIndex = Math.floor(this.arraySize * 0.2);
    this.targetIndex =
      Math.floor(Math.random() * (this.arraySize - minIndex)) + minIndex;
    this.targetValue = this.data[this.targetIndex];

    this.currentIndex = 0;
    this.timer = 0;
    this.isPlaying = true;
    this.message = "";

    document.getElementById("target-el").innerText = this.targetValue;
    document.getElementById("score-el").innerText = this.score;
    document.getElementById("level-el").innerText = this.level;
    document.getElementById("msg-el").style.display = "none";

    this.updateStripVisuals();
  }

  update(dt) {
    if (this.engine.input.isPressed("Escape")) {
      this.engine.sceneManager.changeScene(MenuScene);
      return;
    }

    if (!this.isPlaying) {
      if (this.engine.input.isPressed("Space")) {
        if (this.message.includes("OVER")) {
          this.score = 0;
          this.level = 1;
        }
        this.startLevel();
      }
      return;
    }

    if (this.engine.input.isPressed("Space")) {
      this.handleLockAttempt();
      return;
    }

    this.timer += dt;
    if (this.timer >= this.currentSpeed) {
      this.timer = 0;
      this.currentIndex++;

      if (this.currentIndex > this.targetIndex) {
        this.fail("MISSED TARGET");
      } else if (this.currentIndex >= this.arraySize) {
        this.fail("OUT OF BOUNDS");
      }

      this.updateStripVisuals();
    }
  }

  handleLockAttempt() {
    this.isPlaying = false;

    if (this.currentIndex === this.targetIndex) {
      this.boxes[this.currentIndex].classList.add("locked-correct");
      this.score += 100 + this.level * 50;
      this.level++;
      this.showMessage("MATCH FOUND!", "var(--neon-green)");
    } else {
      this.boxes[this.currentIndex].classList.add("locked-wrong");
      this.boxes[this.targetIndex].style.borderColor = "white";
      this.fail("WRONG INDEX");
    }
  }

  fail(reason) {
    this.isPlaying = false;
    this.showMessage(`GAME OVER: ${reason}`, "var(--neon-red)");
  }

  showMessage(text, color) {
    const msgEl = document.getElementById("msg-el");
    msgEl.innerText = text + " [PRESS SPACE]";
    msgEl.style.color = color;
    msgEl.style.display = "block";
  }

  updateStripVisuals() {
    const halfWidth = this.itemTotalWidth / 2;
    const offset = -(this.currentIndex * this.itemTotalWidth + halfWidth);

    this.stripEl.style.transform = `translateX(${offset}px)`;

    const prevBox = this.boxes[this.currentIndex - 1];
    if (prevBox) prevBox.classList.remove("active");

    const currentBox = this.boxes[this.currentIndex];
    if (currentBox) currentBox.classList.add("active");
  }
}
