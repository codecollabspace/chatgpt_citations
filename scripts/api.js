/**
 * Returns an array of prompt objects
 * @returns {Array} an array of prompt objects
 */
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


    // List of prompt objects
    let prompts = [];

    for (let i = 0; i < messages.length; i++) {
        // Check if i is uneven we have a new prompt answer pair
        if ((i + 1) % 2 == 1) {
            var promptText = "";

            // Get all images in the prompt
            let imageElements = messages[i].querySelectorAll('img[alt="Uploaded image"]');
            let imageUploadedImagesInfoText = imageElements.length > 0 ? "[Uploaded image]\n".repeat(imageElements.length) : null;

            if (imageElements.length > 0) {
                // Assuming the text is after the images
                let textDivs = messages[i].querySelectorAll('div[class=""]');
                promptText = textDivs[textDivs.length - 1] ? textDivs[textDivs.length - 1].textContent.trim() : "";
            } else {
                // If no images, get the first div for text
                let promptTextElement = messages[i].querySelector('div[class=""]');
                promptText = promptTextElement ? promptTextElement.textContent.trim() : "";
            }
            prompts.push({
                prompt: promptText,
                answer: "",
                imageUploadedInfo: imageUploadedImagesInfoText,
                dataid: messages[i].getAttribute("data-testid")
            });

        } else {
            let answerElement = messages[i].querySelector('p');
            if (answerElement && prompts.length > 0) prompts[prompts.length - 1].answer = answerElement.textContent.trim();
            else if (prompts.length > 0) prompts[prompts.length - 1].answer = "";
        }
    }

    return prompts;
}

/**
 * Generates a BibTeX entry from an object
 * @param {object} data  the object to generate the BibTeX entry from
 * @returns  a BibTeX entry
 */
function generateBibTeX(data) {
    // Check if it is a json object
    if (typeof data !== "object") {
        return "";
    }

    let citation = "";

    // Start the entry
    citation += `@online{${data.id},\n`;

    // Author
    if (data.author) {
        citation += `  author = {${data.author}},\n`;
    }

    // Title
    if (data.title) {
        citation += `  title = {${escapeLaTeX(data.title)}},\n`;
    }

    // Publisher
    if (data.publisher) {
        citation += `  publisher = {${data.publisher}},\n`;
    }

    // Year
    if (data.date) {
        citation += `  date = {${data.date}},\n`;
    }

    // URL
    if (data.url) {
        citation += `  url = {${data.url}}\n`;
    }

    // End the entry
    citation += `}`;


    return citation;

}

/**
 * Returns the GPT version used in the chat
 * 
 * @returns {string} the GPT version used in the chat
 */
function getGPTver() {
    let chatGPTInfo = document.querySelector('.group.flex.cursor-pointer.items-center .text-token-text-secondary');

    if (chatGPTInfo) {
        chatGPTInfo = chatGPTInfo.parentNode.textContent.trim();
    } else {
        // Using custom gpt
        chatGPTInfo = document.querySelector("#citations-chat > main > div.flex.h-full.flex-col > div.flex-1.overflow-hidden > div > div > div > div.sticky.top-0.mb-1\\.5.flex.items-center.justify-between.z-10.h-14.p-2.font-semibold.bg-token-main-surface-primary").children[1];
        if (chatGPTInfo) {
            chatGPTInfo = chatGPTInfo.childNodes[0].textContent.trim();
        } else {
            chatGPTInfo = '';
        }
    }
    return chatGPTInfo;
}
/**
 * Returns the authors of the chat
 * @returns  the authors of the chat
 */
function getAuthors() {
    const gptVer = getGPTver();

    const gptVersions = {
        "ChatGPT 3.5": "OpenAI gpt-3.5",
        "ChatGPT 4": "OpenAI gpt-4",
        "ChatGPT 4 Plugins": "OpenAI gpt-4-plugins"
    };

    console.log(gptVer);

    if (!gptVer) {
        return "OpenAI ChatGPT";
    }

    return gptVersions[gptVer] || `OpenAI CustomGPT gpt-4 ${gptVer.replaceAll(" ", "-").toLowerCase()}`;
}

/**
 * Copies a prompt to the clipboard
 * @param {*} prompt  the prompt to copy
 */
function copyPrompt(prompt) {
    const now = new Date().toISOString().slice(0, 10);
    const authors = getAuthors();

    let citationData = {
        id: generateEntryId(prompt.prompt),
        // we could theorectically use the name of the chat as title, however the Austrian government does require the title of the source to be the prompt
        title: prompt.prompt,
        author: authors,
        publisher: "",
        url: window.location.href,
        date: now
    };

    let citation = generateBibTeX(citationData);

    navigator.clipboard.writeText(citation);
}