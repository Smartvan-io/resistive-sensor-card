import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

// Two-column tile per sensor: large interpolated value on top, raw
// voltage as a small caption underneath. Sensible default for users
// who don't yet think in terms of percentages.
@customElement("smartvan-io-resistive-tile")
class SmartVanIOResistiveTile extends LitElement {
  @property() public label: string = "Sensor";
  @property() public interpolated: string = "—";
  @property() public unit: string = "";
  @property() public raw: string = "—";
  @property({ attribute: false }) public openCircuit: boolean = false;

  static styles = css`
    :host {
      display: block;
    }
    .tile {
      background: var(--card-background-color, #16181d);
      border: 1px solid var(--divider-color, #2a2d33);
      border-radius: 6px;
      padding: 14px;
      text-align: center;
    }
    .label {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .value {
      font-size: 2.4rem;
      line-height: 1;
      font-weight: 600;
      margin-top: 6px;
    }
    .unit {
      color: var(--secondary-text-color);
      font-size: 1.2rem;
      margin-left: 2px;
    }
    .raw {
      margin-top: 10px;
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }
    .warn {
      margin-top: 8px;
      color: var(--warning-color, #fbbf24);
      font-size: 0.85rem;
    }
  `;

  render() {
    return html`
      <div class="tile">
        <div class="label">${this.label}</div>
        <div class="value">
          ${this.interpolated}<span class="unit">${this.unit}</span>
        </div>
        <div class="raw">raw: ${this.raw} V</div>
        ${this.openCircuit
          ? html`<div class="warn">⚠ open circuit</div>`
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "smartvan-io-resistive-tile": SmartVanIOResistiveTile;
  }
}
