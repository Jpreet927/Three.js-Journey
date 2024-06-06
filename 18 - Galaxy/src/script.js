import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const params = {};
params.count = 100000;
params.size = 0.01;
params.radius = 5;
params.branches = 3;
params.spin = 1;
params.randomness = 0.2;
params.randomnessPower = 3;
params.insideColor = "#ff6030";
params.outsideColor = "#1b3984";

let particleGeometry = null;
let particleMaterial = null;
let points = null;

const generateGalaxy = () => {
    if (points) {
        particleGeometry.dispose();
        particleMaterial.dispose();
        scene.remove(points);
    }

    particleGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(params.count * 3);
    const colors = new Float32Array(params.count * 3);

    const colorInside = new THREE.Color(params.insideColor);
    const colorOutside = new THREE.Color(params.outsideColor);

    for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * params.radius;
        const spinAngle = radius * params.spin;
        const branchAngle =
            ((i % params.branches) / params.branches) * 2 * Math.PI;

        const randomX =
            Math.pow(Math.random(), params.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1);
        const randomY =
            Math.pow(Math.random(), params.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1);
        const randomZ =
            Math.pow(Math.random(), params.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1);

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] =
            Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / params.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    );

    particleMaterial = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });

    points = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(points);
};

generateGalaxy();

gui.add(params, "count")
    .min(100)
    .min(100000)
    .step(100)
    .onFinishChange(generateGalaxy);
gui.add(params, "size")
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(params, "radius")
    .min(0.01)
    .max(20)
    .step(0.01)
    .onFinishChange(generateGalaxy);
gui.add(params, "branches")
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generateGalaxy);
gui.add(params, "spin")
    .min(-5)
    .max(5)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(params, "randomness")
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(params, "randomnessPower")
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.addColor(params, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(params, "outsideColor").onFinishChange(generateGalaxy);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
