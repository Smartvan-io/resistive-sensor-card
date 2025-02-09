import { LitElement, html, nothing, css, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent, LovelaceCardEditor } from "custom-card-helpers";
import { Config, Device, Entity, ExtendedHomeAssistant } from "./types";

const options = [
  {
    text: "Water tank",
    value: "water_tank",
  },
  {
    text: "Thermometer",
    value: "thermometer",
  },
];

const computeR1 = (R2_min: number = 0, R2_max: number = 0) => {
  const Vin = 5;
  const Vout_max = 2.9;

  // R1 = (Vin * R2_max / Vout_max) - R2_max
  const R2 = Math.max(R2_min, R2_max);
  const numerator = Vin * R2;
  const denominator = Vout_max;
  const R1 = numerator / denominator - R2;

  return R1;
};

@customElement("smartvan-io-resistive-sensor-editor")
class SmartVanIOResistiveSensorCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass!: ExtendedHomeAssistant;
  @property({ attribute: false }) public _entities!: {
    sensor_1: Entity;
    sensor_1_input_open: Entity;
    sensor_1_open_circuit_voltage_theshold: Entity;
    sensor_1_reference_value: Entity;
    sensor_1_wiper_value: Entity;
    sensor_1_interpolated_value: Entity;
    sensor_1_interpolation_points: Entity;
  };
  @property({ attribute: false }) private _possibleDevices: Device[] = [];
  @state() private _config: Config = {
    type: "custom:smartvan-io-resistive-sensor",
    device: "",
    minResistance: 0,
    maxResistance: 190,
  };
  @state() private _interpolationPoints = "";
  @state() private _wiperValue = 0;

  static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
    }
    .full-width-select {
      width: 100%;
      margin-bottom: 10px;
    }
    .mb {
      margin-bottom: 32px;
    }
    .input-group {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      justify-content: space-between;
    }
    .alert {
      margin-bottom: 10px;
    }
  `;

  // Lovelace will call setConfig with the current configuration
  public setConfig(config: Config): void {
    this._entities = this._getEntitiesForDevice(config.device);

    this._possibleDevices = Object.values(this.hass.devices)
      .filter((item) => item.manufacturer === "smartvanio")
      .filter((item) => item.model === "resistive_sensor");

    if (!config?.device) {
      if (this._possibleDevices.length === 1) {
        this._entities = this._getEntitiesForDevice(
          this._possibleDevices[0].id
        );
        fireEvent(this, "config-changed", {
          config: {
            ...config,
            device: this._possibleDevices[0].id,
          },
        });
      }
    } else {
      this._entities = this._getEntitiesForDevice(config.device);
    }

    this._config = {
      ...config,
    };
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this._interpolationPoints =
      this._getState(this._entities.sensor_1_interpolation_points) || "[]";

    const computedR1 = computeR1(
      this._config.minResistance,
      this._config.maxResistance
    );

    // this._setValue(this._entities.sensor_1_wiper_value.entity_id, computedR1);
  }

  // Render your editor form
  render() {
    if (!this.hass || !this._config) return nothing;

    const isUnavailable =
      !this._config.device ||
      this._getEntityStates()?.some((item) => item === "unavailable");

    const interpolationPoints = JSON.parse(this._interpolationPoints || "[]");

    return html`
      <div class="card-config">
        <div>
          <div>
            Interpolated value:
            ${this._getState(this._entities.sensor_1_interpolated_value)}
          </div>
          <div>Actual value: ${this._getState(this._entities.sensor_1)}</div>
        </div>
        <div>
          <ha-textfield
            class="field"
            label="Min Resistance"
            .value=${this._config.minResistance}
            type="number"
            @change=${(e: any) => {
              fireEvent(this, "config-changed", {
                config: {
                  ...this._config,
                  minResistance: Number(e.target.value || 0),
                },
              });
            }}
          ></ha-textfield>
          <ha-textfield
            class="field"
            label="Max Resistance"
            .value=${this._config.maxResistance}
            type="number"
            @change=${(e: any) => {
              fireEvent(this, "config-changed", {
                config: {
                  ...this._config,
                  maxResistance: Number(e.target.value || 0),
                },
              });
            }}
          ></ha-textfield>
        </div>
        ${interpolationPoints.map(
          (point, index) => html`
            <div>
              <ha-textfield
                class="field"
                label="Voltage"
                .value=${point[0]}
                @change=${(e: any) => this._setPoint(e.target.value, index, 0)}
              ></ha-textfield>
              <ha-textfield
                class="field"
                label="Output"
                .value=${point[1]}
                @change=${(e: any) => this._setPoint(e.target.value, index, 1)}
              ></ha-textfield>
            </div>
          `
        )}
      </div>
    `;
  }

  private _getEntityStates() {
    if (!this._entities) {
      return [];
    }

    return Object.values(this._entities).map(
      (item) => this.hass.states[item.entity_id].state
    );
  }

  private _findEntitiesByDeviceId(deviceId: string) {
    if (!this.hass) {
      return [];
    }

    return Object.values(this.hass.entities).filter(
      (entity) => entity.device_id === deviceId
    );
  }

  private _getEntitiesForDevice(device: string) {
    if (!device) {
      return {};
    }

    const entities = this._findEntitiesByDeviceId(device);

    const entitiesObject = entities.reduce((acc: Object, cur: Entity) => {
      const newKey = cur.name!.replace(/ /g, "_").toLowerCase();

      return {
        ...acc,
        [newKey]: cur,
      };
    }, {});

    return entitiesObject;
  }

  private _getState(entity: Entity) {
    if (!entity) {
      return "";
    }

    return this.hass.states[entity.entity_id!].state;
  }

  private _setPoint(value, index, pos) {
    const interpolationPoints = JSON.parse(this._interpolationPoints || "[]");
    const changes = interpolationPoints.map((point, i) => {
      if (index !== i) {
        return point;
      }

      point[pos] = Number(value);

      return point;
    });

    this.hass.callService("smartvanio", "set_calibration_data", {
      value: JSON.stringify(changes),
    });
  }

  private _setWiper(value) {}

  private _setDevice(device: string) {
    this._entities = this._getEntitiesForDevice(device);

    fireEvent(this, "config-changed", {
      config: {
        ...this._config,
        device: this._possibleDevices.find((item) => item.id === device)!.id,
      },
    });
  }

  private _setValue(entity_id: string, value: string) {
    this.hass.callService("number", "set_value", {
      entity_id,
      value,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "smartvan-io-resistive-sensor-editor": SmartVanIOResistiveSensorCardEditor;
  }
}
