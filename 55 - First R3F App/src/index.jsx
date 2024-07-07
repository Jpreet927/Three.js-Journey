import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import * as THREE from "three";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
    <>
        <Canvas
            // orthographic
            dpr={[1, 2]} // default
            gl={{
                antialias: true, //default
                toneMapping: THREE.ACESFilmicToneMapping, //default
                outputColorSpace: THREE.SRGBColorSpace, //default
            }}
            camera={{
                fov: 45,
                // zoom: 100,
                near: 0.1,
                far: 200,
                position: [3, 2, 6],
            }}
        >
            <Experience />
        </Canvas>
    </>
);
