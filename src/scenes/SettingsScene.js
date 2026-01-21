import Scene from "./Scene.js";
import MenuScene from "./MenuScene.js";

export default class SettingsScene extends Scene {
  constructor(engine) {
    super(engine);

    // Define controllable parameters
    this.settings = [
      { label: "Curvature", key: "curvature", min: 0.0, max: 5.0, step: 0.2 },
      {
        label: "Scanlines",
        key: "scanlineIntensity",
        min: 0.0,
        max: 1.0,
        step: 0.05,
      },
      { label: "Noise", key: "noiseOpacity", min: 0.0, max: 0.5, step: 0.01 },
      {
        label: "Vignette",
        key: "vignetteOpacity",
        min: 0.0,
        max: 2.0,
        step: 0.1,
      },
      {
        label: "Aberration",
        key: "chromaticAberration",
        min: 0.0,
        max: 0.05,
        step: 0.001,
      },
      {
        label: "Resolution Scale",
        key: "resolutionScale",
        min: 0.1,
        max: 1.0,
        step: 0.1,
      },
    ];

    this.selectedIndex = 0;
  }

  enter() {
    this.container.innerHTML = `
            <div class="center-flex">
                <h1>VISUAL SETTINGS</h1>
                <div class="settings-container" id="settings-list"></div>
                <div class="menu-instructions">
                    [UP/DOWN] Select &nbsp;&bull;&nbsp; [LEFT/RIGHT] Adjust &nbsp;&bull;&nbsp; [ESC] Back
                </div>
            </div>
        `;
    this.renderList();
  }

  update(dt) {
    const input = this.engine.input;

    // Navigation
    if (input.isPressed("Escape")) {
      this.engine.sceneManager.changeScene(MenuScene);
      return;
    }
    if (input.isPressed("ArrowUp")) {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.settings.length) % this.settings.length;
      this.renderList();
    }
    if (input.isPressed("ArrowDown")) {
      this.selectedIndex = (this.selectedIndex + 1) % this.settings.length;
      this.renderList();
    }

    const activeSetting = this.settings[this.selectedIndex];
    let changed = false;

    if (input.isPressed("ArrowLeft")) {
      this.adjustSetting(activeSetting, -1);
      changed = true;
    } else if (input.isPressed("ArrowRight")) {
      this.adjustSetting(activeSetting, 1);
      changed = true;
    }

    if (changed) {
      if (activeSetting.key === "resolutionScale") {
        this.engine.crtFilter.resize();
      }
      this.renderList();
    }
  }

  adjustSetting(setting, direction) {
    const crt = this.engine.crtFilter;
    let val = crt.config[setting.key];

    val += setting.step * direction;

    // Clamp
    val = Math.max(setting.min, Math.min(setting.max, val));

    // Update Filter
    crt.config[setting.key] = val;
  }

  renderList() {
    const list = document.getElementById("settings-list");
    const crt = this.engine.crtFilter;

    list.innerHTML = this.settings
      .map((s, i) => {
        const val = crt.config[s.key];
        const percent = ((val - s.min) / (s.max - s.min)) * 100;
        const displayVal = val.toFixed(3);

        return `
                <div class="setting-row ${i === this.selectedIndex ? "selected" : ""}">
                    <div class="setting-label">${s.label}</div>
                    <div class="setting-control">
                        <span>${displayVal}</span>
                        <div class="bar-container">
                            <div class="bar-fill" style="width: ${percent}%"></div>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }
}
