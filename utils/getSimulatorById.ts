import { subjects } from "@/lib/academic-content";


export function getSimulatorById(id: string) {
  for (const subject of subjects) {
    const sim = subject.simulators.find((s) => s.id === id);
    if (sim) return sim;
  }
  return null;
}