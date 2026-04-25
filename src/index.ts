import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./editor";
import "./variants/tile";
import "./variants/bar";
import "./variants/gauge";
import { Config, ExtendedHomeAssistant, ResistiveVariant } from "./types";

// Display-only card. Calibration (interpolation points, resistance
// limits, kind, threshold) lives in the SmartVan.io add-on UI.
//
// Renders both physical channels of a resistive-sensor module, in the
// chosen visual variant.
@customElement("smartvan-io-resistive-sensor")
class SmartVanIOResistiveSensorCard extends LitElement {
  @property({ attribute: false }) public hass!: ExtendedHomeAssistant;
  @property({ attribute: false }) public config!: Config;

  static getConfigElement() {
    return document.createElement("smartvan-io-resistive-sensor-editor");
  }

  static getStubConfig() {
    return { device: "", variant: "tile" };
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px;
    }
    .header {
      font-weight: 600;
      padding: 4px 4px 12px;
      color: var(--primary-text-color);
    }
    .placeholder {
      padding: 16px;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .stack {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `;

  public setConfig(config: Config) {
    if (!config.device) {
      throw new Error("You need to pick a SmartVan.io resistive sensor device");
    }
    this.config = { variant: "tile", min: 0, max: 100, ...config };
  }

  render() {
    if (!this.config) return html`<ha-card>Loading…</ha-card>`;

    const entities = this._entitiesForDevice(this.config.device);
    if (entities.length === 0) {
      return html`
        <ha-card>
          <div class="placeholder">
            Configure this card in the SmartVan.io add-on, then come back.
          </div>
        </ha-card>
      `;
    }

    const variant: ResistiveVariant = this.config.variant ?? "tile";
    const sensors = [1, 2].map((n) => this._readSensor(n, entities));

    return html`
      <ha-card>
        <div class="header">Resistive sensors</div>
        ${this._renderVariant(variant, sensors)}
      </ha-card>
    `;
  }

  private _renderVariant(variant: ResistiveVariant, sensors: SensorReading[]) {
    const min = this.config.min ?? 0;
    const max = this.config.max ?? 100;

    switch (variant) {
      case "bar":
        return html`
          <div class="stack">
            ${sensors.map(
              (s) => html`
                <smartvan-io-resistive-bar
                  label=${s.label}
                  .value=${s.interpolated}
                  .min=${min}
                  .max=${max}
                  unit=${s.unit}
                ></smartvan-io-resistive-bar>
              `
            )}
          </div>
        `;
      case "gauge":
        return html`
          <div class="grid">
            ${sensors.map(
              (s) => html`
                <smartvan-io-resistive-gauge
                  label=${s.label}
                  .value=${s.interpolated}
                  .min=${min}
                  .max=${max}
                  unit=${s.unit}
                ></smartvan-io-resistive-gauge>
              `
            )}
          </div>
        `;
      case "tile":
      default:
        return html`
          <div class="grid">
            ${sensors.map(
              (s) => html`
                <smartvan-io-resistive-tile
                  label=${s.label}
                  interpolated=${s.interpolatedDisplay}
                  raw=${s.rawDisplay}
                  unit=${s.unit}
                  .openCircuit=${s.openCircuit}
                ></smartvan-io-resistive-tile>
              `
            )}
          </div>
        `;
    }
  }

  private _readSensor(n: number, entities: any[]): SensorReading {
    const findBySuffix = (suffix: string) =>
      entities.find((e) => e.unique_id?.endsWith(`_${suffix}`)) ||
      entities.find((e) => e.entity_id?.endsWith(`_${suffix}`));

    const raw = findBySuffix(`sensor_${n}_raw`);
    const interp = findBySuffix(`sensor_${n}_interpolated_value`);
    const open = findBySuffix(`sensor_${n}_input_open`);

    const rawState = raw ? this.hass.states[raw.entity_id] : undefined;
    const interpState = interp ? this.hass.states[interp.entity_id] : undefined;
    const openState = open ? this.hass.states[open.entity_id] : undefined;

    const interpNum = parseFloat(interpState?.state ?? "");
    const rawNum = parseFloat(rawState?.state ?? "");

    return {
      label: `Sensor ${n}`,
      raw: rawNum,
      rawDisplay: isNaN(rawNum) ? "—" : rawNum.toFixed(3),
      interpolated: interpNum,
      interpolatedDisplay: isNaN(interpNum) ? "—" : interpNum.toFixed(1),
      unit: interpState?.attributes?.unit_of_measurement || "",
      openCircuit: openState?.state === "on",
    };
  }

  private _entitiesForDevice(device: string): any[] {
    if (!this.hass?.entities) return [];
    return Object.values(this.hass.entities).filter(
      (entity: any) => entity.device_id === device
    );
  }

  getCardSize() {
    return 2;
  }
}

interface SensorReading {
  label: string;
  raw: number;
  rawDisplay: string;
  interpolated: number;
  interpolatedDisplay: string;
  unit: string;
  openCircuit: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    "smartvan-io-resistive-sensor": SmartVanIOResistiveSensorCard;
  }
}

if (window.customCards) {
  window.customCards.push({
    type: "smartvan-io-resistive-sensor",
    name: "SmartVan.io Resistive Sensor",
    description:
      "Display-only card for SmartVan.io tank/level sensor modules. Pick a visual style; calibrate in the SmartVan.io add-on.",
    preview: true,
  });
}
