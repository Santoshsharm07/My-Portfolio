"use client";

import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Stylized boy avatar (Mixamo-compatible rig) + Ready Player Me
// motion-capture clips that bind to it by bone name.
useGLTF.preload("/models/boy-avatar.glb");
useGLTF.preload("/models/M_Walk_001.glb");
useGLTF.preload("/models/M_Wave_001.glb");
useGLTF.preload("/models/M_Dance_001.glb");
useGLTF.preload("/models/M_Dance_002.glb");
useGLTF.preload("/models/M_Jump_001.glb");

const SPECIAL_EVERY_MS = 5000; // walk this long between special moves
const WALK_SPEED = 1.15; // slightly brisk, energetic pace
const SPECIALS = ["Wave", "Dance", "Jump", "Dance2"] as const;

export function CyberHumanoid() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/boy-avatar.glb");
  const walkGlb = useGLTF("/models/M_Walk_001.glb");
  const waveGlb = useGLTF("/models/M_Wave_001.glb");
  const danceGlb = useGLTF("/models/M_Dance_001.glb");
  const dance2Glb = useGLTF("/models/M_Dance_002.glb");
  const jumpGlb = useGLTF("/models/M_Jump_001.glb");

  const animations = useMemo(() => {
    // Keep only rotation tracks: position tracks carry mocap root motion in
    // the source rig's units, which walks the character out of frame.
    const inPlace = (clip: THREE.AnimationClip, name: string) => {
      const c = clip.clone();
      c.tracks = c.tracks.filter((t) => t.name.endsWith(".quaternion"));
      c.name = name;
      return c;
    };
    return [
      inPlace(walkGlb.animations[0], "Walking"),
      inPlace(waveGlb.animations[0], "Wave"),
      inPlace(danceGlb.animations[0], "Dance"),
      inPlace(dance2Glb.animations[0], "Dance2"),
      inPlace(jumpGlb.animations[0], "Jump"),
    ];
  }, [walkGlb, waveGlb, danceGlb, dance2Glb, jumpGlb]);

  const { actions, mixer } = useAnimations(animations, groupRef);

  // Normalize: scale to ~2.2 units tall, feet at y = -1.1
  const { modelScale, offsetY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const s = 2.2 / size.y;
    return { modelScale: s, offsetY: -1.1 - box.min.y * s };
  }, [scene]);

  // walk <-> special-move state machine (refs: no re-renders on transitions)
  const busyRef = useRef(false); // a special move is playing
  const specialIdx = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playSpecial = useCallback(
    (name: (typeof SPECIALS)[number]) => {
      const walk = actions["Walking"];
      const special = actions[name];
      if (!walk || !special || busyRef.current) return;
      busyRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      walk.fadeOut(0.4);
      special.reset().fadeIn(0.4).play();
    },
    [actions],
  );

  useEffect(() => {
    const walk = actions["Walking"];
    if (!walk) return;
    for (const name of SPECIALS) {
      const a = actions[name];
      if (a) {
        a.setLoop(THREE.LoopOnce, 1);
        a.clampWhenFinished = true;
      }
    }

    const scheduleNext = () => {
      timerRef.current = setTimeout(() => {
        playSpecial(SPECIALS[specialIdx.current++ % SPECIALS.length]);
      }, SPECIAL_EVERY_MS);
    };

    const onFinished = (e: { action: THREE.AnimationAction }) => {
      const clipName = e.action.getClip().name;
      if (!(SPECIALS as readonly string[]).includes(clipName)) return;
      e.action.fadeOut(0.4);
      walk.reset().fadeIn(0.4).play();
      busyRef.current = false;
      scheduleNext();
    };

    mixer.addEventListener("finished", onFinished);

    // Greet the visitor first, then settle into the walk cycle.
    busyRef.current = false; // may be stuck true from a StrictMode/HMR remount
    walk.setEffectiveTimeScale(WALK_SPEED);
    walk.play();
    playSpecial("Wave");

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      mixer.removeEventListener("finished", onFinished);
      mixer.stopAllAction();
      busyRef.current = false;
    };
  }, [actions, mixer, playSpecial]);

  // Click/tap the character -> perform the next special move
  const handleClick = useCallback(() => {
    playSpecial(SPECIALS[specialIdx.current++ % SPECIALS.length]);
  }, [playSpecial]);

  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        // skinned meshes can be culled mid-animation with a stale bind-pose bounds
        mesh.frustumCulled = false;
        // Restyle: black streetwear tee/pants instead of the stock white outfit
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
          const std = m as THREE.MeshStandardMaterial;
          if (std.name?.startsWith("avaturn_look")) {
            std.color.set("#17181d");
            std.roughness = 0.75;
          }
        }
      }
    });
  }, [scene]);

  const orbitLightRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Floating cyber particles around the character
  const particleData = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 2.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      speeds[i] = 0.2 + Math.random() * 0.5;
    }
    return { positions, speeds };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Patrol left-right while walking; hold center during special moves
      const patrolX = busyRef.current ? 0 : Math.sin(t * 0.5) * 0.7;
      groupRef.current.position.x +=
        (patrolX - groupRef.current.position.x) * 0.035;

      // Face slightly toward walk direction + toward the mouse
      const lean = busyRef.current ? 0 : Math.cos(t * 0.5) * 0.3;
      const targetY = state.pointer.x * 0.4 + lean;
      groupRef.current.rotation.y +=
        (targetY - groupRef.current.rotation.y) * 0.05;
    }

    // Orbiting neon rim light
    if (orbitLightRef.current) {
      const angle = t * 0.8;
      orbitLightRef.current.position.set(
        Math.cos(angle) * 3.0,
        Math.sin(t * 0.4) * 1.5,
        Math.sin(angle) * 3.0
      );
    }

    // Drift particles upward
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      const { speeds } = particleData;
      for (let i = 0; i < speeds.length; i++) {
        positions[i * 3 + 1] += speeds[i] * 0.005;
        positions[i * 3] += Math.sin(t * speeds[i] + i) * 0.002;
        if (positions[i * 3 + 1] > 2.5) positions[i * 3 + 1] = -2.5;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={modelScale}
        position={[0, offsetY, 0]}
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      />

      <pointLight
        ref={orbitLightRef}
        color="#00f6ff"
        intensity={6.0}
        distance={8}
        decay={2}
      />

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00f6ff"
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
