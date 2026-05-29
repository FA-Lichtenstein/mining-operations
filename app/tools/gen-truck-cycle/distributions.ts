import type { DistributionSpec, Rng } from './types.js';

export function sampleDistribution(spec: DistributionSpec, rng: Rng): number {
  switch (spec.dist) {
    case 'triangular':
      return sampleTriangular(rng, spec.min, spec.mode, spec.max);
    case 'normal':
      return Math.max(0.01, sampleNormal(rng, spec.mean, spec.sd));
    case 'exponential':
      return Math.max(0, -Math.log(1 - rng()) / spec.lambda);
    default:
      throw new Error(`Unknown distribution: ${(spec as DistributionSpec).dist}`);
  }
}

function sampleTriangular(rng: Rng, min: number, mode: number, max: number): number {
  const u = rng();
  const f = (mode - min) / (max - min);
  if (u < f) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  }
  return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

function sampleNormal(rng: Rng, mean: number, sd: number): number {
  const u1 = Math.max(rng(), Number.EPSILON);
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + sd * z;
}

export function sampleExponentialHours(rng: Rng, meanHours: number): number {
  return -Math.log(1 - rng()) * meanHours;
}
