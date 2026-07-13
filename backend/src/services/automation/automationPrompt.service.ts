import { buildFluxPrompt } from "../promptBuilder";

export function buildAutomationPrompt(event: any) {
  return buildFluxPrompt({
    occasion: event.occasion,

    theme: "Corporate",

    decorations: ["confetti", "balloons"],

    people: "colleagues",

    customMessage:
      event.customMessage || `Happy ${event.occasion} ${event.name}`,

    additionalInformation: `
            Employee Name : ${event.name}

            Department : ${event.department}
            `,
  });
}
