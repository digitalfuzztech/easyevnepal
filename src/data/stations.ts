export interface Station {
  id: string;
  name: string;
  city: string;
  area: string;
  connectors: string[];
  power: string;
  hours: string;
  statusNote: string;
}

export const STATIONS: Station[] = [
  { id: "s1", name: "Valley Charge Hub — Balaju", city: "Kathmandu", area: "Balaju", connectors: ["GB/T DC", "Type 2 AC"], power: "60 kW DC + 22 kW AC", hours: "7am – 9pm", statusNote: "Operational status not live — call ahead." },
  { id: "s2", name: "Lakeside EV Point", city: "Pokhara", area: "Lakeside", connectors: ["CCS2 DC", "Type 2 AC"], power: "60 kW DC", hours: "8am – 8pm", statusNote: "Operational status not live — call ahead." },
  { id: "s3", name: "Highway Stop — Muglin", city: "Muglin", area: "Prithvi Highway", connectors: ["GB/T DC"], power: "40 kW DC", hours: "24 hrs (attended daytime)", statusNote: "Single-charger site — keep a backup plan." },
  { id: "s4", name: "Biratnagar Auto Plaza Charger", city: "Biratnagar", area: "Main Road", connectors: ["Type 2 AC"], power: "22 kW AC", hours: "9am – 7pm", statusNote: "AC only — best for top-ups while parked." },
  { id: "s5", name: "Butwal Highway Charger", city: "Butwal", area: "East-West Highway", connectors: ["GB/T DC", "Type 2 AC"], power: "60 kW DC", hours: "7am – 10pm", statusNote: "Operational status not live — call ahead." },
];
