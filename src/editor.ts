import { LitElement, html, nothing, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent, LovelaceCardEditor } from "custom-card-helpers";
import {
  Config,
  Device,
  ExtendedHomeAssistant,
  ResistiveVariant,
  VARIANT_OPTIONS,
} from "./types";

// Calibration (interpolation points, min/max resistance, interpolation
// kind, open-circuit threshold) is configured in the SmartVan.io
// add-on UI. The card editor only holds display preferences.
@customElement("smartvan-io-resistive-sensor-editor")
class SmartVanIOResistiveSensorCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass!: ExtendedHomeAssistant;

  @state() private _possibleDevices: Device[] = [];
  @state() private _config: Config = {
    type: "custom:smartvan-io-resistive-sensor",
    device: "",
    variant: "tile",
  };

  static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .full-width {
      width: 100%;
    }
    .row {
      display: flex;
      gap: 12px;
    }
    .row > * {
      flex: 1;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }
  `;

  public setConfig(config: Config): void {
    this._possibleDevices = Object.values(this.hass?.devices || {})
      .filter((item: any) => item.manufacturer === "smartvanio")
      .filter((item: any) => item.model === "resistive_sensor");

    if (!config.device && this._possibleDevices.length === 1) {
      fireEvent(this, "config-changed", {
        config: { ...config, device: this._possibleDevices[0].id },
      });
    }

    this._config = { variant: "tile", ...config };
  }

  render() {
    if (!this.hass || !this._config) return nothing;

    return html`
      <div class="card-config">
        <ha-select
          class="full-width"
          label="Resistive sensor module"
          @closed=${(e: Event) => e.stopPropagation()}
          @selected=${(e: any) => this._setDevice(e.target.value)}
          .value=${this._config.device}
        >
          ${this._possibleDevices.map(
            (option) => html`
              <mwc-list-item .value=${option.id}>${option.name}</mwc-list-item>
            `
          )}
        </ha-select>

        <ha-select
          class="full-width"
          label="Style"
          @closed=${(e: Event) => e.stopPropagation()}
          @selected=${(e: any) => this._setVariant(e.target.value)}
          .value=${this._config.variant ?? "tile"}
        >
          ${VARIANT_OPTIONS.map(
            (option) => html`
              <mwc-list-item .value=${option.value}>${option.label}</mwc-list-item>
            `
          )}
        </ha-select>

        <div class="row">
          <ha-textfield
            label="Min (gauge / bar)"
            type="number"
            .value=${String(this._config.min ?? 0)}
            @change=${(e: any) => this._setNumber("min", e.target.value)}
          ></ha-textfield>
          <ha-textfield
            label="Max (gauge / bar)"
            type="number"
            .value=${String(this._config.max ?? 100)}
            @change=${(e: any) => this._setNumber("max", e.target.value)}
          ></ha-textfield>
        </div>

        <div class="hint">
          Calibration (interpolation points, resistance limits, method) lives
          in the SmartVan.io add-on — open it from the Home&nbsp;Assistant sidebar.
        </div>
      </div>
    `;
  }

  private _setDevice(device: string) {
    fireEvent(this, "config-changed", {
      config: { ...this._config, device },
    });
  }

  private _setVariant(variant: ResistiveVariant) {
    fireEvent(this, "config-changed", {
      config: { ...this._config, variant },
    });
  }

  private _setNumber(key: "min" | "max", raw: string) {
    const value = raw === "" ? undefined : Number(raw);
    fireEvent(this, "config-changed", {
      config: { ...this._config, [key]: value },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "smartvan-io-resistive-sensor-editor": SmartVanIOResistiveSensorCardEditor;
  }
}
