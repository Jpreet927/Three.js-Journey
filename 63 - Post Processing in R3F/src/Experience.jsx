import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
    Bloom,
    Noise,
    Glitch,
    ToneMapping,
    Vignette,
    EffectComposer,
    DepthOfField,
} from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction, GlitchMode } from "postprocessing";
import Drunk from "./Drunk";

export default function Experience() {
    return (
        <>
            <color args={["#ffffff"]} attach="background" />
            <EffectComposer multisampling={8}>
                {/* <Bloom mipmapBlur luminanceThreshold={1.1} /> */}
                <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
                {/* <Vignette
                    offset={0.3}
                    darkness={0.9}
                    blendFunction={BlendFunction.COLOR_BURN}
                /> */}
                {/* <Glitch
                    delay={[0.5, 1]}
                    duration={[0.1, 0.3]}
                    strength={[0.2, 0.4]}
                    mode={GlitchMode.CONSTANT_WILD}
                /> */}
                {/* <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} /> */}
                {/* <DepthOfField
                    focusDistance={0.025}
                    focalLength={0.025}
                    bokehScale={6}
                /> */}
                <Drunk frequency={10} amplitude={0.1} />
            </EffectComposer>

            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <mesh castShadow position-x={-2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh castShadow position-x={2} scale={1.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                {/* <meshStandardMaterial
                    color="white"
                    emissive="orange"
                    emissiveIntensity={1}
                    toneMapped={false}
                /> */}
            </mesh>

            <mesh
                receiveShadow
                position-y={-1}
                rotation-x={-Math.PI * 0.5}
                scale={10}
            >
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
        </>
    );
}
