  browser.runtime.onMessage.addListener((request, sender) => {
    if (request.action === "fetchPrompts") {
        console.log("Fetching prompts action received");
        let prompts = getUserPrompts();
        return Promise.resolve({ prompts: prompts });
    } else if (request.action === "generateCitation") {
        console.log("Generate citation action received");
        let citation = generateBibTeX(request.entry);
        return Promise.resolve({ citation: citation });
    }
    return false;
  });
  

function getUserPrompts() {
    let allUserPrompts = [];
    
    // Query the document for elements that contain user messages
    let userMessageElements = document.querySelectorAll('div[data-message-author-role="user"]');

    userMessageElements.forEach(element => {
        // Extract the text content of each message element
        let messageText = element.textContent || element.innerText;
        allUserPrompts.push(messageText.trim());
    });

    return allUserPrompts;
}



function generateBibTeX(entries) {

    let allEntriesBibTeX = [];

    entries.forEach(entry => {
        // Check if it is a json object
        if (typeof entry !== "object") {
            return "";
        }
    
        let citation = "";

        // Start the entry
        citation += `@online{${entry.id},\n`;

        // Author
        if (entry.author) {
            citation += `  author = {${entry.author}},\n`;
        }

        // Title
        if (entry.title) {
            citation += `  title = {${entry.title}},\n`;
        }

        // Publisher
        if (entry.publisher) {
            citation += `  publisher = {${entry.publisher}},\n`;
        }

        // Year
        if (entry.date) {
            citation += `  date = {${entry.date}}\n`;
        }

        // URL
        if (entry.url) {
            citation += `  url = {${entry.url}}\n`;
        }

        // End the entry
        citation += `}`;

        allEntriesBibTeX.push(citation);
    });

    return allEntriesBibTeX;
    
}
