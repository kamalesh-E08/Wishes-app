import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishState {
  uploadedImage: string | null;

  occasion: string;
  theme: string;

  people: string[];
  decorations: string[];

  customMessage: string;
  additionalInformation: string;

  animationEnabled: boolean;

  aiEngine: string;

  currentStep: number;

  generatedImage: string | null;

  setAdditionalInformation: (info: string) => void;

  setGeneratedImage: (url: string) => void;

  setImage: (img: string) => void;

  setOccasion: (occasion: string) => void;

  setTheme: (theme: string) => void;

  setPeople: (people: string[]) => void;

  setDecorations: (decorations: string[]) => void;

  setCustomMessage: (message: string) => void;

  setAnimation: (state: boolean) => void;

  setAIEngine: (engine: string) => void;

  setCurrentStep: (step: number) => void;

  resetWish: () => void;
}

export const useWishStore = create<WishState>()(
  persist(
    (set) => ({
      uploadedImage: null,

      occasion: "",

      theme: "",

      people: [],

      decorations: [],

      customMessage: "",

      additionalInformation: "",

      animationEnabled: false,

      aiEngine: "ChatGPT",

      currentStep: 1,

      generatedImage: null,

      setAdditionalInformation: (info) =>
        set({
          additionalInformation: info,
        }),

      setImage: (img) =>
        set({
          uploadedImage: img,
        }),

      setOccasion: (occasion) =>
        set({
          occasion,
        }),

      setTheme: (theme) =>
        set({
          theme,
        }),

      setPeople: (people) =>
        set({
          people,
        }),

      setDecorations: (decorations) =>
        set({
          decorations,
        }),

      setCustomMessage: (message) =>
        set({
          customMessage: message,
        }),

      setAnimation: (state) =>
        set({
          animationEnabled: state,
        }),

      setAIEngine: (engine) =>
        set({
          aiEngine: engine,
        }),

      setCurrentStep: (step) =>
        set({
          currentStep: step,
        }),

      setGeneratedImage: (url) =>
        set({
          generatedImage: url,
        }),

      resetWish: () =>
        set({
          uploadedImage: null,
          occasion: "",
          theme: "",
          people: [],
          decorations: [],
          customMessage: "",
          additionalInformation: "",
          animationEnabled: false,
          currentStep: 1,
          generatedImage: null,
        }),
    }),
    {
      name: "wish-storage",
    },
  ),
);
