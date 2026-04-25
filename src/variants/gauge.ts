import { LitElement, html, svg, css } from "lit";
import { customElement, property } from "lit/decorators.js";

// Half-disc gauge. 180° arc from min (left) to max (right). Needle
// points to the value. Visually clamped for display; the label
// shows the true value.
@customElement("smartvan-io-resistive-gauge")
class SmartVanIOResistiveGauge extends LitElement {
  @property() public label: string = "Sensor";
  @property({ attribute: false }) public value: number = NaN;
  @property() public unit: string = "";
  @property({ attribute: false }) public min: number = 0;
  @property({ attribute: false }) public max: number = 100;

  static styles = css`
    :host {
      display: block;
    }
    .gauge {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
    }
    svg {
      width: 100%;
      max-width: 220px;
      height: auto;
    }
    .label {
      margin-top: 4px;
      color: var(--secondary-text-color);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-size: 0.85rem;
    }
    .value {
      color: var(--primary-text-color);
      font-weight: 600;
      font-size: 1.4rem;
      margin-top: 2px;
    }
  `;

  render() {
    const v = Number(this.value);
    const haveValue = !isNaN(v);
    const display = haveValue ? `${v.toFixed(1)}${this.unit}` : "—";
    const range = this.max - this.min || 1;
    const fraction = haveValue
      ? Math.min(1, Math.max(0, (v - this.min) / range))
      : 0;
    // Needle goes from -90° (min, leftmost) to +90° (max, rightmost).
    const needleAngle = -90 + fraction * 180;

    return html`
      <div class="gauge">
        <svg viewBox="-110 -110 220 130" aria-hidden="true">
          <!-- Track -->
          <path
            d="M -100 0 A 100 100 0 0 1 100 0"
            fill="none"
            stroke="var(--divider-color, #2a2d33)"
            stroke-width="14"
            stroke-linecap="round"
          />
          <!-- Filled portion -->
          <path
            d="${arcPath(-180, -180 + fraction * 180, 100)}"
            fill="none"
            stroke="#3b82f6"
            stroke-width="14"
            stroke-linecap="round"
            opacity=${haveValue ? 1 : 0.3}
          />
          <!-- Needle -->
          <g transform="rotate(${needleAngle})">
            <line x1="0" y1="0" x2="0" y2="-90" stroke="var(--primary-text-color)" stroke-width="3" />
            <circle r="6" fill="var(--primary-text-color)" />
          </g>
        </svg>
        <div class="value">${display}</div>
        <div class="label">${this.label}</div>
      </div>
    `;
  }
}

// SVG arc helper. Angles in degrees, 0 = right, increasing CCW (math
// convention); we draw clockwise so callers should pass startDeg
// less than endDeg with both in the [-180, 0] range.
function arcPath(startDeg: number, endDeg: number, radius: number): string {
  const toXY = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return [Math.cos(rad) * radius, Math.sin(rad) * radius];
  };
  const [x1, y1] = toXY(startDeg);
  const [x2, y2] = toXY(endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  // Sweep flag 1 = clockwise around the centre.
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
}

declare global {
  interface HTMLElementTagNameMap {
    "smartvan-io-resistive-gauge": SmartVanIOResistiveGauge;
  }
}
