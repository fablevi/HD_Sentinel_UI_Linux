import { useEffect, useState } from "react";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { EventEmitter } from "events";
import {languageType} from "../components/Languages/language.model.js";

type Settings = {
  scheme: number,
  language: languageType,
  [key: string]: any;
};

type Measure = any;

const CONFIG_DIR = path.join(os.homedir(), ".cache", "hdsentinel", "config");
const SETTINGS_PATH = path.join(CONFIG_DIR, "settings.json");
const MEASURE_PATH = path.join(CONFIG_DIR, "measure.json");

const DEFAULT_SETTINGS: Settings = {
  scheme: 0,
  language: "en"
};

const DEFAULT_MEASURE: Measure = {};

class ConfigStore extends EventEmitter {
  settings: Settings;
  measure: Measure;

  constructor() {
    super();
    this.ensureFiles();
    this.settings = this.readJSON(SETTINGS_PATH, DEFAULT_SETTINGS);
    this.measure = this.readJSON(MEASURE_PATH, DEFAULT_MEASURE);
  }

  ensureFiles() {
    try {
      if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });

      if (!fs.existsSync(SETTINGS_PATH)) {
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2), { encoding: "utf8" });
      }

      if (!fs.existsSync(MEASURE_PATH)) {
        fs.writeFileSync(MEASURE_PATH, JSON.stringify(DEFAULT_MEASURE, null, 2), { encoding: "utf8" });
      }
    } catch (err) {
      console.error("ConfigStore.ensureFiles error:", err);
    }
  }

  readJSON(filePath: string, fallback: any) {
    try {
      const raw = fs.readFileSync(filePath, { encoding: "utf8" });
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`Failed to read/parse ${filePath}, using fallback.`, err);
      return fallback;
    }
  }

  writeJSON(filePath: string, value: any) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(value, null, 2), { encoding: "utf8" });
    } catch (err) {
      console.error(`Failed to write ${filePath}:`, err);
    }
  }

  getSettings() {
    return this.settings;
  }

  setSettings(updater: Partial<Settings> | ((prev: Settings) => Settings)) {
    const newSettings = typeof updater === "function" ? (updater as any)(this.settings) : { ...this.settings, ...updater };
    this.settings = newSettings;
    this.writeJSON(SETTINGS_PATH, this.settings);
    this.emit("change", { type: "settings", value: this.settings });
    return this.settings;
  }

  getMeasure() {
    return this.measure;
  }

  setMeasure(updater: Measure | ((prev: Measure) => Measure)) {
    const newMeasure = typeof updater === "function" ? (updater as any)(this.measure) : updater;
    this.measure = newMeasure;
    this.writeJSON(MEASURE_PATH, this.measure);
    this.emit("change", { type: "measure", value: this.measure });
    return this.measure;
  }

  reload() {
    this.settings = this.readJSON(SETTINGS_PATH, DEFAULT_SETTINGS);
    this.measure = this.readJSON(MEASURE_PATH, DEFAULT_MEASURE);
    this.emit("change", { type: "reload" });
  }
}

// Singleton store shared across imports
const store = new ConfigStore();

export function useLocalConfig() {
  const [settings, setSettingsState] = useState<Settings>(() => store.getSettings());
  const [measure, setMeasureState] = useState<Measure>(() => store.getMeasure());

  useEffect(() => {
    const onChange = (evt: any) => {
      if (evt.type === "settings") setSettingsState(evt.value);
      else if (evt.type === "measure") setMeasureState(evt.value);
      else if (evt.type === "reload") {
        setSettingsState(store.getSettings());
        setMeasureState(store.getMeasure());
      }
    };

    store.on("change", onChange);
    return () => {
      store.off("change", onChange);
    };
  }, []);

  const setSettings = (updater: Partial<Settings> | ((prev: Settings) => Settings)) => {
    const updated = store.setSettings(updater);
    setSettingsState(updated);
  };

  const setMeasure = (updater: Measure | ((prev: Measure) => Measure)) => {
    const updated = store.setMeasure(updater);
    setMeasureState(updated);
  };

  const reload = () => store.reload();

  return { settings, setSettings, measure, setMeasure, reload } as const;
}

export { store as localConfigStore };
export type { Settings, Measure };
