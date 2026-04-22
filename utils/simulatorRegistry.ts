import HookeScene from "@/hooks/HookScene";
import WaveScene from "@/hooks/WaveScene";


export const simulatorRegistry: Record<string, any> = {
  hooke: HookeScene,
  wave: WaveScene,
};