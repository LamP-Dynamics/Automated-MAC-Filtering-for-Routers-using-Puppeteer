import puppeteer from "puppeteer";
import { Data, sendLog } from "./src/utils";
import * as admin from "./src"

(async () => {
  // Dummy datas
  const fetched:Data[] = []

  let trial = 0;
  while (trial >= 0) {
    const DIR605_URL = process.env.DIR605_URL
    const WR840N_URL = process.env.WR840N_URL
    const ADMIN_URL  = process.env.ADMIN_URL
    if ((DIR605_URL || WR840N_URL) && ADMIN_URL) {
      sendLog("Fetching data from API...")
      const today = new Date()
      await fetch(ADMIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bulan: today.getDate() > 20 ? today.getMonth() + 1 : today.getMonth(),
          tahun: today.getFullYear()
        })
      })
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch data from API')
        sendLog('Collected data from API')
        const data:Data[] = await res.json()
        data.forEach((item:Data) => {
          fetched.push(item)
        })
      })
      .catch(err => {
        sendLog(err)
        trial--
      })
      if (trial < 0) return sendLog('Exiting app...')

      sendLog("Opening browser...")
      const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })

      try {
        if (DIR605_URL) await admin.DIR605l(DIR605_URL, browser, fetched)
        if (WR840N_URL) await admin.WR840N(WR840N_URL, browser, fetched)
        sendLog("Exiting app...")
        trial--;
      }
      catch (err) {
        sendLog(err + `\nFailed. Retrying for ${trial} time...`)
        trial++
      }
      if (trial < 0) {
        return await browser.close()
      }
    }
    else sendLog('Env variables is not fully required. See our the documentation on github for more information.')
  }
})();