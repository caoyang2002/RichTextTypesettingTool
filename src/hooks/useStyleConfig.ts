import { useState, useCallback } from "react";
import { StyleConfig } from "@/types";
import { DEFAULT_STYLE_CONFIG } from "@/config/style.config";

export function useStyleConfig() {
  const [styleConfig, setStyleConfig] =
    useState<StyleConfig>(DEFAULT_STYLE_CONFIG);

  const updateStyleConfig = useCallback((updates: Partial<StyleConfig>) => {
    setStyleConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    styleConfig,
    updateStyleConfig,
    setStyleConfig,
  };
}
