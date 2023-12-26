/**
 * Escapes HTML characters in a string
 * @param {string} text  the text to escape
 * @returns {string} the escaped text 
 */
function escapeHTML(text) {
    return text.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


/**
 * Escapes LaTeX characters in a string
 * @param {*} str  the string to escape
 * @returns   the escaped string
 */
function escapeLaTeX(str) {
    return str.replace(/\\/g, '{\\textbackslash}')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\^/g, '\\^{}')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\textasciitilde')
        .replace(/#/g, '\\#')
        .replace(/&/g, '\\&');
}

/**
 * An click event listener for to navigate to a prompt when clicked on it, based on the data-testid attribute
 * 
 * @param {String} dataid  the id of the prompt to scroll to
 */
function scrollToPrompt(dataid) {
    let prompt = document.querySelector(`[data-testid="${dataid}"]`);
    if (!prompt) {
        return;
    }
    prompt.scrollIntoView({ behavior: "smooth" });

}


/**
 * Checks if the sidebar has been inserted
 * 
 * @returns {boolean} true if the sidebar has been inserted
 */
function hasInit() {
    return document.getElementById("citation-sidebar") != null;
}

/**
 * Checks if the user is on a chat page
 * 
 * @returns {boolean} true if the user is on a chat page
 */
function isChatPage() {
    return window.location.href.includes("/c/");
}


/**
 * Generates a unique entry id
 * @param {*} chatId  the id of the chat
 * @returns  a unique entry id
 */
function generateEntryId(chatId) {
    let shortId = chatId.substring(0, 8);
    let randomId = Math.floor(Math.random() * 1000000);
    return (shortId + "_" + Date.now() + "_" + randomId).replaceAll(" ", "_").replaceAll("\n", "_");
}