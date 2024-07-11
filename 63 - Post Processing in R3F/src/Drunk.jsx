import DrunkEffect from "./DrunkEffect";

export default function Drunk(props) {
    const effect = new DrunkEffect(props);

    return <primitive object={effect} />;
}
