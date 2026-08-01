"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function PostProcessingEffects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
}
