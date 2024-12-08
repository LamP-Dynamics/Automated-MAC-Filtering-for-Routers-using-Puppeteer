import puppeteer from "puppeteer";
import { sendLog } from "./src/utils";
import * as admin from "./src"

(async () => {
  // Dummy datas
  const fetched = [
    { mac: 'c8:5b:76:17:a3:5b', name: 'mac_5b' },
    { mac: '98:b0:8b:2a:4c:90', name: 'mac_90' },
    { mac: '10:63:c8:8c:fa:cd', name: 'mac_cd' },
    { mac: '04:f9:93:f2:46:5d', name: 'mac_5d' },
    { mac: 'c0:18:03:2b:42:30', name: 'mac_30' },
    { mac: 'b4:31:61:95:4f:cd', name: 'mac_cd' },
    { mac: '28:8c:ec:78:f0:a5', name: 'mac_a5' },
    { mac: '98:b0:8b:ff:7b:22', name: 'mac_22' },
    { mac: '10:e7:c6:db:25:d9', name: 'mac_d9' },
    { mac: 'd0:9c:7a:04:38:a4', name: 'mac_a4' },
    { mac: '14:13:33:8a:46:23', name: 'mac_23' },
    { mac: '8c:aa:ce:20:a3:b6', name: 'mac_b6' },
    { mac: '68:bf:c4:dc:62:f6', name: 'mac_f6' },
    { mac: '60:3e:5f:21:33:99', name: 'mac_99' },
  ]

  let trial = 0;
  while (trial >= 0) {
    try {
      const ADMIN_URL  = process.env.ADMIN_URL
      if (ADMIN_URL) {
        const browser = await puppeteer.launch({ 
          headless: false, 
          executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
        });
        await admin.DIR605l(ADMIN_URL, browser, fetched)
        await browser.close();
        trial--;
      }
      else throw new Error('ADMIN_URL not found in .env file')
    }
    catch (err) {
      sendLog(err + `\nFailed. Retrying for ${trial} time...`)
      trial++
    }
  }
})();