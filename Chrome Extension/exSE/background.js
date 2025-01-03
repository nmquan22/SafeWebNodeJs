// background.js

const activeTimeStorageKey = 'activeTime';
const websiteUsageLimitsStorageKey = 'websiteUsageLimits';
const blockedWebsitesStorageKey = 'blockedWebsites';



function isWithinActiveTime(startTime, endTime) {
    const now = new Date();
    const currentHour = now.getHours();
    console.log('current hour: '+ currentHour)
    console.log('Start active time:' + startTime)
    console.log('End active time:'+ endTime)
    console.log(endTime)
    if (endTime < startTime) {
       
        return currentHour >= startTime || currentHour <= endTime;
    } else {
        return currentHour >= startTime && currentHour <= endTime;
    }
}

async function fetchAndStoreActiveTime(user) {
    try {
        console.log('http://localhost:5000/time_active/' + user)
        const response = await fetch('http://localhost:5000/time_active/' + user);
        if (response.ok) {
            const activeTimeData = await response.json();
            chrome.storage.local.set({ [activeTimeStorageKey]: activeTimeData });
        } else {
            console.error('Failed to fetch active time from server.');
        }
    } catch (error) {
        console.error('Error fetching active time:', error);
    }
}

async function fetchAndStoreWebsiteUsageLimits(user) {
    try {
        const response = await fetch('http://localhost:5000/website_time_limit/' + user);
        if (response.ok) {
            const websiteUsageLimits = await response.json();
            chrome.storage.local.set({ [websiteUsageLimitsStorageKey]: websiteUsageLimits });
        } else {
            console.error('Failed to fetch website usage limits from server.');
        }
    } catch (error) {
        console.error('Error fetching website usage limits:', error);
    }
}


function generateUniqueId() {
    return Math.floor(Math.random() * 1000000);
}

function blockSites(sites) {
    const rules = sites.map((site) => ({
        id: generateUniqueId(),
        priority: 1,
        action: { type: "block" },
        condition: {
            urlFilter: site,
            resourceTypes: ["main_frame"]
        }
    }));

    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules,
        removeRuleIds: rules.map(rule => rule.id)
    });
}

// Function to fetch and block sites
async function fetchAndBlockSites(user) {
    try {
        console.log('http://localhost:5000/blocked_sites/' + user)
        const response = await fetch('http://localhost:5000/blocked_sites/' + user);
        if (response.ok) {
            const blockedWebsites = await response.json();
            console.log(blockedWebsites)
            // Generate unique IDs for each rule
            const rules = blockedWebsites.map((site) => ({
                id: generateUniqueId(),
                priority: 1,
                action: { type: "block" },
                condition: {
                    urlFilter: site,
                    resourceTypes: ["main_frame"]
                }
            }));
            
            // Update dynamic rules using declarativeNetRequest API
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: rules,
                removeRuleIds: rules.map(rule => rule.id)
            });
        } else {
            console.error('Failed to fetch blocked websites');
        }
    } catch (error) {
        console.error('Error fetching blocked websites:', error);
    }
}


async function fetchAndApplyActiveTimeRules() {
    try {
        // Retrieve active time configuration and existing rule ID from storage
        const { [activeTimeStorageKey]: activeTime, activeTimeRuleId } = await new Promise((resolve) => {
            chrome.storage.local.get([activeTimeStorageKey, 'activeTimeRuleId'], resolve);
        });

        if (activeTime && activeTime[0] !== undefined && activeTime[1] !== undefined) {
            const isActive = isWithinActiveTime(activeTime[0], activeTime[1]);

            if (isActive) {
                console.log('Within active time. Removing block rules.');

                // Remove the rule if it exists
                if (activeTimeRuleId) {
                    await chrome.declarativeNetRequest.updateDynamicRules({
                        removeRuleIds: [activeTimeRuleId]
                     
                    });
                    console.log('Remove rule id: ' + [activeTimeRuleId])
                    // Clear the stored rule ID
                    chrome.storage.local.remove('activeTimeRuleId');
                }
            } else {
                console.log('Outside active time. Adding block rule.');

                // Generate a new unique ID for the rule
                const newRuleId = generateUniqueId();

                // Remove the previous rule, if any
                if (activeTimeRuleId) {
                    await chrome.declarativeNetRequest.updateDynamicRules({
                        removeRuleIds: [activeTimeRuleId]
                    });
                }

                // Add the new blocking rule
                await chrome.declarativeNetRequest.updateDynamicRules({
                    addRules: [
                        {
                            id: newRuleId,
                            priority: 1,
                            action: { type: "block" },
                            condition: {
                                urlFilter: "*",
                                resourceTypes: ["main_frame"]
                            }
                        }
                    ]
                });

                // Store the new rule ID for future reference
                chrome.storage.local.set({ activeTimeRuleId: newRuleId });
            }
        } else {
            console.error('Active time not defined or incomplete in storage.');
        }
    } catch (error) {
        console.error('Error fetching or applying active time rules:', error);
    }
}




chrome.storage.local.get(['username', 'secretKey'], function (result) {
    if (result.username && result.secretKey) {
        // Fetch the blacklist based on the username
        //black_list = fetchBlacklist(result.username);
        console.log('Username:', result.username);
        console.log('Secret Key:', result.secretKey);
        username = result.username
        // Initial fetches and store
        fetchAndStoreActiveTime(result.username);
        setInterval(fetchAndStoreActiveTime, 3600000); // Update every hour

        setTimeout(() => {
            // Apply active time rules
            if ([activeTimeStorageKey]) {
                fetchAndApplyActiveTimeRules(username);
                setInterval(fetchAndApplyActiveTimeRules, 60000, username); // Update every minute
            }
        }, 5000); 

        // Apply active time rules
        if ([activeTimeStorageKey]) {
            fetchAndApplyActiveTimeRules(result.username);
            setInterval(fetchAndApplyActiveTimeRules, 60000); // Update every minute
        }

        // Apply blocked websites
        fetchAndBlockSites(result.username);
        setInterval(fetchAndBlockSites, 600000); 
       
    } else {
        console.log('No username or secret key found.');
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchBlacklist") {
        const user = message.data.user;
        const url = `http://localhost:5000/black_list/${user}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => sendResponse({ success: true, data }))
            .catch((error) => {
                console.error("Error fetching blacklist:", error);
                sendResponse({ success: false, error });
            });
        return true; // Keep the message channel open for async response
    }

    if (message.action === "checkViolation") {
        const { url, black_list } = message.data;
        fetch('http://localhost:5000/check-violation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, black_list }),
        })
            .then((response) => response.json())
            .then((data) => sendResponse({ violates: data.violates }))
            .catch((error) => {
                console.error("Error in checkViolation:", error);
                sendResponse({ violates: false });
            });
        return true; // Keep the message channel open for async response
    }
});
