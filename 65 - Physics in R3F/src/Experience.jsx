import { OrbitControls, useGLTF } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
    Physics,
    RigidBody,
    CuboidCollider,
    BallCollider,
    CylinderCollider,
    InstancedRigidBodies,
} from "@react-three/rapier";
import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Experience() {
    const [hitSound, setHitSound] = useState(() => new Audio("./hit.mp3"));
    const cube = useRef();
    const twister = useRef();
    const hamburger = useGLTF("./hamburger.glb");
    const CUBE_COUNT = 200;
    // const cubes = useRef();

    const cubeJump = () => {
        const mass = cube.current.mass();

        cube.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 });
        cube.current.applyTorqueImpulse({
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
            z: Math.random() - 0.5,
        });
    };

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const eulerRotation = new THREE.Euler(0, time * 3, 0);
        const quaternionRotation = new THREE.Quaternion();

        quaternionRotation.setFromEuler(eulerRotation);
        twister.current.setNextKinematicRotation(quaternionRotation);

        const angle = time / 2;
        const x = 2 * Math.cos(angle);
        const z = 2 * Math.sin(angle);
        twister.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z });
    });

    const collisionEnter = () => {
        // hitSound.currentTime = 0;
        // hitSound.volume = Math.random();
        // hitSound.play();
    };

    // useEffect(() => {
    //     for (let i = 0; i < CUBE_COUNT; i++) {
    //         const matrix = new THREE.Matrix4();
    //         matrix.compose(
    //             new THREE.Vector3(i * 2, 0, 0),
    //             new THREE.Quaternion(),
    //             new THREE.Vector3(1, 1, 1)
    //         );
    //         cubes.current.setMatrixAt(i, matrix);
    //     }
    // }, []);

    const instances = useMemo(() => {
        const instances = [];
        for (let i = 0; i < CUBE_COUNT; i++) {
            instances.push({
                key: "cube_instance_" + i,
                position: [
                    (Math.random() - 0.5) * 8,
                    6 + i * 0.2,
                    (Math.random() - 0.5) * 8,
                ],
                rotation: [Math.random(), Math.random(), Math.random()],
            });
        }

        return instances;
    }, []);

    return (
        <>
            <color args={["black"]} attach={"background"} />
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <Physics debug gravity={[0, -9.81, 0]}>
                <RigidBody colliders="ball">
                    <mesh castShadow position={[-1.5, 2, 0]}>
                        <sphereGeometry />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </RigidBody>

                {/* <RigidBody
                    colliders={false}
                    position={[0, 1, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <CuboidCollider args={[1.5, 1.5, 0.5]} />
                    <BallCollider args={[1.5]} />
                    <mesh castShadow>
                        <torusGeometry args={[1, 0.5, 16, 32]} />
                        <meshStandardMaterial color={"mediumpurple"} />
                    </mesh>
                </RigidBody> */}

                <RigidBody
                    ref={cube}
                    position={[1.5, 2, 0]}
                    restitution={0}
                    friction={0.7}
                    colliders={false}
                    onCollisionEnter={collisionEnter}
                    // onCollisionExit={() => console.log("Exit")}
                >
                    <mesh castShadow onClick={cubeJump}>
                        <boxGeometry />
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                    <CuboidCollider mass={2} args={[0.5, 0.5, 0.5]} />
                </RigidBody>

                <RigidBody type="fixed" friction={0.7}>
                    <mesh receiveShadow position-y={-1.25}>
                        <boxGeometry args={[10, 0.5, 10]} />
                        <meshStandardMaterial color="greenyellow" />
                    </mesh>
                </RigidBody>

                <RigidBody
                    position={[0, -0.8, 0]}
                    friction={0}
                    type="kinematicPosition"
                    ref={twister}
                >
                    <mesh castShadow scale={[0.4, 0.4, 3]}>
                        <boxGeometry />
                        <meshStandardMaterial color={"red"} />
                    </mesh>
                </RigidBody>

                <RigidBody colliders={false} position={[0, 4, 0]}>
                    <primitive object={hamburger.scene} scale={0.25} />
                    <CylinderCollider args={[0.5, 1.25]} />
                </RigidBody>

                <RigidBody type="fixed">
                    <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                    <CuboidCollider
                        args={[5, 2, 0.5]}
                        position={[0, 1, -5.5]}
                    />
                    <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
                    <CuboidCollider
                        args={[0.5, 2, 5]}
                        position={[-5.5, 1, 0]}
                    />
                </RigidBody>

                <InstancedRigidBodies instances={instances}>
                    <instancedMesh
                        castShadow
                        // ref={cubes}
                        args={[null, null, CUBE_COUNT]}
                    >
                        <boxGeometry />
                        <meshStandardMaterial color={"cyan"} />
                    </instancedMesh>
                </InstancedRigidBodies>
            </Physics>
        </>
    );
}
