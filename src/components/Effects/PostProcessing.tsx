import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface PostProcessingProps {
  enableBloom?: boolean;
  enableVignette?: boolean;
  enableChromaticAberration?: boolean;
  bloomIntensity?: number;
  bloomThreshold?: number;
  chromaticAberrationOffset?: [number, number];
}

export const PostProcessing: React.FC<PostProcessingProps> = ({
  enableBloom = true,
  enableVignette = true,
  enableChromaticAberration = true,
  bloomIntensity = 0.8,
  bloomThreshold = 0.35,
  chromaticAberrationOffset = [0.0007, 0.0005]
}) => {
  return (
    <EffectComposer>
      {enableBloom ? (
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={0.9}
          mipmapBlur={true}
          blendFunction={BlendFunction.ADD}
        />
      ) : <></>}

      {enableChromaticAberration ? (
        <ChromaticAberration
          offset={chromaticAberrationOffset}
          radialModulation={false}
          modulationOffset={0.0}
        />
      ) : <></>}

      {enableVignette ? (
        <Vignette
          offset={0.3}
          darkness={0.5}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      ) : <></>}
    </EffectComposer>
  );
};