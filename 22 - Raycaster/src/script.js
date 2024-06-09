import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

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

const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (e) => {
    mouse.x = 2 * (e.clientX / sizes.width) - 1;
    mouse.y = -(2 * (e.clientY / sizes.height) - 1);
});

window.addEventListener("click", () => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log("click on object 1");
                break;

            case object2:
                console.log("click on object 2");
                break;

            case object3:
                console.log("click on object 3");
                break;
        }
    }
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

const gltfLoader = new GLTFLoader();
let model = null;
gltfLoader.load("/models/Duck/glTF-Binary/Duck.glb", (gltf) => {
    model = gltf.scene;
    model.position.y = -1.2;
    scene.add(gltf.scene);
});

const ambientLight = new THREE.AmbientLight("#ffffff", 0.9);
const directionalLight = new THREE.DirectionalLight("#ffffff", 2.1);
scene.add(ambientLight, directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect = null;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    object1.position.y = Math.sin(elapsedTime);
    object2.position.y = Math.sin(elapsedTime + 1);
    object3.position.y = Math.sin(elapsedTime + 2);

    raycaster.setFromCamera(mouse, camera);
    // const objectsToTest = [object1, object2, object3];
    // const intersects = raycaster.intersectObjects(objectsToTest);

    // for (const object of objectsToTest) {
    //     object.material.color.set(0xff0000);
    // }

    // for (const intersect of intersects) {
    //     intersect.object.material.color.set(0x0000ff);
    // }

    // if (intersects.length) {
    //     if (!currentIntersect) {
    //         // console.log("mouse enter");
    //     }

    //     currentIntersect = intersects[0];
    // } else {
    //     if (currentIntersect) {
    //         // console.log("mouse leave");
    //     }
    //     currentIntersect = null;
    // }

    if (model) {
        const modelIntersects = raycaster.intersectObject(model);

        if (modelIntersects.length) {
            model.scale.set(1.2, 1.2, 1.2);
        } else {
            model.scale.set(1, 1, 1);
        }
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
