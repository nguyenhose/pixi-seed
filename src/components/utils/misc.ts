export function clamp(max: number, min: number, value: number) {
    if (value <= max && value >= min) return value;
    if (value > max) return max;
    if (value < min) return min;
    return value;
}