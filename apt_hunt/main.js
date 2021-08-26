import fetch from 'node-fetch';
import np from 'node-html-parser';
const { parse } = np;

import notifier from 'node-notifier';
import { setTimeout } from 'timers';

let _timeout_id = null;
let _last_ad_id = null;

const INTERVAL_MS = 60 * 1000;

const inspect_ads = async () => {
	// Clear active timeout
	if (_timeout_id) {
		clearTimeout(_timeout_id);
		_timeout_id = null;
	}

	// Fetch ads and parse
	console.log(new Date(), "Cycle started.", "Last ad ID=", _last_ad_id);

	// TODO: take URL as an argument and add a pattern for candidate determination
	const r = await fetch('https://www.olx.com.eg/en/properties/apartments-duplex-for-rent/shorouk-city/', {
		method: "GET"
	});

	const html = await r.text();
	const doc = parse(html);
	const ads = doc.querySelectorAll(".ads__item");

	// Iterate ads and match criteria to notify
	ads.forEach((ele, _) => {
		// const url = ele.dataset?.adurl || (ele._attrs || {})['data-adurl'];
		const url = ele._attrs['data-adurl'];
		const inf = ele.querySelector(".ads__item__info");
		const ad_id = inf._attrs['data-id'];
		if (ad_id > _last_ad_id) {
			const price = parseFloat(inf._attrs['data-price']);
			console.debug("New ad, id=", ad_id, "price=", price);
			const is_candidate =  price < 8000;
			is_candidate && notifier.notify({
				title: "New apartment available",
				text: `${url}`
			});
			_last_ad_id = ad_id;
		}
	});

	_timeout_id = setTimeout(inspect_ads, INTERVAL_MS);
	console.log(new Date(), "Cycle ended.", "Last ad ID=", _last_ad_id);
};

(() => {
	inspect_ads();
})();