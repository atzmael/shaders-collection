#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 center = vec2(0.5, 0.5);
    float size = 0.2;

          // Angle de rotation
    float angle = u_time;

          // Matrice de rotation
    mat2 rotation = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));

    vec2 pos = st - center;
    pos = rotation * pos;
    pos += center;

          // Carré condition
    if(abs(pos.x - center.x) < size / 2.0 && abs(pos.y - center.y) < size / 2.0) {
        gl_FragColor = vec4(0.19, 0.85, 0.78, 1.0);
    } else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}