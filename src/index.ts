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
    // Never throw — HA's card preview pane keeps the card stuck in an
    // error state if setConfig throws on the initial stub config (device
    // is empty until the user picks one). Render a placeholder instead.
    this.config = { variant: "tile", min: 0, max: 100, ...config };
  }

  render() {
    console.log("[smartvan-io-resistive] render", { config: this.config, hasHass: !!this.hass });
    if (!this.config) return html`<ha-card>Loading…</ha-card>`;

    if (!this.config.device) {
      console.log("[smartvan-io-resistive] render → placeholder1 (no device)");
      return html`
        <ha-card>
          <div class="placeholder">
            Pick a SmartVan.io resistive sensor in the editor.
          </div>
        </ha-card>
      `;
    }

    const entities = this._entitiesForDevice(this.config.device);
    if (entities.length === 0) {
      console.log("[smartvan-io-resistive] render → placeholder2 (no entities)", { device: this.config.device });
      return html`
        <ha-card>
          <div class="placeholder">
            Configure this card in the SmartVan.io add-on, then come back.
          </div>
        </ha-card>
      `;
    }

    console.log("[smartvan-io-resistive] render → real card", { device: this.config.device, entityCount: entities.length });
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
    if (!this.hass?.entities) {
      console.log("[smartvan-io-resistive] no hass.entities", { hass: !!this.hass });
      return [];
    }
    const all = Object.values(this.hass.entities);
    const matches = all.filter((entity: any) => entity.device_id === device);
    console.log("[smartvan-io-resistive] _entitiesForDevice", {
      device,
      hassEntitiesCount: all.length,
      matchCount: matches.length,
      sampleEntity: all.find((e: any) => e.entity_id?.includes("smartvanio_res")),
    });
    return matches;
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
