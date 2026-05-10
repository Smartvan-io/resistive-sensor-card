import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent, LovelaceCardEditor } from "custom-card-helpers";
import {
  Config,
  ExtendedHomeAssistant,
  VARIANT_OPTIONS,
} from "./types";

// Schema for ha-form. ha-form is HA's standard form renderer — by
// describing the fields as selectors instead of hand-rolling
// <ha-select> + <mwc-list-item>, we get the events, validation, and
// styling that the rest of HA uses (and avoid the broken
// <ha-select>@selected event in HA 2026.4+ where clicks don't fire).
//
// Device selector filters by the smartvanio integration. We don't
// filter by model string here because the model copy can drift
// ("SmartVan.io Tank Sensor" today, etc.) — the per-device entity
// suffix lookup in index.ts is what actually proves the device is a
// resistive sensor at render time.
const SCHEMA = [
  {
    name: "device",
    required: true,
    selector: {
      device: {
        filter: { integration: "smartvanio", model: "SmartVan.io Tank Sensor" },
      },
    },
  },
  {
    name: "variant",
    required: true,
    selector: {
      select: {
        mode: "dropdown" as const,
        options: VARIANT_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
      },
    },
  },
  {
    name: "min",
    selector: { number: { mode: "box" as const, step: 1 } },
  },
  {
    name: "max",
    selector: { number: { mode: "box" as const, step: 1 } },
  },
];

const LABELS: Record<string, string> = {
  device: "Resistive sensor module",
  variant: "Style",
  min: "Min (gauge / bar)",
  max: "Max (gauge / bar)",
};

@customElement("smartvan-io-resistive-sensor-editor")
class SmartVanIOResistiveSensorCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass!: ExtendedHomeAssistant;

  @state() private _config: Config = {
    type: "custom:smartvan-io-resistive-sensor",
    device: "",
    variant: "tile",
  };

  public setConfig(config: Config): void {
    this._config = { variant: "tile", min: 0, max: 100, ...config };
  }

  render() {
    if (!this.hass || !this._config) return nothing;

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _computeLabel = (schema: { name: string }) =>
    LABELS[schema.name] ?? schema.name;

  private _valueChanged = (ev: CustomEvent) => {
    console.log("[smartvan-io-resistive-editor] _valueChanged", ev.detail);
    fireEvent(this, "config-changed", { config: ev.detail.value });
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "smartvan-io-resistive-sensor-editor": SmartVanIOResistiveSensorCardEditor;
  }
}
