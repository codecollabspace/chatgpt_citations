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

function generateEntryId(chatId) {
    let shortId = chatId.substring(0, 8);
    let randomId = Math.floor(Math.random() * 1000000);
    return shortId + "_" + Date.now() + "_" + randomId;
}

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
        citation += `  title = {${data.title}},\n`;
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
        return "OpenAI ChatGPT";
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

function insertSidebar() {
    let parent = document.getElementById("__next").querySelector('div[class="relative z-0 flex h-full w-full overflow-hidden"]');
    let chat = document.querySelector('div[class="relative flex h-full max-w-full flex-1 flex-col overflow-hidden"]');
    chat.id = "citations-chat";

    // insert the sidebar container
    let sidebar = document.createElement("div");
    sidebar.id = "citation-sidebar";
    sidebar.classList = "flex-1 overflow-hidden flex h-full flex-col p-2"
    sidebar.style = "display: none;"
    parent.appendChild(sidebar);

    let title = document.createElement("div");
    title.innerText = "ChatGPT Citation Generator";
    title.classList = "py-2 px-3 text-lg font-medium";
    sidebar.appendChild(title);

    // insert toggle button for showing/hiding the sidebar
    let expander = document.createElement("div");
    expander.id = "citation-expander";
    expander.classList = "sticky top-0 mb-1.5 flex items-center justify-between z-10 h-14 bg-white p-2 font-semibold dark:bg-gray-800";
    expander.style = "position: absolute; right: 70px; top: 0; transition: right 0.2s ease-in-out;"
    expander.innerHTML = `
    <button class="btn relative btn-neutral btn-small flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-lg border border-token-border-medium focus:ring-0"><div class="flex w-full gap-2 items-center justify-center"><svg width="18.4" height="14.4" viewBox="0 0 18.4 14.4" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path d="M4.42 0.75H2.8625H2.75C1.64543 0.75 0.75 1.64543 0.75 2.75V11.65C0.75 12.7546 1.64543 13.65 2.75 13.65H2.8625C2.8625 13.65 2.8625 13.65 2.8625 13.65C2.8625 13.65 4.00751 13.65 4.42 13.65M13.98 13.65H15.5375H15.65C16.7546 13.65 17.65 12.7546 17.65 11.65V2.75C17.65 1.64543 16.7546 0.75 15.65 0.75H15.5375H13.98" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6.16045 7.41534C5.32257 7.228 4.69638 6.47988 4.69638 5.58551C4.69638 4.54998 5.53584 3.71051 6.57136 3.71051C7.60689 3.71051 8.44635 4.54998 8.44635 5.58551C8.44635 5.8965 8.37064 6.1898 8.23664 6.448C8.22998 6.48984 8.21889 6.53136 8.20311 6.57208L6.77017 10.2702C6.63182 10.6272 6.18568 10.7873 5.7737 10.6276C5.36172 10.468 5.13991 10.0491 5.27826 9.69206L6.16045 7.41534ZM11.4177 7.41534C10.5798 7.228 9.95362 6.47988 9.95362 5.58551C9.95362 4.54998 10.7931 3.71051 11.8286 3.71051C12.8641 3.71051 13.7036 4.54998 13.7036 5.58551C13.7036 5.8965 13.6279 6.1898 13.4939 6.448C13.4872 6.48984 13.4761 6.53136 13.4604 6.57208L12.0274 10.2702C11.8891 10.6272 11.4429 10.7873 11.0309 10.6276C10.619 10.468 10.3971 10.0491 10.5355 9.69206L11.4177 7.41534Z" fill="currentColor"></path>
    </svg></div></button>
    `;
    expander.onclick = toggleSidebar;
    document.body.appendChild(expander);

    // insert refresh button
    let refreshButton = document.createElement("div");
    refreshButton.id = "citation-refresh";
    refreshButton.classList = "sticky top-0 mb-1.5 flex items-center justify-between z-10 h-14 bg-white p-2 font-semibold dark:bg-gray-800";
    refreshButton.style = "position: absolute; right: 60px; top: 0; display: none;"
    refreshButton.innerHTML = `
    <button class="btn relative btn-neutral btn-small flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-lg border border-token-border-medium focus:ring-0"><div class="flex w-full gap-2 items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 2.5C5.05228 2.5 5.5 2.94772 5.5 3.5V5.07196C7.19872 3.47759 9.48483 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C7.1307 21.5 3.11828 17.8375 2.565 13.1164C2.50071 12.5679 2.89327 12.0711 3.4418 12.0068C3.99033 11.9425 4.48712 12.3351 4.5514 12.8836C4.98798 16.6089 8.15708 19.5 12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C9.7796 4.5 7.7836 5.46469 6.40954 7H9C9.55228 7 10 7.44772 10 8C10 8.55228 9.55228 9 9 9H4.5C3.96064 9 3.52101 8.57299 3.50073 8.03859C3.49983 8.01771 3.49958 7.99677 3.5 7.9758V3.5C3.5 2.94772 3.94771 2.5 4.5 2.5Z" fill="currentColor"></path></svg></div></button>
    `;
    refreshButton.onclick = insertCitations;
    document.body.appendChild(refreshButton);

    // insert container holding the citations
    let citationsContainer = document.createElement("div");
    citationsContainer.id = "citations-container";
    citationsContainer.classList = "flex-1 overflow-y-auto w-full h-full flex flex-col items-center";
    citationsContainer.style = "overflow-y: auto; margin-top: 70px;";
    sidebar.appendChild(citationsContainer);
}

function insertCitations() {
    let container = document.getElementById("citations-container");

    // clear the container

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    let prompts = [];

    try {
        prompts = getPrompts();
    } catch (error) {
        container.classList.add("justify-center");

        let title = document.createElement("h1");
        title.innerText = "Oops, something went wrong!";
        title.style = "text-align: center;"
        container.appendChild(title);

        let subtitle = document.createElement("p");
        subtitle.innerText = "There was an error while trying to get the citations. If this error persists, please open an issue on ";
        subtitle.style = "text-align: center;"
        container.appendChild(subtitle);

        let link = document.createElement("a");
        link.innerText = "GitHub";
        link.classList = "px-0.5 text-green-600 !no-underline"
        link.href = "https://github.com/officialbishowb/chatgpt_diploma_citation_extension/issues/new?title=Error%20while%20getting%20citations&body=Error%20message:%20" + encodeURIComponent(error.message) + "%0A%0AStack%20trace:%20" + encodeURIComponent(error.stack) + "%0A%0AChat%20URL:%20" + encodeURIComponent("<<PLEASE EXPORT YOUR CHAT AND PASTE THE LINK HERE>>");
        link.target = "_new";
        subtitle.appendChild(link);

        return;
    }

    // if there are no prompts, show a message
    if (prompts.length == 0) {
        container.classList.add("justify-center");

        let title = document.createElement("h1");
        title.innerText = "Citations";
        title.style = "text-align: center;"
        container.appendChild(title);

        let subtitle = document.createElement("p");
        subtitle.innerText = "Available citations for the current chat will appear here.";
        subtitle.style = "text-align: center;"
        container.appendChild(subtitle);

        return;
    }

    container.classList.remove("justify-center"); // only center the container if there are no citations

    // insert the citations
    for (let i = 0; i < prompts.length; i++) {
        let prompt = prompts[i];

        // let input = prompt.prompt.replace(/&/g, "&amp;")
        //     .replace(/</g, "&lt;")
        //     .replace(/>/g, "&gt;")
        //     .replace(/"/g, "&quot;")
        //     .replace(/'/g, "&#039;").prompt.prompt.replace(/(\r\n|\n|\r)/gm, " ");

        // let output = prompt.answer.replace(/&/g, "&amp;")
        //     .replace(/</g, "&lt;")
        //     .replace(/>/g, "&gt;")
        //     .replace(/"/g, "&quot;")
        //     .replace(/'/g, "&#039;").prompt.prompt.replace(/(\r\n|\n|\r)/gm, " ");

        let input = prompt.prompt.replace(/(\r\n|\n|\r)/gm, " ");
        let output = prompt.answer.replace(/(\r\n|\n|\r)/gm, " ");


        let citation = document.createElement("span");
        citation.style = "opacity: 1; transform: none;";
        citation.innerHTML = `
        <button class="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl px-4 py-3 text-left text-gray-700 dark:text-gray-300 md:whitespace-normal" as="button">
        <div class="flex w-full gap-2 items-center justify-center">
            <div class="flex w-full items-center justify-between">
                <div class="flex flex-col overflow-hidden">
                    <div class="truncate">${input}</div>
                    <div class="truncate font-normal opacity-50">${output}</div>
                </div>
                <div class="absolute bottom-0 right-0 top-0 flex items-center rounded-xl bg-gradient-to-l from-gray-50 from-[60%] pl-6 pr-4 text-gray-700 opacity-0 group-hover:opacity-100 dark:from-gray-700 dark:text-gray-200"><span class="" data-state="closed">
                        <div class="rounded-lg bg-token-surface-primary p-1 shadow-xxs dark:shadow-none"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="icon-sm text-token-text-primary">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path>
                            </svg></div>
                    </span></div>
            </div>
        </div>
    </button>
        `;
        citation.onclick = function () { copyPrompt(prompt) };
        citation.style.width = "90%";
        citation.style.marginTop = "10px";

        container.appendChild(citation);
    }

}

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

function toggleSidebar() {
    let sidebar = document.getElementById("citation-sidebar");
    let expander = document.getElementById("citation-expander");
    let chat = document.getElementById("citations-chat");
    let refreshButton = document.getElementById("citation-refresh");

    if (sidebar.style.display == "none") {
        sidebar.style.display = "flex";
        expander.style.right = "0";
        chat.classList.remove("flex-1");
        chat.classList.add("flex-2");
        chat.style = "transition: all 0.2s ease-out;"
        refreshButton.style.display = "flex";
    } else {
        sidebar.style.display = "none";
        expander.style.right = "70px";
        chat.classList.remove("flex-2");
        chat.classList.add("flex-1");
        chat.style = "";
        refreshButton.style.display = "none";
    }
}

window.addEventListener("load", function () {
    insertSidebar();

    // wait a second to make sure the chat is loaded
    this.setTimeout(function () {
        insertCitations();
    }, 1000);
});