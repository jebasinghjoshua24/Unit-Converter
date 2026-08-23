import '@testing-library/jest-dom/vitest'

// jsdom does not implement HTMLCanvasElement.getContext; mock it so the
// AnalogGauge animation loop is a safe no-op in component tests.
const ctxStub = {
  setTransform: () => {},
  clearRect: () => {},
  beginPath: () => {},
  arc: () => {},
  moveTo: () => {},
  lineTo: () => {},
  stroke: () => {},
  fill: () => {},
  fillText: () => {},
  set fillStyle(_v: string) {},
  set strokeStyle(_v: string) {},
  set lineWidth(_v: number) {},
  set shadowColor(_v: string) {},
  set shadowBlur(_v: number) {},
  set textAlign(_v: string) {},
  set textBaseline(_v: string) {},
}

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ctxStub,
  writable: true,
})
