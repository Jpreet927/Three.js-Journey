import { useFrame, useThree } from "@react-three/fiber";
import {
    OrbitControls,
    useHelper,
    BakeShadows,
    SoftShadows,
    AccumulativeShadows,
    RandomizedLight,
    ContactShadows,
    Sky,
    Environment,
    Lightformer,
} from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { useControls } from "leva";

export default function Experience() {
    const cube = useRef();
    const directionalLight = useRef();
    useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

    useFrame((state, delta) => {
        // const time = state.clock.elapsedTime;
        // cube.current.position.x = 2 + Math.sin(time);
        cube.current.rotation.y += delta * 0.2;
    });

    const { color, opacity, blur } = useControls("contact shadows", {
        color: "#4b2709",
        opacity: { value: 0.4, min: 0, max: 1 },
        blur: { value: 2.8, min: 0, max: 10 },
    });
    const { sunPosition } = useControls("sky", {
        sunPosition: { value: [1, 2, 3] },
    });
    const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
        useControls("environment map", {
            envMapIntensity: { value: 7, min: 0, max: 12 },
            envMapHeight: { value: 7, min: 0, max: 100 },
            envMapRadius: { value: 28, min: 10, max: 1000 },
            envMapScale: { value: 100, min: 10, max: 1000 },
        });

    const scene = useThree((state) => state.scene);

    useEffect(() => {
        scene.environmentIntensity = envMapIntensity;
    }, [envMapIntensity]);

    return (
        <>
            <Environment
                // background
                ground={{
                    height: envMapHeight,
                    radius: envMapRadius,
                    scale: envMapScale,
                }}
                // files={[
                //     "./environmentMaps/1/px.jpg",
                //     "./environmentMaps/1/nx.jpg",
                //     "./environmentMaps/1/py.jpg",
                //     "./environmentMaps/1/ny.jpg",
                //     "./environmentMaps/1/pz.jpg",
                //     "./environmentMaps/1/nz.jpg",
                // ]}
                // files={"./environmentMaps/the_sky_is_on_fire_2k.hdr"}
                preset="sunset"
            >
                {/* <color args={["#000000"]} attach="background" />
                <Lightformer
                    position-z={-5}
                    scale={10}
                    color={"red"}
                    intensity={5}
                    form={"ring"}
                /> */}
                {/* <mesh position-z={-5} scale={10}>
                    <planeGeometry />
                    <meshBasicMaterial color={[10, 0, 0]} />
                </mesh> */}
            </Environment>

            {/* <BakeShadows /> */}
            {/* <SoftShadows size={25} samples={10} focus={0} /> */}

            <color args={["ivory"]} attach={"background"} />

            <Perf position="top-left" />

            <OrbitControls makeDefault />

            {/* <AccumulativeShadows
                position={[0, -0.99, 0]}
                color="#316d39"
                opacity={0.8}
                temporal
            >
                <RandomizedLight
                    position={[1, 2, 3]}
                    amount={8}
                    radius={1}
                    ambient={0.5}
                    intensity={3}
                    bias={0.001}
                />
            </AccumulativeShadows> */}

            <ContactShadows
                position={[0, 0, 0]}
                resolution={512}
                far={5}
                color={color}
                opacity={opacity}
                blur={blur}
                frames={1}
            />

            {/* <directionalLight
                ref={directionalLight}
                position={sunPosition}
                intensity={4.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={1}
                shadow-camera-far={10}
                shadow-camera-top={5}
                shadow-camera-right={5}
                shadow-camera-bottom={-5}
                shadow-camera-left={-5}
            />
            <ambientLight intensity={1.5} />

            <Sky sunPosition={sunPosition} /> */}

            <mesh position-x={-2} position-y={1} castShadow>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh
                ref={cube}
                position-x={2}
                position-y={1}
                scale={1.5}
                castShadow
            >
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            {/* <mesh position-y={0} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh> */}
        </>
    );
}
