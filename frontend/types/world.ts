export interface WorldState {
  story: string;
  theme: string;
  mood: string;
  image_prompt: string;

  ui: {
    background: string;
    accent: string;
  };
}