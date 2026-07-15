"use client";

/**
 * AvatarHero.tsx
 * Self-contained premium 3D AI Engineer bust.
 * Fully procedural (no external network files, GLTFs, or remote textures).
 * Instant, robust rendering with high-fidelity materials, smooth geometries, and responsive scaling.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const T = {
  accent:    "#CDF25A", // accent-500
  accentDim: "#8FE01F", // glow-500
  base850:   "#0F0F0F",
  base800:   "#141414",
  base700:   "#1F1F1F",
} as const;

/* ══════════════════════════════════════════════════════════════════
   PARTICLE FIELD
══════════════════════════════════════════════════════════════════ */
function Particles() {
  const COUNT = 120;
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const c0  = new THREE.Color(T.accent);
    const c1  = new THREE.Color(T.accentDim);
    const c2  = new THREE.Color("#ffffff");

    for (let i = 0; i < COUNT; i++) {
      const r     = 1.7 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7 - 0.2;
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.6;
      const pick     = Math.random();
      const c        = pick < 0.6 ? c0 : pick < 0.85 ? c1 : c2;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color",    new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.02;
    ref.current.rotation.x = Math.sin(t * 0.03) * 0.02;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HALO DISC
══════════════════════════════════════════════════════════════════ */
function BackHalo({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (reduced || !ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 + Math.sin(clock.getElapsedTime() * 0.8) * 0.02;
  });

  return (
    <mesh ref={ref} position={[0, 0.35, -1.0]}>
      <circleGeometry args={[2.0, 64]} />
      <meshBasicMaterial
        color={T.accent}
        transparent
        opacity={0.1}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════════════
   GEOMETRIC AVATAR PARTS
══════════════════════════════════════════════════════════════════ */

// Smooth styled swept hair
function Hair({ materials }: { materials: Record<string, THREE.Material> }) {
  return (
    <group>
      {/* Front wave sweep (Main volume) */}
      <mesh position={[0.0, 0.88, 0.25]} rotation={[0.2, 0.08, -0.1]} material={materials.hair}>
        <sphereGeometry args={[0.48, 32, 32]} />
      </mesh>
      {/* Wave curl top */}
      <mesh position={[0.08, 1.02, 0.05]} rotation={[0.3, 0.3, -0.2]} material={materials.hair}>
        <sphereGeometry args={[0.44, 32, 32]} />
      </mesh>
      {/* Side left sweep */}
      <mesh position={[-0.42, 0.65, 0.12]} rotation={[0.1, -0.2, 0.15]} material={materials.hair}>
        <sphereGeometry args={[0.34, 32, 32]} />
      </mesh>
      {/* Side right sweep */}
      <mesh position={[0.42, 0.65, 0.12]} rotation={[0.1, 0.2, -0.15]} material={materials.hair}>
        <sphereGeometry args={[0.34, 32, 32]} />
      </mesh>
      {/* Back hair volume */}
      <mesh position={[0.0, 0.58, -0.42]} rotation={[-0.1, 0, 0]} material={materials.hair}>
        <sphereGeometry args={[0.52, 32, 32]} />
      </mesh>
    </group>
  );
}

// Low-poly glasses frame with translucent glowing lenses
function Glasses({ materials }: { materials: Record<string, THREE.Material> }) {
  return (
    <group position={[0, 0.14, 0.58]} rotation={[0.02, 0, 0]}>
      {/* Left Frame */}
      <mesh position={[-0.3, 0, 0.05]} material={materials.glassesFrame}>
        <torusGeometry args={[0.2, 0.018, 16, 48]} />
      </mesh>
      {/* Left Lens */}
      <mesh position={[-0.3, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]} material={materials.lens}>
        <cylinderGeometry args={[0.19, 0.19, 0.01, 32]} />
      </mesh>

      {/* Right Frame */}
      <mesh position={[0.3, 0, 0.05]} material={materials.glassesFrame}>
        <torusGeometry args={[0.2, 0.018, 16, 48]} />
      </mesh>
      {/* Right Lens */}
      <mesh position={[0.3, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]} material={materials.lens}>
        <cylinderGeometry args={[0.19, 0.19, 0.01, 32]} />
      </mesh>

      {/* Bridge */}
      <mesh position={[0, 0.04, 0.05]} material={materials.glassesFrame}>
        <boxGeometry args={[0.16, 0.02, 0.02]} />
      </mesh>

      {/* Left Temple */}
      <mesh position={[-0.49, 0.02, -0.3]} rotation={[0.06, -0.1, 0]} material={materials.glassesFrame}>
        <boxGeometry args={[0.018, 0.018, 0.68]} />
      </mesh>

      {/* Right Temple */}
      <mesh position={[0.49, 0.02, -0.3]} rotation={[0.06, 0.1, 0]} material={materials.glassesFrame}>
        <boxGeometry args={[0.018, 0.018, 0.68]} />
      </mesh>
    </group>
  );
}

// Beard wrapping the jawline and chin
function Beard({ materials }: { materials: Record<string, THREE.Material> }) {
  return (
    <group>
      {/* Chin beard */}
      <mesh position={[0, -0.48, 0.38]} rotation={[0.15, 0, 0]} material={materials.beard}>
        <sphereGeometry args={[0.38, 32, 32]} />
      </mesh>
      {/* Left jaw beard */}
      <mesh position={[-0.35, -0.36, 0.2]} rotation={[0.1, -0.2, 0.15]} material={materials.beard}>
        <sphereGeometry args={[0.32, 32, 32]} />
      </mesh>
      {/* Right jaw beard */}
      <mesh position={[0.35, -0.36, 0.2]} rotation={[0.1, 0.2, -0.15]} material={materials.beard}>
        <sphereGeometry args={[0.32, 32, 32]} />
      </mesh>
      {/* Mustache */}
      <mesh position={[0, -0.18, 0.61]} rotation={[0.05, 0, 0]} material={materials.beard}>
        <boxGeometry args={[0.42, 0.08, 0.1]} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════
   AVATAR BUST COMPONENT
══════════════════════════════════════════════════════════════════ */
function AvatarBust({ reduced, responsiveScale, responsiveY }: { reduced: boolean; responsiveScale: number; responsiveY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const eye1Ref  = useRef<THREE.Mesh>(null);
  const eye2Ref  = useRef<THREE.Mesh>(null);
  const sweepRef = useRef<THREE.PointLight>(null);

  const blink = useRef({
    timer: 0, next: 2.5 + Math.random() * 3.5,
    active: false, progress: 0,
  });

  useFrame(({ clock }, delta) => {
    if (reduced) return;
    const t = clock.getElapsedTime();
    const b = blink.current;

    /* idle movement & slow rotation */
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.18;
      groupRef.current.rotation.x = Math.sin(t * 0.22) * 0.025;
      groupRef.current.position.y = responsiveY + Math.sin(t * 0.45) * 0.04;
    }

    /* light sweep orbit */
    if (sweepRef.current) {
      sweepRef.current.position.x = Math.sin(t * 0.32) * 3.6;
      sweepRef.current.position.z = Math.cos(t * 0.32) * 3.6;
      sweepRef.current.position.y = Math.sin(t * 0.14) * 1.6 + 0.4;
      sweepRef.current.intensity  = 4.5 + Math.sin(t * 0.6) * 1.5;
    }

    /* eye blinking */
    b.timer += delta;
    if (!b.active && b.timer >= b.next) {
      b.active = true; b.progress = 0;
      b.timer = 0; b.next = 2.5 + Math.random() * 4.5;
    }
    if (b.active) {
      b.progress += delta * 12;
      const phase = b.progress < 0.5 ? 1 - b.progress * 2 : (b.progress - 0.5) * 2;
      const glow = THREE.MathUtils.clamp(phase, 0, 1);
      for (const r of [eye1Ref, eye2Ref]) {
        if (!r.current) continue;
        const m = r.current.material as THREE.MeshStandardMaterial;
        m.emissiveIntensity = 0.3 + glow * 3.5;
        m.opacity           = 0.25 + glow * 0.75;
      }
      if (b.progress >= 1) b.active = false;
    }
  });

  /* Premium High-Fidelity Materials */
  const materials = useMemo(() => {
    // Matte, high-end skin finish
    const skin = new THREE.MeshStandardMaterial({
      color: new THREE.Color(T.base800),
      roughness: 0.45,
      metalness: 0.35,
      emissive: new THREE.Color(T.accent),
      emissiveIntensity: 0.03,
    });
    // Sleek glossy hair material
    const hair = new THREE.MeshStandardMaterial({
      color: new THREE.Color(T.base850),
      roughness: 0.25,
      metalness: 0.8,
      emissive: new THREE.Color(T.accentDim),
      emissiveIntensity: 0.015,
    });
    // Dark matte beard
    const beard = new THREE.MeshStandardMaterial({
      color: new THREE.Color(T.base850),
      roughness: 0.65,
      metalness: 0.4,
    });
    // Reflective metallic chrome glasses frame
    const glassesFrame = new THREE.MeshStandardMaterial({
      color: new THREE.Color(T.accent),
      emissive: new THREE.Color(T.accent),
      emissiveIntensity: 0.6,
      roughness: 0.08,
      metalness: 0.95,
    });
    // Translucent premium glass lens
    const lens = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffffff"),
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.25,
    });
    // Glowing eye core
    const eye = new THREE.MeshStandardMaterial({
      color: new THREE.Color(T.accent),
      emissive: new THREE.Color(T.accent),
      emissiveIntensity: 3.5,
      transparent: true,
      opacity: 1.0,
    });
    return { skin, hair, beard, glassesFrame, lens, eye };
  }, []);

  return (
    <group ref={groupRef} scale={responsiveScale} position={[0, responsiveY, 0]}>

      {/* HEAD BASE */}
      <group position={[0, 0.18, 0]}>
        {/* Face */}
        <mesh material={materials.skin}>
          <sphereGeometry args={[0.54, 32, 32]} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.02, 0.55]} rotation={[0.08, 0, 0]} material={materials.skin}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.56, 0.05, -0.08]} rotation={[0, 0.15, -0.15]} material={materials.skin}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>
        <mesh position={[0.56, 0.05, -0.08]} rotation={[0, -0.15, 0.15]} material={materials.skin}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>

        {/* Eyes (glow spheres) */}
        <mesh ref={eye1Ref} material={materials.eye} position={[-0.17, 0.14, 0.44]}>
          <sphereGeometry args={[0.04, 16, 16]} />
        </mesh>
        <pointLight position={[-0.17, 0.14, 0.44]} color={T.accent} intensity={1.5} distance={1.0} />

        <mesh ref={eye2Ref} material={materials.eye} position={[0.17, 0.14, 0.44]}>
          <sphereGeometry args={[0.04, 16, 16]} />
        </mesh>
        <pointLight position={[0.17, 0.14, 0.44]} color={T.accent} intensity={1.5} distance={1.0} />

        {/* Styled Hair */}
        <Hair materials={materials} />

        {/* Beard system */}
        <Beard materials={materials} />

        {/* Glasses */}
        <Glasses materials={materials} />
      </group>

      {/* NECK */}
      <mesh material={materials.skin} position={[0, -0.52, -0.05]}>
        <cylinderGeometry args={[0.18, 0.22, 0.45, 32]} />
      </mesh>

      {/* SHOULDERS */}
      <mesh material={materials.skin} position={[0, -0.95, -0.05]}>
        <cylinderGeometry args={[0.9, 1.05, 0.5, 32]} />
      </mesh>

      {/* RIM LIGHTS */}
      <pointLight position={[-2.8, 0.8,  0.2]} color={T.accent}    intensity={5.0} distance={7} />
      <pointLight position={[ 2.8, 0.8,  0.2]} color={T.accentDim} intensity={4.0} distance={7} />
      <pointLight position={[  0,  3.0, -1.8]} color={T.accent}    intensity={3.0} distance={7} />
      <pointLight position={[  0, -0.5, -3.2]} color={T.accent}    intensity={1.8} distance={7} />

      {/* SURFACE LIGHT SWEEP */}
      <pointLight ref={sweepRef} position={[3, 1, 3]} color={T.accent} intensity={5} distance={9} />

    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SCENE WRAPPER
══════════════════════════════════════════════════════════════════ */
function Scene({ reduced, width }: { reduced: boolean; width: number }) {
  // Compute responsive scale & Y offset based on window/canvas width
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  // Compact size layout
  const scale = isMobile ? 0.52 : isTablet ? 0.78 : 0.95;
  const yOffset = isMobile ? -0.85 : isTablet ? -0.45 : -0.32;

  return (
    <>
      <ambientLight intensity={0.06} />
      <BackHalo reduced={reduced} />
      <AvatarBust reduced={reduced} responsiveScale={scale} responsiveY={yOffset} />
      {!reduced && <Particles />}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN EXPORT (Responsive Canvas & CSS Fallback)
══════════════════════════════════════════════════════════════════ */
export function AvatarHero() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [width, setWidth]     = useState(1024);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    setWidth(window.innerWidth);

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const id = requestAnimationFrame(() => setMounted(true));
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const wrap = "pointer-events-none absolute inset-0 z-0 w-full h-full";

  if (!mounted || reduced) {
    return (
      <div aria-hidden className={wrap}>
        <div className="flex h-full items-center justify-center">
          <div
            style={{ opacity: reduced ? 0.5 : 1 }}
            className="h-[380px] w-[380px] rounded-full
              bg-[radial-gradient(circle,rgba(205,242,90,0.18)_0%,rgba(205,242,90,0.04)_55%,transparent_80%)]
              blur-3xl"
          />
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden className={wrap}>
      <Canvas
        camera={{ position: [0, 0.1, 4.0], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene reduced={reduced} width={width} />
        </Suspense>
      </Canvas>
    </div>
  );
}
