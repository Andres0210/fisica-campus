type HookeState = {
  time: number;
  position: number;
  velocity: number;
  acceleration: number;
};

type HookeParams = {
  mass: number;
  k: number;
  damping: number; // 🔥 nuevo
  amplitude: number;
};

export function createHookeModel(params: HookeParams) {
  let state: HookeState = {
    time: 0,
    position: params.amplitude,
    velocity: 0,
    acceleration: 0,
  };

  function update(dt: number) {
    const { mass, k, damping } = params;

    // F = -kx - c v
    const force = -k * state.position - damping * state.velocity;

    state.acceleration = force / mass;

    // Semi-implicit Euler (estable)
    state.velocity += state.acceleration * dt;
    state.position += state.velocity * dt;

    state.time += dt;
  }

  function getEnergy() {
    const { mass, k } = params;
    const { position, velocity } = state;

    const kinetic = 0.5 * mass * velocity * velocity;
    const potential = 0.5 * k * position * position;

    return {
      kinetic,
      potential,
      total: kinetic + potential,
    };
  }

  function reset() {
    state = {
      time: 0,
      position: params.amplitude,
      velocity: 0,
      acceleration: 0,
    };
  }

  function setParams(newParams: Partial<HookeParams>) {
    params = { ...params, ...newParams };
  }

  function setState(newState: Partial<HookeState>) {
    state = { ...state, ...newState };
  }

  function getState() {
    return state;
  }

  function getDerived() {
    const { mass, k, damping } = params;

    const omega0 = Math.sqrt(k / mass);
    const gamma = damping / (2 * mass);

    let period: number | null = null;

    if (gamma < omega0) {
      const omegaD = Math.sqrt(omega0 * omega0 - gamma * gamma);
      period = (2 * Math.PI) / omegaD;
    }

    return {
      omega0,
      gamma,
      period,
      type:
        gamma < omega0
          ? "Subamortiguado"
          : gamma === omega0
            ? "Crítico"
            : "Sobreamortiguado",
    };
  }

  return {
    update,
    getState,
    getEnergy,
    getDerived,
    reset,
    setParams,
    setState,
  };
}

type Updatable = {
  update: (dt: number) => void;
};

type Listener = () => void;

type EngineOptions = {
  maxDelta?: number;
};

export function createSimulationEngine(
  model: Updatable,
  options: EngineOptions = {},
) {
  let running = false;
  let lastTime = 0;
  let rafId: number | null = null;

  const listeners = new Set<Listener>();
  const maxDelta = options.maxDelta ?? 0.05;

  function notify() {
    listeners.forEach((l) => l());
  }

  function loop(time: number) {
    if (!running) return;

    if (!lastTime) lastTime = time;

    let dt = (time - lastTime) / 1000;
    lastTime = time;

    if (dt > maxDelta) dt = maxDelta;

    model.update(dt);

    notify(); // 🔥 clave

    rafId = requestAnimationFrame(loop);
  }

  function play() {
    if (running) return;
    running = true;
    lastTime = 0;
    rafId = requestAnimationFrame(loop);
  }

  function pause() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  function reset() {
    pause();
    lastTime = 0;

    // 👇 importante: resetear modelo también
    if ("reset" in model && typeof model.reset === "function") {
      model.reset();
    }

    notify();
  }

  function subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function isRunning() {
    return running;
  }

  return {
    play,
    pause,
    reset,
    subscribe,
    isRunning,
  };
}
