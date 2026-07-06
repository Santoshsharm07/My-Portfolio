"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import type { Mesh } from "three";

function Knot() {
  const mesh = useRef<Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!mesh.current) return;
    // Ease rotation toward pointer for an "antigravity" follow.
    const tx = pointer.current.y * 0.4;
    const ty = pointer.current.x * 0.6;
    mesh.current.rotation.x += (tx - mesh.current.rotation.x) * 0.05;
    mesh.current.rotation.y += (ty - mesh.current.rotation.y) * 0.05;
    mesh.current.rotation.z += delta * 0.05;
    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <Icosahedron ref={mesh} args={[1.5, 6]}>
        <MeshDistortMaterial
          color="#c9a24b"
          emissive="#5b4be0"
          emissiveIntensity={0.12}
          roughness={0.15}
          metalness={0.9}
          distort={0.35}
          speed={1.6}
        />
      </Icosahedron>
    </Float>
  );
}

/**
 * WebGL hero. Lazy-mounted after first paint; falls back to a CSS gradient
 * orb when reduced-motion is requested or WebGL is unavailable.
 */
export function HeroScene() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = requestAnimationFrame(() => setMount(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mount) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="h-64 w-64 rounded-full bg-gradient-to-br from-accent-500/40 via-glow-500/20 to-transparent blur-3xl" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 5, 3]} intensity={2.2} />
          <pointLight position={[-5, -3, -2]} intensity={3} color="#5b4be0" />
          <Knot />
        </Suspense>
      </Canvas>
    </div>
  );
}
