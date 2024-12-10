import { ElementHandle, Frame, Page } from "puppeteer";
import dotenv from 'dotenv';
dotenv.config();

export const ADMIN_PASS = process.env.ADMIN_PASS || '';
export const PRIVILEGED = process.env.PRIVILEGED?.split('-') || '';
export const sendLog = (message:string | unknown) => {
  console.log('=========================')
  console.log(message)
}
export const puppet = async (page: Page, callback: () => Promise<void>, message:string, selector?:string):Promise<void> => {
  console.log(message)
  if (!selector) await page.waitForNavigation({ waitUntil: 'networkidle0' });
  else await page.$eval(selector, () => {console.log('Evaluated')});
  await callback();
}
export interface Data {
  mac: string;
  name: string;
  index?: number;
  enabled?: boolean;
}
export const click = async (page: Page | ElementHandle | Frame, selector: string):Promise<void> => {
  const element = await page.$(selector);
  if (element) {
    await element.click();
  } else {
    throw new Error(`${selector} not found`);
  }
}