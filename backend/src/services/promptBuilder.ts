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
  return `

The uploaded image contains the main person.

Your task is to create a completely new premium celebration poster using the uploaded person's identity as a reference.

IDENTITY PRESERVATION RULES

Preserve ONLY:

* facial identity
* face shape
* facial features
* skin tone
* hairstyle
* age appearance

Do NOT preserve:

* clothing
* outfit
* accessories
* background
* lighting
* pose
* camera angle
* composition
* environment

Treat the uploaded image as an identity reference only.

The generated image must look like the same person in a completely new scene.

OCCASION

${data.occasion}

ENVIRONMENT

${themeDescription}

PEOPLE PRESENT

${data.people.join(", ") || "None"}

DECORATIONS

${decorationDescriptions || "None"}

CUSTOM MESSAGE TO DISPLAY

${data.customMessage || "No custom message"}

ADDITIONAL INFORMATION

${data.additionalInformation || "No additional information provided"}

ANIMATION

${data.animationEnabled ? "Enabled" : "Disabled"}

SCENE REQUIREMENTS

* Create a completely new environment
* Person should be naturally integrated into the scene
* Generate a new outfit matching the occasion and environment
* Clothing must change according to the occasion and location
* Person should be the hero subject of the poster
* Use premium advertising photography composition
* Use realistic shadows and reflections
* Use cinematic lighting
* Use luxury lifestyle photography standards
* Use premium event design principles
* Ensure decorations are clearly visible
* Environment must strongly reflect the selected theme
* Celebration atmosphere should be obvious and visually appealing

OCCASION SPECIFIC RULES

Birthday:

* Premium birthday celebration setup
* Luxury birthday decorations
* Modern celebration outfit

Anniversary:

* Elegant romantic atmosphere
* Formal premium attire
* Sophisticated celebration styling

Work Achievement:

* Corporate success celebration
* Executive professional attire
* Achievement focused visual elements

Festival:

* Traditional festive environment
* Cultural decorations
* Traditional festive clothing

Graduation:

* Graduation ceremony atmosphere
* Academic attire
* Educational achievement styling

Baby Shower:

* Family celebration atmosphere
* Warm welcoming environment
* Baby themed decorations

TEXT RULES

* Do not display any age unless explicitly provided by the user
* Do not generate text such as "18th Birthday", "25th Birthday", or "50th Birthday" unless age is provided
* Do not generate text such as "1st Anniversary", "10th Anniversary", or "25th Anniversary" unless anniversary year is provided
* If no age is provided, use only:
  "Happy Birthday"
* If no anniversary year is provided, use only:
  "Happy Anniversary"
* Never invent ages
* Never invent anniversary years
* Never invent names
* Never invent dates
* Never invent relationships
* Use only information explicitly provided by the user

IMAGE QUALITY REQUIREMENTS

* Photorealistic
* Ultra detailed
* Premium advertisement quality
* Professional photography
* Cinematic composition
* Vibrant colors
* High contrast
* Natural skin rendering
* Realistic lighting
* Social media ready
* Luxury poster quality
* 4K visual appearance

IMPORTANT FINAL RULE

Keep ONLY the person's facial identity from the uploaded image.

Everything else must be newly generated and redesigned:

* outfit
* pose
* background
* environment
* composition
* decorations
* lighting
* styling

The final result should look like a professional premium celebration poster featuring the same person in a completely new environment.
`;
}
