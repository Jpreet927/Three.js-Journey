import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import firefliesVertexShader from "./shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "./shaders/fireflies/fragment.glsl";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";

/**
 * Base
 */
// Debug
const debugObject = {};
const gui = new GUI({
    width: 400,
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Textures
 */
const bakedTexture = textureLoader.load("./baked-2.jpg");
bakedTexture.colorSpace = THREE.SRGBColorSpace;
bakedTexture.flipY = false;

/**
 * Materials
 */
debugObject.portalColorStart = "#f4e3f8";
debugObject.portalColorEnd = "#5900ff";

gui.addColor(debugObject, "portalColorStart").onChange(() =>
    portalLightMaterial.uniforms.uColorStart.value.set(
        debugObject.portalColorStart
    )
);
gui.addColor(debugObject, "portalColorEnd").onChange(() =>
    portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
);

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
const lampMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uColorStart: { value: new THREE.Color(debugObject.portalColorStart) },
        uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd) },
    },
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader,
});

/**
 * Model
 */
gltfLoader.load("./portal.glb", (gltf) => {
    const bakedMesh = gltf.scene.children.find(
        (child) => child.name === "baked"
    );
    const poleLightAMesh = gltf.scene.children.find(
        (child) => child.name === "poleLightA"
    );
    const poleLightBMesh = gltf.scene.children.find(
        (child) => child.name === "poleLightB"
    );
    const portalLightMesh = gltf.scene.children.find(
        (child) => child.name === "portalLight"
    );

    bakedMesh.material = bakedMaterial;
    poleLightAMesh.material = lampMaterial;
    poleLightBMesh.material = lampMaterial;
    portalLightMesh.material = portalLightMaterial;

    scene.add(gltf.scene);
});

// Fireflies
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 40;
const positions = new Float32Array(firefliesCount * 3);
const scale = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 1] = Math.random() * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

    scale[i] = Math.random();
}

firefliesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
);
firefliesGeometry.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));

const firefliesMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
        uTime: { value: 0 },
    },
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

gui.add(firefliesMaterial.uniforms.uSize, "value")
    .min(0)
    .max(500)
    .step(1)
    .name("firefliesSize");

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

    // Update uniform
    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        2
    );
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

debugObject.clearColor = "#0e0024";
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, "clearColor").onChange(() => {
    renderer.setClearColor(debugObject.clearColor);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    firefliesMaterial.uniforms.uTime.value = elapsedTime;
    portalLightMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
