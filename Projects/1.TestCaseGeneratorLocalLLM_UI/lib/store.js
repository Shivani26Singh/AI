import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDefaultSettings } from "@/lib/settings-validators";

export const useAppStore = create(
  persist(
    (set) => ({
      files: [],
      extractedTexts: [],
      isExtracting: false,
      extractionErrors: [],
      isGenerating: false,
      generationError: null,
      generatedMarkdown: "",
      activeTab: "preview",
      recentGenerations: [],

      settings: getDefaultSettings(),

      setFiles: (files) => set({ files }),
      addFiles: (newFiles) =>
        set((state) => ({
          files: [...state.files, ...newFiles],
        })),
      removeFile: (index) =>
        set((state) => ({
          files: state.files.filter((_, i) => i !== index),
          extractedTexts: state.extractedTexts.filter((_, i) => i !== index),
          extractionErrors: state.extractionErrors.filter((_, i) => i !== index),
        })),
      clearFiles: () =>
        set({
          files: [],
          extractedTexts: [],
          extractionErrors: [],
          generatedMarkdown: "",
          generationError: null,
          activeTab: "preview",
        }),

      setExtracting: (isExtracting) => set({ isExtracting }),
      addExtractedText: (result) =>
        set((state) => ({
          extractedTexts: [...state.extractedTexts, result],
        })),
      addExtractionError: (error) =>
        set((state) => ({
          extractionErrors: [...state.extractionErrors, error],
        })),
      clearExtractionResults: () =>
        set({ extractedTexts: [], extractionErrors: [] }),

      setIsGenerating: (isGenerating) =>
        set({ isGenerating, generationError: null }),
      setGenerationError: (generationError) =>
        set({ generationError, isGenerating: false }),
      setGeneratedMarkdown: (generatedMarkdown) =>
        set({ generatedMarkdown, isGenerating: false, generationError: null }),
      setActiveTab: (activeTab) => set({ activeTab }),

      addRecentGeneration: (entry) =>
        set((state) => ({
          recentGenerations: [entry, ...state.recentGenerations].slice(0, 20),
        })),

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),
      resetSettings: () =>
        set({ settings: getDefaultSettings() }),
    }),
    {
      name: "test-plan-generator-settings",
      partialize: (state) => ({
        settings: state.settings,
        recentGenerations: state.recentGenerations,
      }),
    }
  )
);
