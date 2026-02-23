import { registry } from "./IntelligenceRegistry";

export function evaluateTrack(id: string) {
  const reliability = Math.random();
  const latency = Math.random();
  const quality = Math.random();

  const score =
    (reliability * 0.4) +
    (quality * 0.4) -
    (latency * 0.2);

  // Normalize score to be somewhat readable (e.g., 0-100)
  const normalizedScore = Math.floor(score * 100);

  registry.score(id, normalizedScore);
}
