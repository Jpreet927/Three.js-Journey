import { useGLTF, Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

function BlockStart({ position = [0, 0, 0] }) {
    return (
        <group position={position}>
            <Float floatIntensity={0.25} rotationIntensity={0.25}>
                <Text
                    scale={0.5}
                    font="./bebas-neue-v9-latin-regular.woff"
                    maxWidth={0.25}
                    lineHeight={0.75}
                    textAlign="right"
                    position={[0.75, 0.65, 0]}
                    rotation-y={-0.25}
                >
                    Marble Race
                    <meshBasicMaterial toneMapped={false} />
                </Text>
            </Float>
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
        </group>
    );
}

function BlockEnd({ position = [0, 0, 0] }) {
    const hamburger = useGLTF("./hamburger.glb");

    hamburger.scene.children.forEach((child) => {
        child.castShadow = true;
    });

    return (
        <group position={position}>
            <Text
                scale={1}
                font="./bebas-neue-v9-latin-regular.woff"
                position={[0, 2.25, 2]}
            >
                Finish
                <meshBasicMaterial toneMapped={false} />
            </Text>
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                position={[0, 0, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />

            <RigidBody
                type="fixed"
                colliders="hull"
                position={[0, 0.25, 0]}
                restitution={0.2}
                friction={0}
            >
                <primitive object={hamburger.scene} scale={0.2} />
            </RigidBody>
        </group>
    );
}

function BlockSpinner({ position = [0, 0, 0] }) {
    const [speed] = useState(
        () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
    );
    const obstacle = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
        obstacle.current.setNextKinematicRotation(rotation);
    });

    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}

function BlockLimbo({ position = [0, 0, 0] }) {
    const [timeOffset] = useState(() => Math.random() * 2 * Math.PI);
    const obstacle = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const y = Math.sin(time + timeOffset) + 1.15;
        obstacle.current.setNextKinematicTranslation({
            x: position[0],
            y: position[1] + y,
            z: position[2],
        });
    });

    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}

function BlockAxe({ position = [0, 0, 0] }) {
    const [timeOffset] = useState(() => Math.random() * 2 * Math.PI);
    const obstacle = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const x = Math.sin(time + timeOffset) * 1.25;
        obstacle.current.setNextKinematicTranslation({
            x: position[0] + x,
            y: position[1] + 0.75,
            z: position[2],
        });
    });

    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[1.5, 1.5, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}

function Bounds({ length = 1 }) {
    return (
        <RigidBody type="fixed" restitution={0.2} friction={0}>
            <mesh
                position={[2.15, 0.75, -(length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                castShadow
            />
            <mesh
                position={[-2.15, 0.75, -(length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                receiveShadow
            />
            <mesh
                position={[0, 0.75, -(length * 4) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[4, 1.5, 0.3]}
                receiveShadow
            />
            <CuboidCollider
                args={[2, 0.1, 2 * length]}
                position={[0, -0.1, -(length * 2) + 2]}
                restitution={0.2}
                friction={1}
            />
        </RigidBody>
    );
}

function Level({
    count = 5,
    types = [BlockSpinner, BlockLimbo, BlockAxe],
    seed = 0,
}) {
    const blocks = useMemo(() => {
        const blocks = [];

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            blocks.push(type);
        }

        return blocks;
    }, [count, types, seed]);

    return (
        <>
            <BlockStart position={[0, 0, 0]} />
            {blocks.map((Block, idx) => (
                <Block key={"block_" + idx} position={[0, 0, -(idx + 1) * 4]} />
            ))}
            <BlockEnd position={[0, 0, -(count + 1) * 4]} />

            <Bounds length={count + 2} />
        </>
    );
}

export { Level, BlockSpinner, BlockLimbo, BlockAxe };
