// Calculate a point on a Quadratic Bezier curve
// t is from 0 to 1
function getQuadraticBezierPoint(
    p0: [number, number],
    p1: [number, number],
    p2: [number, number],
    t: number
): [number, number] {
    const x = (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0];
    const y = (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1];
    return [x, y];
}

// Calculate a control point that creates an "arch" between two points
function getControlPoint(
    p0: [number, number],
    p1: [number, number],
    offsetScale: number = 0.2
): [number, number] {
    // Midpoint
    const mx = (p0[0] + p1[0]) / 2;
    const my = (p0[1] + p1[1]) / 2;

    // Vector from p0 to p1
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];

    // Perpendicular vector (normal)
    // (-dy, dx)
    const nx = -dy;
    const ny = dx;

    // Control point is Midpoint + Normal * scale
    return [mx + nx * offsetScale, my + ny * offsetScale];
}

// Generate a smooth curved path passing through all points
export function getCurvedPath(points: [number, number][], segments: number = 20): [number, number][] {
    if (points.length < 2) return points;

    const curvedPath: [number, number][] = [];

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];

        // Determine offset direction based on index to create a "wave" or consistent arc
        // Alternating arcs (i % 2) creates a wave pattern
        const offset = (i % 2 === 0 ? 0.2 : -0.2);
        const controlPoint = getControlPoint(p0, p1, offset);

        // Generate points for this segment
        for (let j = 0; j <= segments; j++) {
            const t = j / segments;
            curvedPath.push(getQuadraticBezierPoint(p0, controlPoint, p1, t));
        }
    }

    return curvedPath;
}
