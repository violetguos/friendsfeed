var hideStoryPreference = true,
	newsFeedSelector = '._5pcb',
	storySelector = '._5jmm',
	storyHeaderSelector = '._1qbu';

chrome.storage.sync.get({
	hideStory: true
}, function(preferences) {
	hideStoryPreference = preferences.hideStory;
});

document.body.addEventListener('DOMNodeInserted', function(event) {
	clearAddedFeed(event);
});

clearExistingFeed();

function clearExistingFeed() {
	var storyElements = document.querySelectorAll(storySelector);
	[].forEach.call(storyElements, function(storyElement) {
		processStory(storyElement);
	});
	// On load we hide News Feed, to prevent blick of unwanted stories
	// Now when first stories are filtered, we can show it
	// document.querySelector('#stream_pagelet').classList.add('show');
	appendStyle('#stream_pagelet ._5pcb { height:auto; overflow:auto; }');
}

function clearAddedFeed(event) {
	var storyElement = event.target.parentNode;
	processStory(storyElement);
}

function processStory(storyElement) {
	if(!isElement(storyElement)) return;
	if(!storyElement.classList.contains('_5jmm')) return;
	// Story with header
	if(storyElement.querySelector(storyHeaderSelector)) {
		var linkElements = storyElement.querySelectorAll(storyHeaderSelector + ' a');
		// GET HREFS
		// If empty array of hrefs return;
		// var authorHrefs = storyElement.querySelectorAll('._3x-2 ._5pbw._5vra a'),
		// Compare two arrays and look for match
		// var linkElement = storyElement.querySelector(storyHeaderSelector + ' a');
		if(linkElement && linkElement.href) {
			linkElementHref = linkElement.href.replace(/\?.+/, '');
			var authorHrefs = storyElement.querySelectorAll('._3x-2 ._5pbw._5vra a'),
				match = false;
			[].forEach.call(authorHrefs, function(authorHref) {
				var authorHref = authorHref.href.replace(/\?.+/, '');
				if(linkElementHref == authorHref) {
					match = true;
				}
			});
			if(match) return;
		}
		hideStory(storyElement);
		return;
	}
	// Sponsored Post
	if(storyElement.querySelector('._5g-l') && storyElement.querySelector('.uiStreamSponsoredLink')) {
		hideStory(storyElement);
		return;
	}
	// People you may know
	if(storyElement.querySelector('._1dwg._1w_m .mts')) {
		hideStory(storyElement);
		return;
	}
}

function hideStory(el) {
	if(hideStoryPreference) {
		el.style.display = "none";
	} else {
		el.style.opacity = .4;
	}
}

function appendStyle(content) {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = content;
	document.getElementsByTagName('head')[0].appendChild(style);
}

function isElement(obj) {
	return (typeof HTMLElement === "object" ? obj instanceof HTMLElement : obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName==="string");
}