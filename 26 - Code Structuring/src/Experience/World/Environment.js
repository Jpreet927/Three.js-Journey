import Experience from "../Experience";
import * as THREE from "three";

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.setSunlight();
        this.setEnvironmentMap();
    }

    setSunlight() {
        this.sunlight = new THREE.DirectionalLight("#ffffff", 4);
        this.sunlight.castShadow = true;
        this.sunlight.shadow.camera.far = 15;
        this.sunlight.shadow.mapSize.set(1024, 1024);
        this.sunlight.shadow.normalBias = 0.05;
        this.sunlight.position.set(3.5, 2, -1.25);
        this.scene.add(this.sunlight);
    }

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.5;
        this.environmentMap.texture =
            this.resources.items.environmentMapTexture;
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

        this.scene.environment = this.environmentMap.texture;

        this.setEnvironmentMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if (
                    child instanceof THREE.Mesh &&
                    child.material instanceof THREE.MeshStandardMaterial
                ) {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity =
                        this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            });
        };

        this.setEnvironmentMap.updateMaterials();
    }
}
