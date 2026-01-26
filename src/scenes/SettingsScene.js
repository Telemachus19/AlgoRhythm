import Scene from "./Scene.js";
import {
  COLORS,
  FONTS,
  cycleFont,
  getCurrentFontName,
} from "../core/Constants.js";
import MenuScene from "./MenuScene.js";

export default class SettingsScene extends Scene {
  constructor(engine) {
    super(engine);
    this.settings = [
      { label: "Font Family", key: "fontFamily", type: "discrete" },
      {
        label: "Distortion",
        key: "barrelDistortion",
        min: 0.0,
        max: 0.5,
        step: 0.01,
      },
      {
        label: "curvature",
        key: "curvature",
        min: 0.0,
        max: 0.5,
        step: 0.01,
      },
      {
        label: "Scanlines",
        key: "scanlineIntensity",
        min: 0.0,
        max: 1.0,
        step: 0.05,
      },
      { label: "Noise", key: "staticNoise", min: 0.0, max: 0.5, step: 0.01 },
      {
        label: "Aberration",
        key: "chromaticAberration",
        min: 0.0,
        max: 0.05,
        step: 0.001,
      },
      {
        label: "Brightness",
        key: "brightness",
        min: 0.5,
        max: 1.5,
        step: 0.05,
      },
      { label: "Contrast", key: "contrast", min: 0.5, max: 1.5, step: 0.05 },
    ];
    this.selectedIndex = 0;
  }

  update(dt) {
    const input = this.engine.input;

    if (input.isPressed("Escape")) {
      this.engine.sceneManager.changeScene(MenuScene);
      return;
    }
    if (input.isPressed("ArrowUp")) {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.settings.length) % this.settings.length;
    }
    if (input.isPressed("ArrowDown")) {
      this.selectedIndex = (this.selectedIndex + 1) % this.settings.length;
    }

    const activeSetting = this.settings[this.selectedIndex];

    if (input.isPressed("ArrowLeft")) {
      this.adjustSetting(activeSetting, -1);
    } else if (input.isPressed("ArrowRight")) {
      this.adjustSetting(activeSetting, 1);
    }
  }

  adjustSetting(setting, direction) {
    if (setting.key === "fontFamily") {
      cycleFont(direction);
      return;
    }

    const crt = this.engine.crtFilter;
    let val = crt.config[setting.key];
    val += setting.step * direction;
    val = Math.max(setting.min, Math.min(setting.max, val));
    crt.config[setting.key] = val;
  }

  render(ctx) {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    // Reset Alignment
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    // Title
    ctx.fillStyle = COLORS.blue;
    ctx.font = FONTS.header;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("VISUAL SETTINGS", this.width / 2, this.height * 0.15);

    ctx.font = FONTS.main;

    const startY = this.height * 0.3;
    const rowHeight = 50;

    // Dynamic Layout
    const menuWidth = 800;
    const centerX = this.width / 2;
    const leftX = centerX - menuWidth / 2 + 50;
    const rightX = centerX + menuWidth / 2 - 250;
    const barWidth = 200;

    this.settings.forEach((s, i) => {
      const isSelected = i === this.selectedIndex;
      const y = startY + i * rowHeight;

      // Draw Label
      ctx.textAlign = "left";
      ctx.fillStyle = isSelected ? COLORS.green : COLORS.gray;
      ctx.fillText(s.label, leftX, y);

      // Draw Controls
      if (s.key === "fontFamily") {
        ctx.fillStyle = COLORS.white;
        ctx.textAlign = "left";
        ctx.fillText(getCurrentFontName(), rightX - 50, y);
      } else {
        const val = this.engine.crtFilter.config[s.key];
        const pct = (val - s.min) / (s.max - s.min);

        ctx.fillStyle = COLORS.white;
        ctx.textAlign = "right";
        const precision = s.key === "chromaticAberration" ? 3 : 2;
        ctx.fillText(val.toFixed(precision), rightX - 20, y);

        ctx.fillStyle = COLORS.darkGray;
        ctx.fillRect(rightX, y - 15, barWidth, 20);

        ctx.fillStyle = isSelected ? COLORS.green : COLORS.blue;
        ctx.fillRect(rightX, y - 15, barWidth * pct, 20);
      }

      if (isSelected) {
        ctx.strokeStyle = COLORS.green;
        ctx.lineWidth = 2;
        ctx.strokeRect(leftX - 20, y - 35, menuWidth, 50);
      }
    });

    ctx.fillStyle = COLORS.gray;
    ctx.font = FONTS.small;
    ctx.textAlign = "center";
    ctx.fillText(
      "[ARROWS] Adjust   [ESC] Back",
      this.width / 2,
      this.height * 0.9,
    );
  }
}
