import { LitElement, html, nothing, css, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent, LovelaceCardEditor } from "custom-card-helpers";
import get from "lodash.get";
import set from "lodash.set";
import isEqual from "lodash.isequal";
import {
  Config,
  Device,
  Entities,
  Entity,
  ExtendedHomeAssistant,
} from "./types";

async function getDevice(hass: ExtendedHomeAssistant, device_id: string) {
  // One option: fetch the entire list of devices and filter (simple but heavier)
  const allDevices = hass.callWS({
    type: "smartvanio/get_resistive_sensor_config_data",
    device_id, // pass the actual device ID
  });

  return allDevices;
}

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
  @property({ attribute: false }) private sensorMeta = {};

  @state() private _config: Config = {
    type: "custom:smartvan-io-resistive-sensor",
    device: "",
  };
  @state() private _activeSensor: 1 | 2 = 1;
  @state() private _interpolationPoints = [];
  @state() private _interpolationPointsState = {
    init: false,
    "1": [],
    "2": [],
  };

  static styles = css`
    .row {
      display: flex;
      margin-bottom: 8px;
      gap: 8px;
    }

    .field {
      display: flex;
      flex: 1;
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

    .invisible {
      opacity: 0;
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

    // this._possibleDevices = Object.values(this.hass.devices)
    //   .filter((item) => item.manufacturer === "smartvanio")
    //   .filter((item) => item.model === "resistive_sensor");

    if (config?.device) {
      this._entities = this._getEntitiesForDevice(config.device);
    }

    this._config = {
      ...config,
    };
  }

  protected firstUpdated(): void {
    this._possibleDevices = Object.values(this.hass.devices)
      .filter((item) => item.manufacturer === "smartvanio")
      .filter((item) => item.model === "resistive_sensor");

    this._interpolationPoints = this._getPoints();
  }

  private _handleInterpolationPointsChange(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ) {
    if (_changedProperties.has("_interpolationPoints") && this._entities) {
      const change = _changedProperties.get("_interpolationPoints");

      if (isEqual(change, this._interpolationPoints)) {
        return;
      }

      this.hass.callService("text", "set_value", {
        entity_id: this._getEntity(
          this._getEntityKey(
            `sensor_${this._activeSensor}_interpolation_points`
          )
        ).entity_id,
        value: JSON.stringify(this._interpolationPoints),
      });
    }
  }

  private _handleSensorMeta(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ) {
    if (_changedProperties.has("_config")) {
      const change = _changedProperties.get("_config") || {};

      if (this._config.device === change.device) {
        return;
      }

      const device = this._possibleDevices.find(
        (dev) => dev.id === this._config.device
      );

      if (!device) {
        return;
      }

      const name = device.name.replace(" ", "-");

      getDevice(this.hass, name).then((response) => {
        this.sensorMeta = response;
      });
    }
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this._handleInterpolationPointsChange(_changedProperties);
    this._handleSensorMeta(_changedProperties);
    // Handle fetching new config entry data

    if (
      _changedProperties.has("_entities") &&
      _changedProperties.get("_entities")
    ) {
      if (!this._interpolationPointsState.init) {
        const sensor_1_interpolation_points = this._getPoints(1);
        const sensor_2_interpolation_points = this._getPoints(2);
        this._interpolationPointsState = {
          init: true,
          "1": sensor_1_interpolation_points,
          "2": sensor_2_interpolation_points,
        };
      }
    }

    if (_changedProperties.has("_interpolationPointsState")) {
      if (
        !(
          !_changedProperties.get("_interpolationPointsState") &&
          !this._interpolationPointsState.init
        )
      ) {
        const interpolationPoints: number[][] =
          this._interpolationPointsState[`${this._activeSensor}`];
        const last = interpolationPoints.at(-1);

        if (interpolationPoints.every(hasPoints) && !isEqual(last, [0, 0])) {
          console.log("CHANGES", "REPEATED");

          this.hass.callService("text", "set_value", {
            entity_id: this._getEntity(
              this._getEntityKey(
                `sensor_${this._activeSensor}_interpolation_points`
              )
            ).entity_id,
            value: JSON.stringify(
              this._interpolationPointsState[this._activeSensor]
            ),
          });
        }
      }
    }
  }

  // Render your editor form
  render() {
    if (!this.hass || !this._config) return nothing;

    const isUnavailable =
      !this._config.device ||
      this._getEntityStates()?.some((item) => item === "unavailable");

    const interpolationPoints =
      this._interpolationPointsState[this._activeSensor] || [];

    console.log("CHANGES", interpolationPoints);

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
            activeIndex=${this._activeSensor - 1}
            @MDCTabBar:activated=${(e) =>
              (this._activeSensor = e.detail.index + 1)}
          >
            <mwc-tab
              label=${get(this.sensorMeta, ["sensor_1", "name"], "Sensor 1")}
            ></mwc-tab>
            <mwc-tab
              label=${get(this.sensorMeta, ["sensor_2", "name"], "Sensor 2")}
            ></mwc-tab>
          </mwc-tab-bar>
          <div>
            <h3>Sensor internal resistance</h3>
            <div class="row">
              <ha-textfield
                class="field"
                label="Min Resistance"
                .value=${this._getState(
                  this._getEntityKey(
                    `sensor_${this._activeSensor}_min_resistance`
                  )
                )}
                type="number"
                @change=${(e: any) => {
                  this._setValue(
                    this._getEntity(
                      this._getEntityKey(
                        `sensor_${this._activeSensor}_min_resistance`
                      )
                    ).entity_id,
                    e.target.value
                  );
                }}
              ></ha-textfield>
              <ha-textfield
                class="field"
                label="Max Resistance"
                .value=${this._getState(
                  this._getEntityKey(
                    `sensor_${this._activeSensor}_max_resistance`
                  )
                )}
                type="number"
                @change=${(e: any) => {
                  this._setValue(
                    this._getEntity(
                      this._getEntityKey(
                        `sensor_${this._activeSensor}_max_resistance`
                      )
                    ).entity_id,
                    e.target.value
                  );
                }}
              ></ha-textfield>
            </div>

            <div>
              <h3>Interpolation points (${interpolationPoints.length})</h3>

              ${interpolationPoints.map(
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
                      : html`<button class="button invisible" disabled>
                          <ha-icon icon="mdi:close"></ha-icon>
                        </button>`}
                  </div>
                `
              )}
              ${html`<button
                class="button"
                .disabled=${!(interpolationPoints.length < 8)}
                @click=${() => this._addPoint()}
              >
                <ha-icon icon="mdi:plus"></ha-icon> Add point
              </button>`}
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

  _getEntityId(key: string) {
    return this._getEntity;
  }

  _getState(key: keyof Entities) {
    const obj = this._getStateObj(key);
    if (!obj) {
      return "unavailable";
    }
    return obj.state;
  }

  _getEntity(key: keyof Entities) {
    if (!this._entities) {
      return {} as Entity;
    }
    return this._entities[key] || {};
  }

  _getPoints(sensor: number = 1) {
    const state = this._getState(
      this._getEntityKey(`sensor_${sensor}_interpolation_points`)
    );

    try {
      const points = JSON.parse(state);
      return points.filter((item) => item);
    } catch (e) {
      return [];
    }
  }

  _setPoint(value: string, index: number, point: number) {
    const interpolationPoints =
      this._interpolationPointsState[this._activeSensor];

    this._interpolationPointsState = {
      ...this._interpolationPointsState,
      [this._activeSensor]: set(
        JSON.parse(JSON.stringify(interpolationPoints)),
        [index, point],
        Number(value)
      ),
    };
  }

  _addPoint() {
    const interpolationPoints =
      this._interpolationPointsState[this._activeSensor];

    this._interpolationPointsState = {
      ...this._interpolationPointsState,
      [this._activeSensor]: [...interpolationPoints, []],
    };
  }

  _removePoint(point: number) {
    const interpolationPoints =
      this._interpolationPointsState[this._activeSensor];

    this._interpolationPointsState = {
      ...this._interpolationPointsState,
      [this._activeSensor]: interpolationPoints.filter(
        (p, index: number) => index !== point
      ),
    };
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
