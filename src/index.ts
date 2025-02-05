import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./indicator";
import "./editor";
import { Config, Device, Entity, ExtendedHomeAssistant } from "src/types";

@customElement("smartvan-io-resistive-sensor")
class SmartVanIOResistiveSensorCard extends LitElement {
  @property({ attribute: false }) public hass!: ExtendedHomeAssistant;
  @property({ attribute: false }) public config!: Config;

  @property({ attribute: false }) public entities!: {};
  @property({ attribute: false }) private possibleDevices: Device[] = [];

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

  public updated(): void {
    if (!this.config.device || !this.entities) {
      return;
    }
  }

  protected firstUpdated(): void {}

  render() {
    if (!this.config) return html`<ha-card>Loading...</ha-card>`;

    return html`
      <ha-card>
        <ha-dialog-header>
          <span slot="title">Sensor Config</span>
        </ha-dialog-header>

        <div class="card-content">Resistive sensor</div>
      </ha-card>
    `;
  }

  public setConfig(config: Config) {
    if (!config.device) {
      throw new Error("You need to define a smartvan.io inclinometer");
    }
    this.config = config;
  }

  _getState(entity: Entity) {
    return this.hass.states[entity.entity_id!].state;
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
