browser.runtime.onMessage.addListener((request, sender) => {
    console.log("Received a message from the popup: ", request);

    if (request.action === "fetchPrompts") {
        return Promise.resolve({ prompts: getPrompts() });
    } else if (request.action === "generateCitation") {
        let citation = generateBibTeX(request.entry);
        return Promise.resolve({ citation: citation });
    }
    return false;
});


function getPrompts() {
    let presentation = document.querySelector('div[role="presentation"]');

    if (!presentation) {
        return [];
    }

    let chat = presentation.children[0];


    if (!chat) {
        return [];
    }

    // get all children with theses classes w-full text-token-text-primary
    let messages = chat.querySelectorAll('div[class="w-full text-token-text-primary"]');


    let prompts = [];

    for (let i = 0; i < messages.length; i++) {
        //if i is uneven whe have a new prompt answer pair
        if ((i + 1) % 2 == 1) {
            prompts.push({ prompt: messages[i].querySelector('div[class=""]').textContent.trim(), answer: "" });
        } else {
            prompts[prompts.length - 1].answer = messages[i].querySelector('p').textContent.trim();
        }
    }

    return prompts;
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
            citation += `  date = {${entry.date}},\n`;
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

/**
 * Returns the GPT version used in the chat
 * 
 * @returns {string} the GPT version used in the chat
 */
function getGPTver() {
    let titleBar = document.querySelector('div[class="sticky top-0 mb-1.5 flex items-center justify-between z-10 h-14 bg-white p-2 font-semibold dark:bg-gray-800"]');

    let gptVer = titleBar.children[1].children[0].children[0].innerText;

    if (!gptVer) {
        let gptName = document.querySelector('div[class="group flex cursor-pointer items-center gap-1 rounded-xl py-2 px-3 text-lg font-medium hover:bg-gray-50 radix-state-open:bg-gray-50 dark:hover:bg-black/10 dark:radix-state-open:bg-black/20"]');

        return gptName.innerText;
    }

    return gptVer
}

function getAuthors() {
    const gptVer = getGPTver();

    if (!gptVer) {
        return undefined;
    }

    if (gptVer == "ChatGPT Plugins") {
        return "OpenAI gpt-4-plugins"
    }

    if (gptVer == "ChatGPT 4") {
        return "OpenAI gpt-4"
    }

    if (gptVer == "ChatGPT 3.5") {
        return "OpenAI gpt-3.5"
    }

    return "OpenAI CustomGPT gpt-4 " + gptVer.replaceAll(" ", "-").toLowerCase();
}