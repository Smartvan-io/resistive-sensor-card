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
    minResistance: 0,
    maxResistance: 190,
  };

  @property({ attribute: false }) public entities!: {};
  @property({ attribute: false }) private _possibleDevices: Device[] = [];
  @property({ attribute: false }) public _entities!: {
    sensor_1: Entity;
    sensor_1_input_open: Entity;
    sensor_1_open_circuit_voltage_theshold: Entity;
    sensor_1_wiper_value: Entity;
    sensor_1_interpolated_value: Entity;
  };
  @property({ attribute: false }) private interpolationPoints = [];
  @state() private activeTab = 0;

  static getConfigElement() {
    return document.createElement("smartvan-io-resistive-sensor-editor");
  }

  static styles = css`
    .wrapper {
      opacity: 0.5;
      display: flex;
    }
    .enabled {
      opacity: 1;
    }
    .parent {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 96px;
      position: relative;
      opacity: 0.8;
    }
    .floor {
      width: 100%;
      display: flex;
      border-bottom: 1px solid white;
      margin-bottom: 24px;
    }
    .button {
      width: 100%;
    }
    ha-control-button.active {
      --control-button-icon-color: white;
      --control-button-background-color: var(--success-color);
      --control-button-background-opacity: 0.5;
      --control-button-text-color: white;
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
    if (!this.config || !this._entities)
      return html`<ha-card>Loading...</ha-card>`;

    const interpolationPoints = JSON.parse(
      this._getAttributes(`sensor_${this.activeTab + 1}_interpolated_value`)
        .interpolation_points
    );

    return html`
      <ha-card>
        <ha-dialog-header>
          <span slot="title">Sensor Config</span>
        </ha-dialog-header>

        <div class="card-content">
          <mwc-tab-bar
            activeIndex=${this.activeTab}
            @MDCTabBar:activated=${(e) => (this.activeTab = e.detail.index)}
          >
            <mwc-tab label="Sensor 1"></mwc-tab>
            <mwc-tab label="Sensor 2"></mwc-tab>
          </mwc-tab-bar>
          <div>
            Interpolated value:
            ${this._getState(`sensor_${this.activeTab + 1}_interpolated_value`)}
          </div>
          <div>
            Actual value: ${this._getState(`sensor_${this.activeTab + 1}`)}
          </div>

          ${interpolationPoints.map(
            (point, index) => html`
              <div>
                <ha-textfield
                  class="field"
                  label="Voltage"
                  .value=${point[0] || 0}
                  @change=${(e: any) =>
                    this._setPoint(e.target.value, index, 0)}
                ></ha-textfield>
                <ha-textfield
                  class="field"
                  label="Output"
                  .value=${point[1] || 0}
                  @change=${(e: any) =>
                    this._setPoint(e.target.value, index, 1)}
                ></ha-textfield>
              </div>
            `
          )}
          <button
            @click=${() => this._addPoint(`sensor_${this.activeTab + 1}`)}
          >
            Add
          </button>
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

      console.log(customElements.get("mwc-tab-bar"));
      console.log(customElements.get("mwc-tab"));
    });
  }

  _getState(key: string) {
    const entity = this._entities[key];
    return this.hass.states[entity.entity_id!].state;
  }

  _setPoint(value, index, point) {
    const device = this.hass.devices[this.config.device].name.replace(" ", "-");
    const interpolationPoints = JSON.parse(
      this._getAttributes(this._entities.sensor_1_interpolated_value)
        .interpolation_points
    );

    // console.log(interpolationPoints[index], index);

    this.hass.callService("smartvanio", "update_config_entry", {
      device_id: device,
      sensor_id: "sensor_1",
      interpolation_points: JSON.stringify(
        set([...interpolationPoints], [index, point], Number(value))
      ),
    });
  }

  _addPoint(sensor_id: string) {
    const device = this.hass.devices[this.config.device].name.replace(" ", "-");
    const interpolationPoints = JSON.parse(
      this._getAttributes(`${sensor_id}_interpolated_value`)
        .interpolation_points
    );

    this.hass.callService("smartvanio", "update_config_entry", {
      device_id: device,
      sensor_id,
      interpolation_points: JSON.stringify([...interpolationPoints, [0, 0]]),
    });
  }

  private _getAttributes(key: string): Attributes {
    if (!key) {
      return "";
    }

    const entity = this._entities[key];
    return this.hass.states[entity.entity_id!].attributes;
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
      const newKey = cur.name!.replace(/ /g, "_").toLowerCase();

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
