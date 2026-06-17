export interface IWish {
  userId?: string;

  occasion: string;

  theme: string;

  uploadedImage: string;

  generatedImage: string;

  people: string[];

  decorations: string[];

  customMessage: string;

  animationEnabled: boolean;

  aiProvider: string;

  prompt: string;

  downloads: number;

  shares: number;

  createdAt?: Date;

  updatedAt?: Date;
}
