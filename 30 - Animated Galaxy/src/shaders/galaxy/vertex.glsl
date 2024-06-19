uniform float uTime;
uniform float uSize;

attribute float aScale;
attribute vec3 aRandom;

varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float angle = atan(modelPosition.x, modelPosition.z);
    float dist = length(modelPosition.xz);
    float angleOffset = (1.0 / dist) * uTime/8.0;
    angle += angleOffset;
    modelPosition.x = cos(angle) * dist;
    modelPosition.z = sin(angle) * dist;

    modelPosition.xyz += aRandom;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = color;
}