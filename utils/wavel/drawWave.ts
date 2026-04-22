function drawWave(
  ctx: CanvasRenderingContext2D,
  y: Float32Array,
  width: number,
  height: number
) {
  const mid = height / 2;
  const step = width / (y.length - 1);

  ctx.beginPath();

  for (let i = 0; i < y.length; i++) {
    const x = i * step;
    const py = mid + y[i];

    if (i === 0) ctx.moveTo(x, py);
    else ctx.lineTo(x, py);
  }

  ctx.strokeStyle = "#6366f1";
  ctx.lineWidth = 2;
  ctx.stroke();
}