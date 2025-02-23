import { LitElement, html, css, PropertyValueMap } from "lit";

import set from "lodash.set";
import { customElement, property, state } from "lit/decorators.js";
import "./indicator";
import "./editor";
import {
  Config,
  Device,
  Entity,
  ExtendedHomeAssistant,
  Attributes,
  Entities,
} from "src/types";
import { fireEvent, LovelaceCardEditor } from "custom-card-helpers";

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

//[[0,0],[1.14,20],[1.37,40],[1.65,50],[1.76,65],[1.92,85],[2.2,100]]
@customElement("smartvan-io-resistive-sensor")
class SmartVanIOResistiveSensorCard extends LitElement {
  @property({ attribute: false }) public hass!: ExtendedHomeAssistant;
  @property({ attribute: false }) public config: Config = {
    type: "custom:smartvan-io-resistive-sensor",
    device: "",
  };

  @property({ attribute: false }) public entities!: {};
  @property({ attribute: false }) private _possibleDevices: Device[] = [];
  @property({ attribute: false }) public _entities!: Entities;
  @property() private interpolationPoints = [];
  @state() private activeSensor = 1;

  static getConfigElement() {
    return document.createElement("smartvan-io-resistive-sensor-editor");
  }

  static styles = css`
    .row {
      display: flex;
      margin-bottom: 8px;
      gap: 8px;
    }

    .button {
      background: none;
      border: none;

      &:hover {
        cursor: pointer;
      }
    }

    ha-icon.icon {
      margin-top: -9px;
    }
  `;

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (!this.config.device) {
      return;
    }
  }

  protected firstUpdated(): void {
    this._entities = this._getEntitiesForDevice(this.config.device);

    this._possibleDevices = Object.values(this.hass.devices)
      .filter((item) => item.manufacturer === "smartvanio")
      .filter((item) => item.model === "resistive_sensor");

    if (!this.config?.device) {
      if (this._possibleDevices.length === 1) {
        this._entities = this._getEntitiesForDevice(
          this._possibleDevices[0].id
        );
        fireEvent(this, "config-changed", {
          config: {
            ...this.config,
            device: this._possibleDevices[0].id,
          },
        });
      }
    } else {
      this._entities = this._getEntitiesForDevice(this.config.device);
    }
  }

  render() {
    if (!this.config || !this._entities) {
      return html`<ha-card>Loading...</ha-card>`;
    }

    const interpolationPoints = this._getPoints(this.activeSensor);

    return html`
      <ha-card>
        <ha-dialog-header>
          <span slot="title">Sensor Config</span>
        </ha-dialog-header>

        <div class="card-content">
          <mwc-tab-bar
            activeIndex=${this.activeSensor - 1}
            @MDCTabBar:activated=${(e) =>
              (this.activeSensor = e.detail.index + 1)}
          >
            <mwc-tab label="Sensor 1"></mwc-tab>
            <mwc-tab label="Sensor 2"></mwc-tab>
          </mwc-tab-bar>
          <div>
            <h3>Sensor Data</h3>
            <hui-generic-entity-row
              .hass=${this.hass}
              .config=${{
                type: "sensor",
                title: "test",
                entity: this._getEntity(
                  this._getEntityKey(`sensor_${this.activeSensor}_raw`)
                ).entity_id,
              }}
            >
              ${this.hass.formatEntityState(
                this._getStateObj(
                  this._getEntityKey(`sensor_${this.activeSensor}_raw`)
                )
              )}
            </hui-generic-entity-row>

            <hui-generic-entity-row
              .hass=${this.hass}
              .config=${{
                type: "sensor",
                domain: "sensor",
                title: "test",
                entity: this._getEntity(
                  this._getEntityKey(
                    `sensor_${this.activeSensor}_interpolated_value`
                  )
                ).entity_id,
              }}
            >
              ${this.hass.formatEntityState(
                this._getStateObj(
                  this._getEntityKey(
                    `sensor_${this.activeSensor}_interpolated_value`
                  )
                )
              )}
            </hui-generic-entity-row>
          </div>
        </div>
      </ha-card>
    `;
  }

  public setConfig(config: Config) {
    if (!config.device) {
      throw new Error("You need to define a smartvan.io inclinometer");
    }

    this.config = config;

    window.loadCardHelpers().then((helpers) => {
      helpers.importMoreInfoControl("weather");

      customElements.get("mwc-tab-bar");
      customElements.get("mwc-tab");
    });
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

  _getPoints(sensor: number = 0) {
    return JSON.parse(
      this._getState(
        this._getEntityKey(`sensor_${sensor}_interpolation_points`)
      )
    );
  }

  _getStateObj(key: keyof Entities) {
    const entity = this._getEntity(key);
    return this.hass.states[entity.entity_id];
  }

  _setPoint(value: string, index: number, point: number, sensor: number) {
    const device = this.hass.devices[this.config.device].name.replace(" ", "-");
    const interpolationPoints = this._getPoints(sensor);

    this.hass
      .callService("text", "set_value", {
        entity_id: this._getEntity(
          this._getEntityKey(`sensor_${sensor}_interpolation_points`)
        ).entity_id,
        value: JSON.stringify(
          set([...interpolationPoints], [index, point], Number(value))
        ),
      })
      .then(console.log)
      .catch(console.log);
  }

  _addPoint(sensor: number) {
    const device = this.hass.devices[this.config.device].name.replace(" ", "-");
    const interpolationPoints = JSON.parse(
      this._getAttributes(
        this._getEntityKey(`sensor_${sensor}_interpolated_value`)
      ).interpolation_points
    );

    // this.interpolationPoints = [...interpolationPoints, [0, 0]];

    this.hass.callService("smartvanio", "update_config_entry", {
      device_id: device,
      sensor_id: `sensor_${sensor}`,
      interpolation_points: JSON.stringify([...interpolationPoints, [0, 0]]),
    });
  }

  _removePoint(sensor: number, point: number) {
    const device = this.hass.devices[this.config.device].name.replace(" ", "-");
    const interpolationPoints = this._getPoints(sensor).filter(
      (p, index: number) => index !== point
    );

    this.hass.callService("smartvanio", "update_config_entry", {
      device_id: device,
      sensor_id: `sensor_${sensor}`,
      interpolation_points: JSON.stringify([...interpolationPoints]),
    });
  }

  private _getAttributes(key: keyof Entities) {
    if (!key) {
      return {};
    }

    const entity = this._entities[key];

    if (!entity) {
      return {};
    }

    return this.hass.states[entity.entity_id!].attributes;
  }

  _findEntitiesByDeviceId(deviceId: string) {
    if (!this.hass) {
      return [];
    }

    console.log(deviceId);

    return Object.values(this.hass.entities).filter(
      (entity) => entity.device_id === deviceId
    );
  }

  _getEntitiesForDevice(device: string) {
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

  getCardSize() {
    return 1;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "smartvan-io-resistive-sensor": SmartVanIOResistiveSensorCard;
  }
}

// Typically in your main card file, e.g. my-card.js
if (window.customCards) {
  window.customCards.push({
    type: "smartvan-io-resistive-sensor",
    name: "Smartvan.io resistive sensor card",
    description:
      "A purpose built card for Smartvan.io resistive sensor modules",
    preview: true,
  });
}
