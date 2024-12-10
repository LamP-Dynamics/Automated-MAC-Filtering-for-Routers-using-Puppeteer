import { Browser, ElementHandle } from "puppeteer";
import { ADMIN_PASS, click, Data, PRIVILEGED, puppet, sendLog } from "../utils";

const added: Data[] = []
const deleted: Data[] = []

export const WR840N = async (ip:string, browser: Browser, fetched: Data[]): Promise<void> => {
	sendLog('Starting...');
	const page = await browser.newPage();
	await page.goto(ip);
	
	// Login to the router
	await puppet(page, async () => {
		const passwordInput = await page.$('#pcPassword');
		if (passwordInput) await passwordInput.type(ADMIN_PASS || '');
		else throw new Error('Password input field not found');

		await click(page, '#loginBtn');
	}, 'Logging in...', '#pcPassword');
	
	// Go to wireless page
	await puppet(page, async () => {
		const outerFrame = await page.waitForFrame(async frame => {
			return frame.name() === 'bottomLeftFrame'
		});
		if (!outerFrame) throw new Error('Failed to locate the outer frame');
		else {
			await click(outerFrame, '#menu_wl');
			await click(outerFrame, '#menu_wlacl');
		}

		const listed: Data[] = []
		const mainFrame = await page.waitForFrame(async frame => {
			return frame.name() === 'mainFrame'
		});
		if (!mainFrame) throw new Error('Failed to locate the main frame');

		// Wait for the table to be loaded in the main frame
		await mainFrame.waitForSelector('#macTbl');
		const table = await mainFrame.$('#macTbl');
		if (!table) throw new Error('Failed to locate the MAC filtering list');
		
		const rows = await table.$$('tr');
		for (let index = 0; index < rows.length; index++) {
			if (index > 3) {
				const row = rows[index];
				const cells = await row.$$('td');
				const user_mac = await cells[1].evaluate(el => el.textContent?.trim() || '');
				const user_name = await cells[4].evaluate(el => el.textContent?.trim() || '');
				const user_enabled = await cells[2].evaluate(el => el.textContent?.trim() || '');
				
				if (user_mac && user_name && user_enabled) {
					if (!PRIVILEGED.includes(user_mac.toLowerCase())) {
						console.log(`${user_mac} of ${user_name}`);
						listed.push({
							mac: user_mac,
							name: user_name,
							enabled: user_enabled === 'Enabled',
							index,
						});
					}
					else {
						console.log(`${user_name} of ${user_name} is privileged`);
					}
				}
			}
		}
		
		const toAdd: Data[] = fetched.map(data => listed.find(l => l.mac.toLowerCase() === data.mac.toLowerCase()) ? null : data).filter((d): d is Data => d !== null);
		const toDel: Data[] = listed.filter(data => !fetched.find(f => f.mac.toLowerCase() === data.mac.toLowerCase()) && data.enabled);
		
		console.log("Adding: " + (toAdd.length-4) + "...");
		const navBtn = (size:string,info:string) => {return `input.button.${size}.T.T_${info}`}
		await (async () => {
			for (const user of toAdd) {
				if (!PRIVILEGED.includes(user.mac.toLowerCase()))  {
					await mainFrame.waitForSelector(navBtn('XL','addnew'));
					await click(mainFrame, navBtn('XL','addnew'))
		
					await mainFrame.waitForSelector("#MAC");
					const input_mac = await mainFrame.$(`#MAC`);
					const input_name = await mainFrame.$(`#desc`);
					
					if (input_mac && input_name) {
						try {
							await input_mac.type(user.mac);
							await input_name.type(user.name);
						} catch (err) {
							console.error(`Error typing for user ${user.name}:`, err);
						}
						added.push(user);
						await click(mainFrame, navBtn('L',"save"));
					}
				}
			}
		})()

		console.log("Deleting: " + toDel.length + "...");
		await (async () => {
			await mainFrame.waitForSelector(navBtn('XL','delsel'));

			const table = await mainFrame.$('#macTbl');
			if (!table) throw new Error('Failed to locate the MAC filtering list');
			const rows = await table.$$('tr');

			for (const user of toDel) {
				if (user.index) {
					const row = rows[user.index];
					const cells = await row.$$('td');
					await cells[0].click()
				}
			}

			await click(mainFrame, navBtn('XL','delsel'));
		})()

		const updated = added.length + deleted.length
		if (updated) {
			console.log("Saving: " + updated + " changes...");
			click(page, '#SaveSettings');
		}
	}, 'Updating MAC filtering list...');
	
	// await page.close();
}