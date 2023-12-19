// content_script.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "fetchPrompts") {
        // Logic to fetch prompts from the page's DOM
        let prompts = getUserPrompts();
        // Send the prompts back to the popup
        sendResponse({ prompts: prompts });
        return true; // Required for asynchronous sendResponse
      }

      else if (request.action === "generateCitation") {
        // Genertae bibTeX citation
        let citation = generateBibTeX(request.entry);
        // Send the citation back to the popup
        sendResponse({ citation: citation });
        return true; // Required for asynchronous sendResponse
      }
    }
  );



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


    console.log(entries);
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

        // End the entry
        citation += `}`;

        allEntriesBibTeX.push(citation);
    });

    return allEntriesBibTeX;
    
}
