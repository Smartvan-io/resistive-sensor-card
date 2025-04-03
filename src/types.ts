import { HomeAssistant, LovelaceCardConfig } from "custom-card-helpers";
import { HassEntity } from "home-assistant-js-websocket";

export interface Entity {
  entity_id: string;
  name: string;
  device_id?: string;
}

export interface ExtendedHomeAssistant extends HomeAssistant {
  entities: Record<string, any>; // Adjust types based on your needs
  devices: Record<string, any>; // Adjust types based on your needs
  formatEntityState: (entity: HassEntity) => string;
}

export interface Config extends LovelaceCardConfig {
  device: string;
  minResistance?: number;
  maxResistance?: number;
}

export interface Device {
  name: string;
  id: string;
  model?: string;
  manufacturer?: string;
}

export interface Attributes {
  interpolation_points: string;
}

export interface Entities {
  sensor_1_raw: Entity;
  sensor_1_input_open: Entity;
  sensor_1_open_circuit_voltage_theshold: Entity;
  sensor_1_wiper_value: Entity;
  sensor_1_interpolated_value: Entity;
  sensor_1_interpolation_points: Entity;
  sensor_2_raw: Entity;
  sensor_2_input_open: Entity;
  sensor_2_open_circuit_voltage_theshold: Entity;
  sensor_2_wiper_value: Entity;
  sensor_2_interpolation_points: Entity;
}
