import { useState, useCallback, useRef } from 'react';
import type { Founder } from '../types/founder.types';
import type { InteractionState } from '../types/galaxy.types';

export const useGalaxyInteraction = () => {
  const [interactionState, setInteractionState] = useState<InteractionState>({
    isHovering: false,
    hoveredPlanetId: null,
    selectedPlanetId: null,
    mousePosition: { x: 0, y: 0 }
  });

  const lastHoverTime = useRef<number>(0);

  const handlePlanetHover = useCallback((founder: Founder | null) => {
    const now = Date.now();

    // Debounce hover events
    if (now - lastHoverTime.current < 50) return;
    lastHoverTime.current = now;

    setInteractionState(prev => ({
      ...prev,
      isHovering: founder !== null,
      hoveredPlanetId: founder?.id || null
    }));
  }, []);

  const handlePlanetClick = useCallback((founder: Founder) => {
    setInteractionState(prev => ({
      ...prev,
      selectedPlanetId: founder.id
    }));
  }, []);

  const handleModalClose = useCallback(() => {
    setInteractionState(prev => ({
      ...prev,
      selectedPlanetId: null
    }));
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    setInteractionState(prev => ({
      ...prev,
      mousePosition: { x, y }
    }));
  }, []);

  const getSelectedFounder = useCallback((founders: Founder[]): Founder | null => {
    if (!interactionState.selectedPlanetId) return null;
    return founders.find(f => f.id === interactionState.selectedPlanetId) || null;
  }, [interactionState.selectedPlanetId]);

  const getHoveredFounder = useCallback((founders: Founder[]): Founder | null => {
    if (!interactionState.hoveredPlanetId) return null;
    return founders.find(f => f.id === interactionState.hoveredPlanetId) || null;
  }, [interactionState.hoveredPlanetId]);

  return {
    interactionState,
    handlePlanetHover,
    handlePlanetClick,
    handleModalClose,
    handleMouseMove,
    getSelectedFounder,
    getHoveredFounder
  };
};