// Function to send messages to the background script
async function violateBlackList(url, black_list) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {
                action: "checkViolation",
                data: { url, black_list }
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error in communication:", chrome.runtime.lastError);
                    return reject(false); // Default to no violation
                }
                resolve(response.violates);
            }
        );
    });
}

async function fetchAndCheckBlackList(user) {
    chrome.runtime.sendMessage(
        { action: "fetchBlacklist", data: { user } },
        async (response) => {
            if (response.success) {
                const black_list = response.data;
                console.log("Fetched blacklist:", black_list);

                if (black_list.length > 0) {
                    const images = Array.from(document.querySelectorAll("img")); // Limit to 10 images
                    let processedCount = 0; // Counter to track the number of images checked
                    // Use for...of loop to await the async function inside
                    for (const image of images) {
                        if (processedCount >= 15) {
                            break; // Exit the loop after processing 15 images
                        }
                        const rect = image.getBoundingClientRect();
                        const maxY = (window.innerHeight || document.documentElement.clientHeight) * 2;
                        // Check if the image is within the viewport
                        if (
                            rect.top >= 0 &&
                            rect.left >= 0 &&
                            rect.top <= maxY && // Top of the image is within twice the viewport height
                            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
                        ) {
                            processedCount++;
                            const isViolation = await violateBlackList(image.src, black_list);
                            if (isViolation) {
                                console.log("Hiding image:", image.src);
                                image.style.display = "none"; // Hide the image
                            }
                        }
                    }
                }
            } else {
                console.error("Failed to fetch blacklist:", response.error);
            }
        }
    );
}

let intervalId = null;

// Function to start the interval for checking the blacklist
function startBlacklistCheck(username) {
    // Clear any existing interval to avoid duplicate checks
    if (intervalId) {
        clearInterval(intervalId);
    }

    // Initial fetch
    fetchAndCheckBlackList(username);

    // Set up periodic checking
    intervalId = setInterval(() => {
        fetchAndCheckBlackList(username);
    }, 300000); // Update every 30 seconds
}

// Initial Call: Check for username in storage
chrome.storage.local.get(["username"], (result) => {
    if (result.username) {
        console.log("Initial username detected:", result.username);
        startBlacklistCheck(result.username);
    } else {
        console.warn("No username found in storage on script start.");
    }
});

// Listener: Trigger when the username is added or changed in storage
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.username) {
        const username = changes.username.newValue;
        if (username) {
            console.log("Username detected in storage change:", username);
            startBlacklistCheck(username);
        } else {
            console.warn("Username removed or set to null.");
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    }
});
