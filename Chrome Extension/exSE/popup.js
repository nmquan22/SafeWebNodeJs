document.addEventListener('DOMContentLoaded', () => {
    // Check if the username, secret key, and GEMINI API key are already saved in local storage
    chrome.storage.local.get(['username', 'secretKey', 'geminiApiKey'], function (result) {
        if (result.username && result.secretKey && result.geminiApiKey) {
            // If all exist, hide the form and show a message
            document.getElementById('form-container').style.display = 'none';
            document.getElementById('already-set').style.display = 'block';
        } else {
            // If they don't exist, show the form to enter them
            document.getElementById('save-button').addEventListener('click', function () {
                const username = document.getElementById('username').value;
                const secretKey = document.getElementById('secret-key').value;
                const geminiApiKey = document.getElementById('gemini-api-key').value;

                if (username && secretKey && geminiApiKey) {
                    // Save the username, secret key, and GEMINI API key into chrome.storage.local
                    chrome.storage.local.set({ username, secretKey, geminiApiKey }, function () {
                        console.log('Data saved!');
                        alert('Username, secret key, and GEMINI API key saved!');
                        // Hide the form and show the confirmation message
                        document.getElementById('form-container').style.display = 'none';
                        document.getElementById('already-set').style.display = 'block';
                    });
                } else {
                    alert('Please enter a username, secret key, and GEMINI API key.');
                }
            });
        }
    });
});
