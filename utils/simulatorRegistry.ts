import HookeScene from "@/hooks/HookScene";
import WaveScene from "@/hooks/WaveScene";
import ElectricCircuitScene from "@/hooks/ElectricCircuitScene";


export const simulatorRegistry: Record<string, any> = {
  hooke: HookeScene,
  wave: WaveScene,
  "electric-circuit-losses": ElectricCircuitScene,
};
