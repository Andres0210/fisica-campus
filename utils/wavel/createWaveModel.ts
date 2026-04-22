type WaveParams = {
  points: number;
  tension: number;     // T
  density: number;     // μ
  damping: number;
};

type WaveState = {
  y: Float32Array;
  v: Float32Array;
};

export function createWaveModel(params: WaveParams) {
  const { points } = params;

  const state: WaveState = {
    y: new Float32Array(points),
    v: new Float32Array(points),
  };

  function getWaveSpeed() {
    return Math.sqrt(params.tension / params.density);
  }

  function update(dt: number) {
    const c = getWaveSpeed();
    const newY = new Float32Array(state.y.length);

    for (let i = 1; i < state.y.length - 1; i++) {
      const laplacian =
        state.y[i - 1] - 2 * state.y[i] + state.y[i + 1];

      const acc = c * c * laplacian;

      state.v[i] += acc * dt;
      state.v[i] *= 1 - params.damping;

      newY[i] = state.y[i] + state.v[i] * dt;
    }

    // bordes fijos
    newY[0] = 0;
    newY[state.y.length - 1] = 0;

    state.y = newY;
  }

  function disturb(index: number, magnitude: number) {
    state.y[index] += magnitude;
  }

  function reset() {
    state.y.fill(0);
    state.v.fill(0);
  }

  function getState() {
    return state;
  }

  function setParams(newParams: Partial<WaveParams>) {
    Object.assign(params, newParams);
  }

  return {
    update,
    getState,
    disturb,
    reset,
    setParams,
  };
}