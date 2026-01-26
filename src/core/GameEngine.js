import InputHandler from "./InputHandler.js";
import SceneManager from "./SceneManager.js";
import MenuScene from "../scenes/MenuScene.js";

export default class GameEngine {
  constructor(canvas, crtFilter) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.ctx.imageSmoothingEnabled = false;

    this.lastTime = 0;
    this.input = new InputHandler();
    this.sceneManager = new SceneManager(this);
    this.crtFilter = crtFilter;

    // Handle Resizing
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.imageSmoothingEnabled = false;
  }

  start() {
    // Pre-load fonts to prevent first-render flash
    this.ctx.font = "10px 'VT323'";
    this.ctx.fillText(".", 0, 0);
    this.ctx.font = "10px 'Share Tech Mono'";
    this.ctx.fillText(".", 0, 0);

    this.sceneManager.changeScene(MenuScene);
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(timeStamp) {
    const dt = (timeStamp - this.lastTime) / 1000;
    this.lastTime = timeStamp;

    this.sceneManager.update(dt);

    this.ctx.fillStyle = "#0a0a0a";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.sceneManager.render(this.ctx);

    requestAnimationFrame(this.loop.bind(this));
  }
}
