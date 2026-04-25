import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

// Horizontal fill bar. The interpolated value is clamped to [min, max]
// for visual purposes only — the numeric label still shows the true value.
@customElement("smartvan-io-resistive-bar")
class SmartVanIOResistiveBar extends LitElement {
  @property() public label: string = "Sensor";
  @property({ attribute: false }) public value: number = NaN;
  @property() public unit: string = "";
  @property({ attribute: false }) public min: number = 0;
  @property({ attribute: false }) public max: number = 100;

  static styles = css`
    :host {
      display: block;
      padding: 10px 4px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      letter-spacing: 0.04em;
    }
    .label {
      text-transform: uppercase;
    }
    .value {
      color: var(--primary-text-color);
      font-weight: 600;
    }
    .track {
      margin-top: 8px;
      background: var(--divider-color, #2a2d33);
      height: 16px;
      border-radius: 8px;
      overflow: hidden;
    }
    .fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .fill.empty {
      background: var(--secondary-text-color);
    }
  `;

  render() {
    const v = Number(this.value);
    const haveValue = !isNaN(v);
    const display = haveValue ? `${v.toFixed(1)}${this.unit}` : "—";
    const range = this.max - this.min || 1;
    const pct = haveValue
      ? Math.min(100, Math.max(0, ((v - this.min) / range) * 100))
      : 0;

    return html`
      <div class="row">
        <span class="label">${this.label}</span>
        <span class="value">${display}</span>
      </div>
      <div class="track">
        <div class="fill ${haveValue ? "" : "empty"}" style="width: ${pct}%"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "smartvan-io-resistive-bar": SmartVanIOResistiveBar;
  }
}
