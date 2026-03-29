export type ZoomLevel = "hour" | "day" | "week" | "month" | "year";

interface ScaleEntry { unit: string; step: number; date: string }

export interface ZoomConfig {
  label: string;
  scales: [ScaleEntry, ...ScaleEntry[]];
}

export const ZOOM_LEVELS: Record<ZoomLevel, ZoomConfig> = {
  hour: {
    label: "Hour",
    scales: [
      { unit: "day", step: 1, date: "%d %M" },
      { unit: "hour", step: 1, date: "%H:%i" },
    ],
  },
  day: {
    label: "Day",
    scales: [
      { unit: "month", step: 1, date: "%F %Y" },
      { unit: "day", step: 1, date: "%d" },
    ],
  },
  week: {
    label: "Week",
    scales: [
      { unit: "month", step: 1, date: "%F %Y" },
      { unit: "week", step: 1, date: "Week %W" },
    ],
  },
  month: {
    label: "Month",
    scales: [
      { unit: "year", step: 1, date: "%Y" },
      { unit: "month", step: 1, date: "%M" },
    ],
  },
  year: {
    label: "Year",
    scales: [
      { unit: "year", step: 1, date: "%Y" },
    ],
  },
};

export const ZOOM_ORDER: ZoomLevel[] = ["hour", "day", "week", "month", "year"];
