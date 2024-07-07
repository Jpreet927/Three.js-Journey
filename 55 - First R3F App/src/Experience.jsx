import { useRef } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CustomObject from "./CustomObject";

extend({ OrbitControls });

export default function Experience() {
    const { camera, gl } = useThree();
    const cubeRef = useRef();
    const groupRef = useRef();

    useFrame((state, delta) => {
        // const angle = state.clock.elapsedTime;
        // state.camera.position.x = 8 * Math.sin(angle);
        // state.camera.position.z = 8 * Math.cos(angle);
        // state.camera.lookAt(0, 0, 0);

        cubeRef.current.rotation.y += delta;
        // groupRef.current.rotation.y += delta;
    });

    return (
        <>
            <orbitControls args={[camera, gl.domElement]} />
            <directionalLight position={[1, 2, 3]} intensity={2.5} />
            <ambientLight intensity={1.5} />
            <group ref={groupRef}>
                <mesh
                    scale={1.5}
                    position-x={3}
                    rotation-y={Math.PI / 4}
                    ref={cubeRef}
                >
                    <boxGeometry scale={1.5} />
                    <meshStandardMaterial color={"blue"} />
                </mesh>
                <mesh position-x={-3}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </group>
            <mesh position-y={-1} rotation-x={-Math.PI / 2} scale={[10, 5, 1]}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
            <CustomObject />
        </>
    );
}
