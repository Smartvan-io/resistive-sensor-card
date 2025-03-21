import { LitElement, html, css, PropertyValueMap } from "lit";

import get from "lodash.get";
import { customElement, property, state } from "lit/decorators.js";
import "./editor";
import {
  Config,
  Device,
  Entity,
  ExtendedHomeAssistant,
  Entities,
} from "src/types";

async function getDevice(hass, device_id) {
  // One option: fetch the entire list of devices and filter (simple but heavier)
  const allDevices = hass.callWS({
    type: "smartvanio/get_resistive_sensor_config_data",
    device_id, // pass the actual device ID
  });

  return allDevices;
}

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
  @property({ attribute: false }) private sensorMeta = {};
  @state() private activeSensor = 1;

  constructor() {
    super();
    window.loadCardHelpers().then((helpers) => {
      helpers.importMoreInfoControl("weather");

      customElements.get("mwc-tab-bar");
      customElements.get("mwc-tab");
    });
  }

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
    if (_changedProperties.has("config")) {
      const device = this._possibleDevices.find(
        (dev) => dev.id === this.config.device
      );

      if (!device) {
        return;
      }

      const name = device.name?.replace(" ", "-");

      getDevice(this.hass, name).then((response) => {
        this.sensorMeta = response;
      });

      this._entities = this._getEntitiesForDevice(device.id);
    }
  }

  protected firstUpdated(): void {
    this._possibleDevices = Object.values(this.hass.devices)
      .filter((item) => item.manufacturer === "smartvanio")
      .filter((item) => item.model === "resistive_sensor");
  }

  render() {
    if (!this.config || !this._entities) {
      return html`<ha-card>Loading...</ha-card>`;
    }

    return html`
      <ha-card>
        <ha-dialog-header>
          <span slot="title">Sensor Config</span>
        </ha-dialog-header>

        <div class="card-content">
          <mwc-tab-bar
            activeIndex=${this.activeSensor - 1}
            @MDCTabBar:activated=${(e: any) =>
              (this.activeSensor = e.detail.index + 1)}
          >
            <mwc-tab
              label=${get(this.sensorMeta, ["sensor_1", "name"], "Sensor 1")}
            ></mwc-tab>
            <mwc-tab
              label=${get(this.sensorMeta, ["sensor_2", "name"], "Sensor 2")}
            ></mwc-tab>
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
              ${this.hass.formatEntityState({
                ...this._getStateObj(
                  this._getEntityKey(
                    `sensor_${this.activeSensor}_interpolated_value`
                  )
                ),
                attributes: {
                  unit_of_measurement: "",
                },
              })}
            </hui-generic-entity-row>
          </div>
        </div>
      </ha-card>
    `;
  }

  public setConfig(config: Config) {
    if (!config.device) {
      throw new Error("You need to define a smartvan.io resistive sensor");
    }

    this.config = {
      ...config,
    };
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

  _getStateObj(key: keyof Entities) {
    const entity = this._getEntity(key);
    return this.hass.states[entity.entity_id];
  }

  _findEntitiesByDeviceId(deviceId: string) {
    if (!this.hass) {
      return [];
    }

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
