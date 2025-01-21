#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution; // Résolution de l'écran

void main() {
    // Coordonnées normalisées (entre 0.0 et 1.0)
    vec2 st = gl_FragCoord.xy / u_resolution;

    // Couleur basée sur les coordonnées
    gl_FragColor = vec4(st.x, st.y, 0.5, 1.0);
}
