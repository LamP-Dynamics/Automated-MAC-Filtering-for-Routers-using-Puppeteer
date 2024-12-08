import puppeteer from "puppeteer";
import { admin_168_0_1 } from "./168_0_1";
import { sendLog } from "./utils";

(async () => {
  let trial = 0;
  while (trial >= 0) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      await admin_168_0_1(browser)
      
      await browser.close();
      trial = -1;
    }
    catch (err) {
      trial+=1
      sendLog(err + `\nFailed. Retrying for ${trial} time...`)
    }
  }
})();