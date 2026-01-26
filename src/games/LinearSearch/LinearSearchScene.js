import Scene from "../../scenes/Scene.js";
import MenuScene from "../../scenes/MenuScene.js";
import { COLORS, FONTS } from "../../core/Constants.js";

export default class LinearLockScene extends Scene {
  constructor(engine) {
    super(engine);
    this.baseArraySize = 20;
    this.baseSpeed = 0.5;
    this.data = [];
    this.targetValue = 0;
    this.targetIndex = 0;
    this.currentIndex = 0;
    this.timer = 0;
    this.currentSpeed = 0;
    this.isPlaying = false;
    this.score = 0;
    this.level = 1;
    this.message = "";

    this.boxSize = 60;
    this.boxMargin = 10;
    this.itemWidth = this.boxSize + this.boxMargin;
    this.stripOffsetX = 0;
    this.targetStripX = 0;
  }

  enter() {
    this.startLevel();
  }

  startLevel() {
    const sizeIncrement = (this.level - 1) * 5;
    this.arraySize = this.baseArraySize + sizeIncrement;
    this.currentSpeed = Math.max(0.1, this.baseSpeed - this.level * 0.04);

    this.data = [];
    const usedNumbers = new Set();
    for (let i = 0; i < this.arraySize; i++) {
      let val;
      do {
        val = Math.floor(Math.random() * 990) + 10;
      } while (usedNumbers.has(val));
      usedNumbers.add(val);
      this.data.push({ value: val, state: "neutral" });
    }

    const minIndex = Math.floor(this.arraySize * 0.25);
    this.targetIndex =
      Math.floor(Math.random() * (this.arraySize - minIndex)) + minIndex;
    this.targetValue = this.data[this.targetIndex].value;

    this.currentIndex = 0;
    this.timer = 0;
    this.isPlaying = true;
    this.message = "";

    this.updateStripTarget(true);
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
    let stepped = false;
    while (this.timer >= this.currentSpeed) {
      this.timer -= this.currentSpeed;
      this.currentIndex++;
      stepped = true;

      if (this.currentIndex > this.targetIndex) {
        this.fail("MISSED TARGET");
        return;
      } else if (this.currentIndex >= this.arraySize) {
        this.fail("OUT OF BOUNDS");
        return;
      }
    }

    if (stepped) {
      this.updateStripTarget(false);
    }

    const speed = 15 * dt;
    this.stripOffsetX += (this.targetStripX - this.stripOffsetX) * speed;
  }

  updateStripTarget(snap) {
    const center = this.width / 2;
    this.targetStripX =
      center - this.currentIndex * this.itemWidth - this.boxSize / 2;

    if (snap) this.stripOffsetX = this.targetStripX;
  }

  handleLockAttempt() {
    this.isPlaying = false;
    this.stripOffsetX = this.targetStripX;

    if (this.currentIndex === this.targetIndex) {
      this.data[this.currentIndex].state = "correct";
      this.score += 100 + this.level * 50;
      this.level++;
      this.message = "MATCH FOUND!";
      this.messageColor = COLORS.green;
    } else {
      this.data[this.currentIndex].state = "wrong";
      if (this.data[this.targetIndex])
        this.data[this.targetIndex].state = "missed";
      this.fail("WRONG INDEX");
    }
  }

  fail(reason) {
    this.isPlaying = false;
    this.message = `GAME OVER: ${reason}`;
    this.messageColor = COLORS.red;
  }

  render(ctx) {
    ctx.fillStyle = COLORS.white;
    ctx.font = FONTS.main;
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${this.score}`, 20, 40);
    ctx.textAlign = "right";
    ctx.fillText(`LEVEL: ${this.level}`, this.width - 20, 40);

    ctx.textAlign = "center";
    ctx.fillStyle = COLORS.blue;
    ctx.font = FONTS.main;
    ctx.fillText("FIND TARGET", this.width / 2, 100);
    ctx.font = FONTS.huge;
    ctx.fillText(this.targetValue, this.width / 2, 180);

    const stripY = 300;

    this.data.forEach((item, i) => {
      const x = this.stripOffsetX + i * this.itemWidth;
      if (x < -100 || x > this.width + 100) return;

      ctx.fillStyle = "#222";
      if (item.state === "correct") ctx.fillStyle = COLORS.green;
      if (item.state === "wrong") ctx.fillStyle = COLORS.red;

      ctx.fillRect(x, stripY, this.boxSize, this.boxSize);

      ctx.strokeStyle = "#444";
      if (i === this.currentIndex) {
        ctx.strokeStyle = COLORS.green;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = COLORS.green;
      } else if (item.state === "missed") {
        ctx.strokeStyle = COLORS.white;
        ctx.setLineDash([5, 5]);
      } else {
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
      }

      ctx.strokeRect(x, stripY, this.boxSize, this.boxSize);
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      ctx.fillStyle =
        item.state === "correct" || item.state === "wrong" ? "#000" : "#888";
      if (i === this.currentIndex) ctx.fillStyle = COLORS.green;

      ctx.font = "24px 'Courier New'";
      ctx.font = FONTS.small;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.value, x + this.boxSize / 2, stripY + this.boxSize / 2);
    });

    ctx.strokeStyle = COLORS.blue;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = COLORS.blue;
    const reticleSize = this.boxSize + 14;
    ctx.strokeRect(
      this.width / 2 - reticleSize / 2,
      stripY - 7,
      reticleSize,
      reticleSize,
    );
    ctx.shadowBlur = 0;

    if (this.message) {
      ctx.fillStyle = this.messageColor || COLORS.white;
      ctx.textAlign = "center";
      ctx.font = FONTS.main;
      ctx.fillText(this.message, this.width / 2, 450);

      if (!this.isPlaying) {
        ctx.fillStyle = COLORS.white;
        ctx.font = FONTS.small;
        ctx.fillText("[PRESS SPACE]", this.width / 2, 480);
      }
    }
  }
}
