import cron from "node-cron";

import { generateTodayEvents } from "../services/automation/scheduler.service";

export function startAutomationCron() {
  console.log("Automation Cron Started");

  cron.schedule("0 8 * * *", async () => {
    console.log("==========================");
    console.log("Automation Started");
    console.log(new Date());

    try {
      const count = await generateTodayEvents();

      console.log(`Automation Completed`);
      console.log(`${count} event(s) processed`);
    } catch (error) {
      console.error(error);
    }

    console.log("==========================");
  });
}
