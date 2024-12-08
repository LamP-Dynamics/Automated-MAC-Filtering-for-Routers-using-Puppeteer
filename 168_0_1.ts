import puppeteer from "puppeteer";
import { ADMIN_PASS, Data, PRIVILEGED, puppet, sendLog } from "./utils";

export const admin_168_0_1 = async () => {
	sendLog('Starting...');
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto('http://192.168.0.1');
	
	// Login to the router
	await puppet(page, async () => {
		const passwordInput = await page.$('#login_pass');
		if (passwordInput) {
			await passwordInput.type(ADMIN_PASS || '');
		} else {
			throw new Error('Password input field not found');
		}

		const loginButton = await page.$('#Login');
		if (loginButton) {
			await loginButton.click();
		} else {
			throw new Error('Login button not found');
		}
	}, 'Logging in...');
	
	// Get into admin menu
	await puppet(page, async () => {
		const advancedButton = await page.$('input[name="exit"]');
		if (advancedButton) {
			await advancedButton.click();
		} else {
			throw new Error('Advanced button not found');
		}
	}, 'Getting into admin menu...');
	
	// Get into advanced menu
	await puppet(page, async () => {
		const advancedTopNav = await page.$('#Advanced_topnav');
		if (advancedTopNav) {
			await advancedTopNav.click();
		} else {
			throw new Error('Advanced menu not found');
		}
	}, 'Getting into advanced menu...');
	
	// Get into MAC Filtering menu
	await puppet(page, async () => {
		const advancedSubNav = await page.$('#Advanced_subnav');
		if (advancedSubNav) {
			const thirdListItem = await advancedSubNav.$('li:nth-child(3) a');
			if (thirdListItem) {
				await thirdListItem.click();
			} else {
				throw new Error('Third list item not found');
			}
		} else {
			throw new Error('Advanced subnav not found');
		}
	}, 'Getting into MAC Filtering menu...');
	
	// Manipulating MAC filtering list
	await puppet(page, async () => {
		const listed: Data[] = []
		const table = await page.$('.formlisting');
		if (table) {
			const rows = await table.$$('tr');
			for (let index = 0; index < rows.length; index++) {
				if (index > 0) {
					const data = {
						mac: '',
						name: ''
					}
					const row = rows[index];
					const cells = await row.$$('td');
					const input_mac = await cells[1].$(`input[name="mac_addr_${index-1}"]`);
					const input_name = await cells[4].$(`input[name="mac_hostname_${index-1}"]`);

					if (input_mac) {
						const value = await input_mac.evaluate((el: HTMLInputElement) => el.value);
						data.mac = value;
					}
					if (input_name) {
						const value = await input_name.evaluate((el: HTMLInputElement) => el.value);
						data.name = value;
					}

					if (data.mac && data.name) {
						if (!PRIVILEGED.includes(data.mac)) {
							console.log(`${data.mac} of ${data.name}`);
							listed.push(data);
						}
						else {
							console.log(`${data.mac} of ${data.name} is privileged`);
						}
					}
					else {
						console.log('Empty Data on row', index);
					}
				}
			}
		} else {
			throw new Error('Table with class formlisting not found');
		}
	}, 'Updating MAC filtering list...');
	
	// Take a screenshot of the page
	await page.screenshot({ path: './dev/screenshot.png' });
	await browser.close();
}