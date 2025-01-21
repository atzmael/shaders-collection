#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scroll;
uniform float u_scroll_direction;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 center = vec2(0.5, 0.5);
    float radius = 0.1;

    float amplitude = 0.2;
    float frequency = 0.02;

    float bounce = amplitude * sin(u_scroll * frequency);
    vec2 pos;
    if(u_scroll_direction > 0.0) {
        pos = vec2(center.x, center.y - bounce);
    } else {
        pos = vec2(center.x, center.y + bounce);
    }

    float dist = distance(st, pos);

    if(dist < radius) {
        gl_FragColor = vec4(0.19, 0.85, 0.78, 1.0);
    } else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}
