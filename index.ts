import { admin_168_0_1 } from "./168_0_1";
import { sendLog } from "./utils";

(async () => {
  let trial = 0;
  while (trial >= 0) {
    try {
      await admin_168_0_1()
      trial = -1;
    }
    catch (err) {
      trial+=1
      sendLog(err + `\nFailed. Retrying for ${trial} time...`)
    }
  }
})();