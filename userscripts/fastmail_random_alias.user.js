// ==UserScript==
// @name         Fastmail Random Alias Generator
// @namespace    https://mustaphaelmalah.github.io
// @version      0.1
// @description  A browser script to create a random Fastmail alias and prompt to send an email via the created alias.
// @author       Mustapha Elmalah
// @match        https://www.fastmail.com/settings/*
// @include      https://www.fastmail.com/settings/*
// @grant        none
// @downloadURL  https://github.com/mustaphaelmalah/garage/blob/master/userscripts/fastmail_random_alias.user.js
// @updateURL    https://github.com/mustaphaelmalah/garage/blob/master/userscripts/fastmail_random_alias.user.js
// ==/UserScript==

const WAIT_TIME_MS = 400;
const PASSWORD = "wimdon-7zYtro-zopruc";

const DOMAINS = [
	'fastmail.com',
	'SEPARATOR', // place holder for separator in dropdown
	'fastmail.cn',
	'fastmail.co.uk',
	'fastmail.com.au',
	'fastmail.de',
	'fastmail.es',
	'fastmail.fm',
	'fastmail.fr',
	'fastmail.im',
	'fastmail.in',
	'fastmail.jp',
	'fastmail.mx',
	'fastmail.net',
	'fastmail.nl',
	'fastmail.org',
	'fastmail.se',
	'fastmail.to',
	'fastmail.tw',
	'fastmail.uk',
	'fastmail.us',
	'SEPARATOR', // place holder for separator in dropdown
	'123mail.org',
	'airpost.net',
	'eml.cc',
	'fmail.co.uk',
	'fmgirl.com',
	'fmguy.com',
	'mailbolt.com',
	'mailcan.com',
	'mailhaven.com',
	'mailmight.com',
	'ml1.net',
	'mm.st',
	'myfastmail.com',
	'proinbox.com',
	'promessage.com',
	'rushpost.com',
	'sent.as',
	'sent.at',
	'sent.com',
	'speedymail.org',
	'warpmail.net',
	'xsmail.com',
	'SEPARATOR', // place holder for separator in dropdown
	'150mail.com',
	'150ml.com',
	'16mail.com',
	'2-mail.com',
	'4email.net',
	'50mail.com',
	'allmail.net',
	'bestmail.us',
	'cluemail.com',
	'elitemail.org',
	'emailcorner.net',
	'emailengine.net',
	'emailengine.org',
	'emailgroups.net',
	'emailplus.org',
	'emailuser.net',
	'f-m.fm',
	'fast-email.com',
	'fast-mail.org',
	'fastem.com',
	'fastemail.us',
	'fastemailer.com',
	'fastest.cc',
	'fastimap.com',
	'fastmailbox.net',
	'fastmessaging.com',
	'fea.st',
	'fmailbox.com',
	'ftml.net',
	'h-mail.us',
	'hailmail.net',
	'imap-mail.com',
	'imap.cc',
	'imapmail.org',
	'inoutbox.com',
	'internet-e-mail.com',
	'internet-mail.org',
	'internetemails.net',
	'internetmailing.net',
	'jetemail.net',
	'justemail.net',
	'letterboxes.org',
	'mail-central.com',
	'mail-page.com',
	'mailandftp.com',
	'mailas.com',
	'mailc.net',
	'mailforce.net',
	'mailftp.com',
	'mailingaddress.org',
	'mailite.com',
	'mailnew.com',
	'mailsent.net',
	'mailservice.ms',
	'mailup.net',
	'mailworks.org',
	'mymacmail.com',
	'nospammail.net',
	'ownmail.net',
	'petml.com',
	'postinbox.com',
	'postpro.net',
	'realemail.net',
	'reallyfast.biz',
	'reallyfast.info',
	'speedpost.net',
	'ssl-mail.com',
	'swift-mail.com',
	'the-fastest.net',
	'the-quickest.com',
	'theinternetemail.com',
	'veryfast.biz',
	'veryspeedy.net',
	'yepmail.net',
	'your-mail.com'
];

const mismatch_error = () => {
	alert("Pelase navigate to settings and run the script again.");
};

const assert = (v, error_msg) => {
	if (!v) {
		throw new Error(error_msg || "assertion failed.");
	}
};

const find_by_text = (tag_name, text, exact) => {
	// Set exact by default
	exact = typeof exact === undefined ? true : exact;

	//return xpath_eval("//" + tag_name + "[text()='" + text + "']");
	const r = [...document.querySelectorAll(tag_name)]
		.filter(a => (exact && a.textContent.trim() === text) || (a.textContent.includes(text)));

	return r.length > 0 ? r[0] : null;
};

const wait = (time_ms) => {
	return new Promise(resolve => {
		const timeout_id = setTimeout(() => {
			clearTimeout(timeout_id);
			resolve();
		}, time_ms || WAIT_TIME_MS);
	});
};

//------------------------
// Actions
//------------------------
const nav_to_aliases = () => {
	const alias_opt_link = find_by_text("a", "Users & Aliases");
	assert(alias_opt_link, "Unable to locate aliases button in the sidebar.");
	alias_opt_link.click();
};

const unlock = () => {
	const pwd_input = document.querySelector('[type="password"]');

	assert(pwd_input, "Unable to locate the password input.");
	pwd_input.value = PASSWORD;

	const unlock_btn = find_by_text("button", "Unlock");
	assert(unlock_btn, "Located unlock button inner label but unable to locate the button itself.");
	unlock_btn.click();
};

const create_alias = async () => {
	const new_btn = find_by_text("button", "New Alias");
	assert(new_btn, "Located 'New Alias' button inner label but unable to locate the button itself.");
	new_btn.click();

	await wait();

	// Generate random alias
	const alias = Math.random().toString(36).substring(7);
	const alias_input = document.getElementById("s-aliases-newEmail-input");
	assert(alias_input, "Unable to locate the alias input.");
	alias_input.value = alias;

	const domain_input = document.getElementsByTagName("select")[0];
	assert(domain_input, "Unable to locate the domain dropdown.");

	// Pick a random domain from the domain list,
	// skipping the separators
	let domain = null;
	let domain_idx = -1;
	do {
		domain_idx = Math.floor(Math.random() * DOMAINS.length);
		domain = DOMAINS[domain_idx];
	} while (domain === "SEPARATOR");

	domain_input.selectedIndex = domain_idx;

	// Save
	const save_btn = document.getElementById("s-settings-save");
	assert(save_btn, "Unable to locate save button.");
	save_btn.click();

	return alias;
};

const compose_email = async (alias) => {
	const mail_btn = find_by_text("Back to Mail");
	assert(mail_btn, "Unable to locate the 'Mail' button.");
	mail_btn.click();

	await wait();

	const compose_btn = find_by_text("a", "Compose");
	assert(compose_btn, "Unable to locate the 'Compose' button.");
	compose_btn.click();

	await wait();

	// Get the option element from the 'From' dropdown for the alias
	const from_input = [...document.querySelectorAll(".v-Select-input")][0];
	assert(from_input, "Unable to locate 'From' dropdown.");
	for (let i = 0, opt_len = from_input.options.length; i < opt_len; i++) {
		if (from_input.options[i].text.includes(alias)) {
			from_input.selectedIndex = i;
			break;
		}
	}
};

// Initialize the action chain
const init = async () => {
	try {
		nav_to_aliases();
		await wait(1000);

		unlock();
		await wait(2000);

		const alias = await create_alias();
		await wait();

		// Navigatet back to mail and compose a new
		// email with the created alias
		compose_email(alias);
	} catch (error) {
		console.error(error);
		mismatch_error();
	}
};

// Add generate button
(() => {
	var btn = document.createElement("button");
	btn.style.position = "absolute";
	btn.style.right = "5px";
	btn.style.top = "5px";
	btn.style.color = "#000";
	btn.style.textAlign = "center";
	btn.style.zIndex = 500000000;
	btn.style.width = "120px";

	btn.appendChild(document.createTextNode("Generate Alias"));

	btn.onclick = init;

	document.body.appendChild(btn);
})();
