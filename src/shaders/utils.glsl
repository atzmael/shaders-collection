void hexToRgb(vec3 hex, out vec3 result) {
    float r = clamp(hex / 255.0, 0.0, 1.0);
    float g = clamp(hex / 255.0, 0.0, 1.0);
    float b = clamp(hex / 255.0, 0.0, 1.0);
    result = vec3(r, g, b);
}