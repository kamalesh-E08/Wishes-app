import { themeMap } from "../constants/themeMap";
import { decorationMap } from "../constants/decorationsMap";

export function buildFluxPrompt(data: any) {
  const themeDescription = themeMap[data.theme] || data.theme;

  const decorationDescriptions = data.decorations
    .map((d: string) => decorationMap[d] || d)
    .join(", ");

  return `
same person from reference image,
preserve identity,
preserve face and don't make them old aged face,
but you can change the dress that suit the occasion that provided,
${data.occasion},
${themeDescription},
${decorationDescriptions},
${data.people},
add this ${data.customMessage},
${data.additionalInformation},
greeting card,
photorealistic,
professional,
high detail,
cinematic lighting
`;
}
