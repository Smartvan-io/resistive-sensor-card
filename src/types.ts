import { HomeAssistant, LovelaceCardConfig } from "custom-card-helpers";
import { HassEntity } from "home-assistant-js-websocket";

export interface Entity {
  entity_id: string;
  name: string;
  device_id?: string;
}

export interface ExtendedHomeAssistant extends HomeAssistant {
  entities: Record<string, any>;
  devices: Record<string, any>;
  formatEntityState: (entity: HassEntity) => string;
}

export type ResistiveVariant = "tile" | "gauge" | "bar";

export interface Config extends LovelaceCardConfig {
  device: string;
  variant?: ResistiveVariant;
  // Bounds the gauge / bar variants fill against. Default 0..100 fits
  // the common case where calibration outputs a percentage. Override
  // when calibration outputs litres / gallons.
  min?: number;
  max?: number;
}

export interface Device {
  name: string;
  id: string;
  model?: string;
  manufacturer?: string;
}

export const VARIANT_OPTIONS: { value: ResistiveVariant; label: string }[] = [
  { value: "tile", label: "Tile (per-sensor numbers)" },
  { value: "gauge", label: "Gauge (circular fill)" },
  { value: "bar", label: "Bar (horizontal fill)" },
];
