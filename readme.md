<div align="center">
  <h1>Automated MAC Filtering for Routers using NodeJS and Puppeteer based on Client Payment Status</h1>

<a href="https://www.typescriptlang.org/">
    <img alt="License" src="https://img.shields.io/badge/Typescript-3776AB?style=for-the-badge&logo=typescript&logoColor=white">
</a>
<a href="https://www.nodejs.org/">
    <img alt="License" src="https://img.shields.io/badge/NodeJS v22.12.0-417e38?style=for-the-badge&logo=nodejs&logoColor=white">
</a>
<a href="https://github.com/SalamPS/puppet-mac-filter/blob/main/LICENSE">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2cb150?style=for-the-badge&logo=opensourceinitiative&logoColor=white">
</a>
</div>

## What It Does

We made this automation system in the need of our responsibility as an Admin of our local network. We need to ensure that only client who already paid the internet bill that able to access the local network. The plan is by using Whitelist MAC Filtering.

We have plenty other things to do beside of this simply lovely stuff. Rather than doing all the filtering things manually everyday, we prefer to made this automation to let us chilling out without any need of care about the filtering anymore.

You also able to use the source code we provided. You can freely customize the code according to your router display page. It's a good choice for you to save a screenshot using puppeteer by doing `page.screenshot` at the end of every development trials to help you debugging the code or you can set the `headless` parameter to true to be able to see the live browser.

## How To Use

Since this project was made using TS, there are two runtimes (TS and JS). You can run any of them and running the Typescript runtime will require you to install `ts-node` to be able to run Typescript directly while you can just using the latest released version in the [release page](https://github.com/SalamPS/puppet-mac-filter/releases). Make sure to run `npm install` first before starting the runtime for the first time.

To run index.js

```
node index.js
```

To run index.ts

```
# Run this if you don't have ts-node installed yet
# npm install -g ts-node

ts-node index.ts
```

## Configuration

Create a `.env` file in the root directory of your project and add the following environment variables:

```
ADMIN_PASS=your_admin_password	                # Used for all routers
ADMIN_URL='https:/your.domain.com/path/to/api/  # API URL to fetch data
PRIVILEGED=mac1---mac2---mac3                   # For example -> 5c:bb:12:ae:24:22---5a:bc:13:aa:2c:2f
SPECIALIZE=fulan---faulan---fulanah             # Special names for special access on DIR605
DIR605_URL=http://192.168.0.1                   # Desired URL for DIR605L Router
WR840N_URL=http://192.168.3.1                   # Desired URL for WR840N Router
```

Replace `your_admin_password` with the actual admin password of your router and `mac1---mac2---mac3` with the MAC addresses that should be privileged. Update the URLs to match your router's IP addresses. Please note that currently in this release version the password of each router is equal.

`SPECIALIZE` is a premium-like feature. `SPECIALIZE` gives member to have more than one MAC address allowed on the whitelist. It was intended, as the DIR605 router only provide 24 mac addresses to be registered on whitelist. You can leave it blank if you want anyway.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
