import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import "./animationPage.scss";
import Logo from "../../components/Logo/Logo";
import useTranslate from "../../hooks/useTranslate";

function Stars(props) {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.5 })
  );
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#fff"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function Overlay() {
  const { t } = useTranslate();
  return (
    <div className="overlay">
      <div className="content">
        <Logo size="lg" />
      </div>
      <span className="made-by">{t("made_by")}</span>
    </div>
  );
}

const AnimationPage = () => {
  return (
    <div className="animation-page">
      <Canvas className="canvas" camera={{ position: [0, 0, 1] }}>
        <Stars />
      </Canvas>
      <Overlay />
    </div>
  );
};

export default AnimationPage;
