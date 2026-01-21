/**
 * CRTFilter.js
 * A WebGL-based CRT shader.
 * Renders curved scanlines, vignette, and noise on top of the DOM.
 */
export default class CRTFilter {
  constructor(containerId, config = {}) {
    this.container = document.getElementById(containerId);
    this.canvas = document.createElement("canvas");
    this.gl =
      this.canvas.getContext("webgl") ||
      this.canvas.getContext("experimental-webgl");

    // Configuration
    this.config = Object.assign(
      {
        curvature: 3.0,
        scanlineIntensity: 0.15,
        noiseOpacity: 0.1,
        vignetteOpacity: 0.9,
        chromaticAberration: 0.005,
      },
      config,
    );

    // CSS Setup
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.pointerEvents = "none"; // Click-through
    this.canvas.style.zIndex = "9999";

    this.container.appendChild(this.canvas);

    if (!this.gl) {
      console.error("WebGL not supported, CRT effect disabled.");
      return;
    }

    this.startTime = performance.now();
    this.initWebGL();
    this.resize();

    window.addEventListener("resize", () => this.resize());
    this.loop();
  }

  initWebGL() {
    const gl = this.gl;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const vertCode = `
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = position * 0.5 + 0.5;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

    const fragCode = `
            precision mediump float;
            varying vec2 vUv;
            uniform float uTime;
            uniform vec2 uResolution;
            uniform float uCurvature;
            uniform float uScanlineIntensity;
            uniform float uNoiseOpacity;
            uniform float uVignetteOpacity;
            uniform float uAberration;

            vec2 curve(vec2 uv) {
                uv = (uv - 0.5) * 2.0;
                vec2 offset = uv.yx;
                uv = uv + uv * offset * offset * (uCurvature * 0.05);
                uv = uv * 0.5 + 0.5;
                return uv;
            }

            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            void main() {
                vec2 uv = curve(vUv);
                if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
                    discard;
                }

                float scanline = sin(uv.y * uResolution.y * 0.5 + uTime * 5.0); 
                scanline = scanline * 0.5 + 0.5;

                float noiseR = random(uv + uTime + uAberration);
                float noiseG = random(uv + uTime);
                float noiseB = random(uv + uTime - uAberration);
                vec3 noiseColor = vec3(noiseR, noiseG, noiseB);

                float d = length(uv - 0.5);
                float vignette = smoothstep(0.4, 0.8, d) * uVignetteOpacity;

                float alpha = uScanlineIntensity;
                float finalAlpha = (1.0 - scanline) * alpha; 
                finalAlpha += vignette;
                
                vec3 finalColor = noiseColor * uNoiseOpacity;

                gl_FragColor = vec4(finalColor, finalAlpha);
            }
        `;

    const program = this.createProgram(gl, vertCode, fragCode);
    gl.useProgram(program);

    this.positionLoc = gl.getAttribLocation(program, "position");
    this.uTimeLoc = gl.getUniformLocation(program, "uTime");
    this.uResLoc = gl.getUniformLocation(program, "uResolution");
    this.uCurvatureLoc = gl.getUniformLocation(program, "uCurvature");
    this.uScanlineLoc = gl.getUniformLocation(program, "uScanlineIntensity");
    this.uNoiseLoc = gl.getUniformLocation(program, "uNoiseOpacity");
    this.uVignetteLoc = gl.getUniformLocation(program, "uVignetteOpacity");
    this.uAberrationLoc = gl.getUniformLocation(program, "uAberration");

    gl.enableVertexAttribArray(this.positionLoc);
    gl.vertexAttribPointer(this.positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(this.uCurvatureLoc, this.config.curvature);
    gl.uniform1f(this.uScanlineLoc, this.config.scanlineIntensity);
    gl.uniform1f(this.uNoiseLoc, this.config.noiseOpacity);
    gl.uniform1f(this.uVignetteLoc, this.config.vignetteOpacity);
    gl.uniform1f(this.uAberrationLoc, this.config.chromaticAberration);
  }

  createProgram(gl, vertCode, fragCode) {
    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const vertShader = createShader(gl.VERTEX_SHADER, vertCode);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fragCode);
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    return program;
  }

  resize() {
    if (!this.gl) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
    this.gl.uniform2f(this.uResLoc, width, height);
  }

  loop() {
    if (!this.gl) return;
    const currentTime = (performance.now() - this.startTime) / 1000;
    this.gl.uniform1f(this.uTimeLoc, currentTime);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    requestAnimationFrame(() => this.loop());
  }
}
