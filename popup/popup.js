document.addEventListener('DOMContentLoaded', function() {
    var generateButton = document.getElementById('generate_citation');
    var form = document.getElementById('form');

    // Check if the current tab is a valid URL
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let currentTablUrl = tabs[0].url;
        if (!isValidUrl(currentTablUrl)) {
            // Disable the button if the URL is invalid by adding the disabled class
            form.classList.add('hidden');
            generateButton.disabled = true; // Disables the button functionality

            // Display a message to the user
            var citationDiv = document.getElementById('citation');
            var message = document.createElement('p');
            message.textContent = "This page is not supported by the citation generator.";
            citationDiv.appendChild(message);
        }
        else{
            // Remove the disabled class from the button
            form.classList.remove('hidden');
            generateButton.disabled = false; // Enables the button functionality
        }
    });

    generateButton.addEventListener('click', function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "fetchPrompts" }, function(response) {
                    // Handle the response here
                    if (response && response.prompts) {
                        
                        // Display a progress message
                        let promptLength = response.prompts.length;
                        
                        let prompts = response.prompts;
                        let author = getAuthorName();
                        let chatId = getUrlChatId(tabs[0].url);

                        displayProgressMessage("Recieved "+promptLength+" user prompts. Preparing ...");

                        // Format the prompts as an object list, send it to the generateCitation function and display the result
                        let entries = generateEntryForEachPrompt(prompts, chatId, author);

                        displayProgressMessage("Prepared the "+entries.length+" citations. Generating the bibTeX citation ...");
                        // Generate the citation
                        chrome.tabs.sendMessage(tabs[0].id, { action: "generateCitation", entry: entries }, function(response) {
                            // Handle the response here
                            if (response && response.citation) {
                                displayProgressMessage("Successfully generated "+entries.length+" citations. Displaying the result ...");
                                
                                // Display the citation
                                displayBibTexCitation(response.citation);
                            }
                        });

                    }
                });
            });
        
    });
});



function displayBibTexCitation(citationTexts) {
    // Display the generated citation in the popup
    var citationDiv = document.getElementById('citation');
    
    if (citationDiv.classList.contains('hidden')) {
        citationDiv.classList.remove('hidden');
    }

    // Clear the citation div
    citationDiv.innerHTML = "";

    // Display the citation
    citationTexts.forEach(citationText => {
        var citation = document.createElement('p');
        citation.textContent = citationText;
        citationDiv.appendChild(citation);
    });



}

function isValidUrl(urlString) {
    try {
        let url = new URL(urlString);
        // Check if the protocol is HTTPS, the hostname matches, and the pathname starts with /c/ and is followed by a UUID
        return url.protocol === "https:" && 
               url.hostname === "chat.openai.com"
    } catch (e) {
        console.error("Invalid URL:", e);
        return false;
    }
}

function displayProgressMessage(message) {
    var progressDiv = document.getElementById('progress_message');
    
    // Remove the hidden class
    if (progressDiv.classList.contains('hidden')) {
        progressDiv.classList.remove('hidden');
    }

    // Display the message
    progressDiv.textContent = message;
}

function generateEntryForEachPrompt(prompts, chatId, author) {
    let entries = [];
    for (let i = 0; i < prompts.length; i++) {
        let entryId = generateEntryId(chatId);
        let todaysDate = new Date().toISOString().slice(0, 10); 
        try {
            let entry = {
                id: entryId,
                title: prompts[i],
                author: author,
                date: todaysDate,
                publisher: ""
            };
            entries.push(entry);
        } catch (error) {
            continue;
        }
    }
    return entries;
}



function generateEntryId (chatId) {
    let shortId = chatId.substring(0, 8); 
    let randomId = Math.floor(Math.random() * 1000000);
    return shortId + "_" + Date.now() + "_" + randomId;
}


function getAuthorName() {
    let authorElement = document.getElementById('author');
    return authorElement.value;
}

function findAuthorName() {
    // Try to find the username of the logged in user
    let authorElement = document.querySelector('div.font-semibold');

    let authorInput = document.getElementById('author');

    // If the element is found, return its text content
    if (authorElement) {
        authorInput.value =  authorElement.textContent.trim();
    } else {
        authorInput.value = "";
    }
}


function getUrlChatId(urlString) {
    try {
        let url = new URL(urlString);
        // Check if the protocol is HTTPS, the hostname matches, and the pathname starts with /c/ and is followed by a UUID
        if (url.protocol === "https:" && 
            url.hostname === "chat.openai.com" &&
            url.pathname.startsWith("/c/")) {
            let chatId = url.pathname.substring(3);
            return chatId;
        }
        else {
            return "";
        }
    } catch (e) {
        console.error("Invalid URL:", e);
        return "";
    }
}