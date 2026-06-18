import {themeMap} from "../constants/themeMap";
import {decorationMap} from "../constants/decorationsMap"

export interface WishPayload {
  uploadedImage: string;
  occasion: string;
  theme: string;
  people: string[];
  decorations: string[];
  customMessage: string;
  animationEnabled: boolean;
  additionalInformation: string;
}

export function buildPrompt(data: WishPayload) {
      const themeDescription = themeMap[data.theme] || data.theme;

      const decorationDescriptions = data.decorations
        .map((decoration) => decorationMap[decoration] || decoration)
        .join(", ");
        return `Create a poster for this uploaded person in following description
                OCCASION:${data.occasion}
                ENVIRONMENT:${themeDescription}
                PEOPLE PRESENT:${data.people.join(", ") || "None"}
                DECORATIONS:${decorationDescriptions || "None"}
                CUSTOM MESSAGE TO DISPLAY:${data.customMessage || "No custom message"}
                ADDITIONAL INFORMATION:${data.additionalInformation || "No additional information provided"}
                ANIMATION:${data.animationEnabled ? "Enabled" : "Disabled"}

                Keep the face and you can change the outfit if want and add the mentioned date or number buy the user you dont add it by yourself
              `;
}
