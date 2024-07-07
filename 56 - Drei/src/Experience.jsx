import {
    OrbitControls,
    TransformControls,
    PivotControls,
    Html,
    Text,
    Float,
    MeshReflectorMaterial,
} from "@react-three/drei";
import { useRef } from "react";

export default function Experience() {
    const cube = useRef();
    const sphere = useRef();

    return (
        <>
            <OrbitControls makeDefault />
            <directionalLight position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <PivotControls
                anchor={[0, 0, 0]}
                depthTest={false}
                lineWidth={3}
                scale={100}
                fixed={true}
            >
                <mesh position-x={-2} ref={sphere}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                    <Html
                        wrapperClass="label"
                        position={[1, 1, 0]}
                        center
                        distanceFactor={6}
                        occlude={[sphere, cube]}
                    >
                        Test
                    </Html>
                </mesh>
            </PivotControls>

            <mesh position-x={2} scale={1.5} ref={cube}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>
            <TransformControls object={cube} mode="translate" />

            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                {/* <meshStandardMaterial color="greenyellow" /> */}
                <MeshReflectorMaterial
                    resolution={512}
                    blur={[1000, 1000]}
                    mixBlur={1}
                    mirror={0.25}
                    color="greenyellow"
                />
            </mesh>
            <Float floatIntensity={3} speed={5}>
                <Text
                    font="./bangers-v20-latin-regular.woff"
                    fontSize={1}
                    color={"salmon"}
                    position-y={2}
                    maxWidth={2}
                    textAlign="center"
                >
                    AAHHHH HHHHH
                    <meshNormalMaterial />
                </Text>
            </Float>
        </>
    );
}
