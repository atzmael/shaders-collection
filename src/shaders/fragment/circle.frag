#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 center = vec2(0.5, 0.5);
    float size = 0.2;
    if(sqrt(pow(st.x - center.x, 2.0) + pow(st.y - center.y, 2.0)) < size / 2.0) {
        gl_FragColor = vec4(0.19, 0.85, 0.78, 1.0);
    } else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}
