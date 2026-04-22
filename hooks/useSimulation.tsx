import { useEffect, useState } from "react";

export function useSimulation(engine: any, model: any) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = engine.subscribe(() => {
      setTick((t) => t + 1); // fuerza re-render
    });

    return unsubscribe;
  }, [engine]);

  return {
    state: model.getState(),
    energy: model.getEnergy(),
    derived: model.getDerived(),
  };
}
