"use client";

/**
 * AvatarHero.tsx
 * Premium 3D Canvas containing the interactive CyberHumanoid model
 * with post-processing bloom, environmental lighting, and responsive scaling.
 */

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Environment, Preload } from "@react-three/drei";
import { CyberHumanoid } from "./CyberHumanoid";
import { PostProcessingEffects } from "./PostProcessingEffects";

function Scene({ width }: { width: number }) {
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  // Responsive scaling and positioning
  const scale = isMobile ? 0.65 : isTablet ? 0.95 : 1.15;
  const positionY = isMobile ? -0.3 : isTablet ? -0.1 : 0.0;

  return (
    <>
      {/* Cinematic Environmental Lights */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[8, 5, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
      />

      {/* Cyberpunk Neon Rim Lights */}
      {/* Cyber blue rim from top left */}
      <pointLight
        position={[-6, 4, -4]}
        color="#00ffff"
        intensity={3.5}
        distance={15}
      />
      {/* Hot pink/violet fill from bottom right */}
      <pointLight
        position={[6, -4, 4]}
        color="#ff0077"
        intensity={2.5}
        distance={15}
      />
      {/* Backlighting to separate from background */}
      <pointLight
        position={[0, 5, -8]}
        color="#0055ff"
        intensity={2.0}
        distance={15}
      />

      {/* Environment preset for gorgeous chrome/metallic reflections */}
      <Environment preset="city" />

      {/* Cyber Humanoid Model Group with responsive scale/position */}
      <group scale={scale} position={[0, positionY, 0]}>
        <CyberHumanoid />
      </group>

      {/* Bloom post-processing */}
      <PostProcessingEffects />
    </>
  );
}

export function AvatarHero() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [width, setWidth] = useState(1024);

  useEffect(() => {
    // Check for user reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    setWidth(window.innerWidth);

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const id = requestAnimationFrame(() => setMounted(true));
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const wrapperClass = "absolute inset-0 z-0 w-full h-full";

  // Fallback if SSR, not mounted, or reduced motion is active
  if (!mounted || reducedMotion) {
    return (
      <div aria-hidden className={`${wrapperClass} pointer-events-none`}>
        <div className="flex h-full items-center justify-center">
          <div
            className="h-[450px] w-[450px] rounded-full
              bg-[radial-gradient(circle,rgba(0,246,255,0.15)_0%,rgba(255,0,119,0.05)_55%,transparent_80%)]
              blur-3xl"
          />
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden className={wrapperClass}>
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        dpr={[1, 1.5]} // Capped at 1.5 for performance
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <Scene width={width} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
