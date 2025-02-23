import { LitElement, html, nothing, css, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent, LovelaceCardEditor } from "custom-card-helpers";
import set from "lodash.set";
import {
  Config,
  Device,
  Entities,
  Entity,
  ExtendedHomeAssistant,
} from "./types";

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

const hasPoints = (points = []) => {
  const [p1, p2] = points;
  return p1 !== undefined && p2 !== undefined;
};

@customElement("smartvan-io-resistive-sensor-editor")
class SmartVanIOResistiveSensorCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass!: ExtendedHomeAssistant;
  @property({ attribute: false }) public _entities!: Entities;
  @property({ attribute: false }) private _possibleDevices: Device[] = [];
  @state() private _config: Config = {
    type: "custom:smartvan-io-resistive-sensor",
    device: "",
  };
  @state() private _interpolationPoints = [];
  @state() private activeSensor = 1;

  // static styles = css`
  //   .card-config {
  //     display: flex;
  //     flex-direction: column;
  //   }
  // .full-width-select {
  //   width: 100%;
  //   margin-bottom: 10px;
  // }
  // .mb {
  //   margin-bottom: 32px;
  // }
  //   .input-group {
  //     display: flex;
  //     align-items: center;
  //     margin-bottom: 10px;
  //     justify-content: space-between;
  //   }
  //   .alert {
  //     margin-bottom: 10px;
  //   }
  // `;

  static styles = css`
    .row {
      display: flex;
      margin-bottom: 8px;
      gap: 8px;
    }

    .full-width-select {
      width: 100%;
      margin-bottom: 10px;
    }

    .button {
      background: none;
      border: none;

      &:hover {
        cursor: pointer;
      }
    }

    .mb {
      margin-bottom: 32px;
    }

    ha-icon.icon {
      margin-top: -9px;
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
    const computedR1 = computeR1(
      this._config.minResistance,
      this._config.maxResistance
    );

    if (_changedProperties.has("_interpolationPoints")) {
      console.log(this._interpolationPoints);
      this.hass.callService("text", "set_value", {
        entity_id: this._getEntity(
          this._getEntityKey(`sensor_${this.activeSensor}_interpolation_points`)
        ).entity_id,
        value: JSON.stringify(this._interpolationPoints),
      });
    }

    if (_changedProperties.has("activeSensor")) {
      this._interpolationPoints = this._getPoints(this.activeSensor);
    }
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this._interpolationPoints = this._getPoints();
  }

  // Render your editor form
  render() {
    if (!this.hass || !this._config) return nothing;

    const isUnavailable =
      !this._config.device ||
      this._getEntityStates()?.some((item) => item === "unavailable");

    const interpolationPoints = this._interpolationPoints;

    console.log(hasPoints(interpolationPoints[interpolationPoints.length - 1]));

    return html`
      <div class="card-config">
        <h3>Sensor Config</h3>
        <div class="card-content">
          <div>
            ${isUnavailable
              ? html`<ha-alert alert-type="error" class="alert"
                  >Either the device is unavailable or not selected!</ha-alert
                >`
              : nothing}
            <ha-select
              class="full-width-select"
              label="Device"
              @closed=${(e: Event) => e.stopPropagation()}
              @selected=${(e: any) => this._setDevice(e.target.value)}
              .value=${this._config.device}
            >
              ${this._possibleDevices.map(
                (option: Device) =>
                  html`<mwc-list-item .value=${option.id}>
                    ${option.name}
                  </mwc-list-item>`
              )}
            </ha-select>
          </div>
          <ha-alert alert-type="info" class="alert"
            >Note, the settings below are stored on the device and will be
            applied instantly! Clicking save will have no effect</ha-alert
          >
          <mwc-tab-bar
            activeIndex=${this.activeSensor - 1}
            @MDCTabBar:activated=${(e) =>
              (this.activeSensor = e.detail.index + 1)}
          >
            <mwc-tab label="Sensor 1"></mwc-tab>
            <mwc-tab label="Sensor 2"></mwc-tab>
          </mwc-tab-bar>
          <div>
            <!-- <h3>Sensor internal resistance</h3>
            <div class="row">
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
            </div> -->

            <div>
              <h3>Interpolation points (${interpolationPoints.length})</h3>

              ${[
                ...interpolationPoints,
                ...(interpolationPoints.length < 8 &&
                hasPoints(interpolationPoints[interpolationPoints.length - 1])
                  ? [[]]
                  : []),
              ].map(
                (point, index) => html`
                  <div class="row">
                    <ha-textfield
                      class="field"
                      label="Voltage"
                      .value=${point[0] || ""}
                      @change=${(e: any) =>
                        this._setPoint(e.target.value, index, 0)}
                    ></ha-textfield>
                    <ha-textfield
                      class="field"
                      label="Output"
                      .value=${point[1] || ""}
                      @change=${(e: any) =>
                        this._setPoint(e.target.value, index, 1)}
                    ></ha-textfield>
                    ${index !== interpolationPoints.length && hasPoints(point)
                      ? html`<button
                          class="button"
                          @click=${() => this._removePoint(index)}
                        >
                          <ha-icon icon="mdi:close"></ha-icon>
                        </button>`
                      : nothing}
                  </div>
                `
              )}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _getStateObj(key: keyof Entities) {
    const entity = this._getEntity(key);
    return this.hass.states[entity.entity_id];
  }

  _getEntityKey(key: string) {
    return key as keyof Entities;
  }

  _getState(key: keyof Entities) {
    return this._getStateObj(key).state;
  }

  _getEntity(key: keyof Entities) {
    return this._entities[key] || {};
  }

  _getPoints(sensor: number = 1) {
    return JSON.parse(
      this._getState(
        this._getEntityKey(`sensor_${sensor}_interpolation_points`)
      )
    );
  }

  _setPoint(value: string, index: number, point: number) {
    const device = this.hass.devices[this._config.device].name.replace(
      " ",
      "-"
    );

    this._interpolationPoints = set(
      [...this._interpolationPoints],
      [index, point],
      Number(value)
    );
  }

  _addPoint() {
    const device = this.hass.devices[this._config.device].name.replace(
      " ",
      "-"
    );

    this._interpolationPoints = [...this._interpolationPoints, ["0", "0"]];
  }

  _removePoint(point: number) {
    const device = this.hass.devices[this._config.device].name.replace(
      " ",
      "-"
    );
    this._interpolationPoints = this._interpolationPoints.filter(
      (p, index: number) => index !== point
    );

    // this.hass.callService("smartvanio", "update_config_entry", {
    //   device_id: device,
    //   sensor_id: `sensor_${sensor}`,
    //   interpolation_points: JSON.stringify([...interpolationPoints]),
    // });
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
      const newKey = cur.entity_id
        .split("resistive_sensor")[1]
        .split("_")
        .slice(2)
        .join("_")
        .toLowerCase();

      return {
        ...acc,
        [newKey]: cur,
      };
    }, {});

    return entitiesObject;
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
