import Scene from "./Scene.js";
import { COLORS, FONTS } from "../core/Constants.js";
import LinearSearchScene from "../games/LinearSearch/LinearSearchScene.js";
import EightPuzzleScene from "../games/EightPuzzle/EightPuzzleScene.js";
import SettingsScene from "./SettingsScene.js";

export default class MenuScene extends Scene {
  constructor(engine) {
    super(engine);
    this.options = [
      { title: "Linear Lock", scene: LinearSearchScene },
      { title: "8-Puzzle", scene: EightPuzzleScene },
      { title: "Settings", scene: SettingsScene },
      { title: "Bubble Sort (Locked)", scene: null },
    ];
    this.selectedIndex = 0;
  }

  update(dt) {
    const input = this.engine.input;
    if (input.isPressed("ArrowUp")) {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.options.length) % this.options.length;
    }
    if (input.isPressed("ArrowDown")) {
      this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
    }
    if (input.isPressed("Enter")) {
      const selected = this.options[this.selectedIndex];
      if (selected.scene) {
        this.engine.sceneManager.changeScene(selected.scene);
      }
    }
  }

  render(ctx) {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = COLORS.blue;
    ctx.font = FONTS.header;
    ctx.textAlign = "center";
    ctx.fillText("ALGO RHYTHM", this.width / 2, 100);

    ctx.font = FONTS.main;
    const startY = 250;
    const gap = 50;

    this.options.forEach((opt, i) => {
      const isSelected = i === this.selectedIndex;
      const y = startY + i * gap;

      if (isSelected) {
        ctx.fillStyle = COLORS.green;
        ctx.fillText("> " + opt.title + " <", this.width / 2, y);
      } else {
        ctx.fillStyle = COLORS.gray;
        ctx.fillText(opt.title, this.width / 2, y);
      }
    });

    ctx.fillStyle = COLORS.gray;
    ctx.font = FONTS.small;
    ctx.fillText("[UP/DOWN] Select   [ENTER] Start", this.width / 2, 550);
  }
}
