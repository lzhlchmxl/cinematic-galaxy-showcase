import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface PostProcessingProps {
  enableBloom?: boolean;
  enableVignette?: boolean;
  bloomIntensity?: number;
  bloomThreshold?: number;
}

export const PostProcessing: React.FC<PostProcessingProps> = ({
  enableBloom = true,
  enableVignette = true,
  bloomIntensity = 0.3,
  bloomThreshold = 0.9
}) => {
  return (
    <EffectComposer>
      {/* Subtle bloom for planetary glow */}
      {enableBloom && (
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={0.9}
          mipmapBlur={true}
          blendFunction={BlendFunction.ADD}
        />
      )}

      {/* Depth of field removed for stability */}

      {/* Subtle vignette for cinematic framing */}
      {enableVignette && (
        <Vignette
          offset={0.3}
          darkness={0.5}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
    </EffectComposer>
  );
};