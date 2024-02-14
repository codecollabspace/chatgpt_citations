insertSidebar();

let currentHref = window.location.href;

// observe the chat for changes
let observer = new MutationObserver(function (mutations) {
    let navigated = window.location.href != currentHref;
    if (navigated) {
        currentHref = window.location.href;
    } else {
        return;
    }

    // insert the sidebar if it is not already inserted
    if (!hasInit()) {
        insertSidebar();
    }

    // wait for the messages to load
    setTimeout(() => {
        insertCitations();
    }, 1000);


});


// Observer the data-headlessui-state attribute for changes
let headlessObserver = new MutationObserver(function (mutations) {
    mutations.forEach(mutation => {
        // Check if the mutation is related to the attribute change
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-headlessui-state') {
            let headlessuiDiv = mutation.target;

            // Get the state attribute value
            let state = headlessuiDiv.getAttribute('data-headlessui-state');

            // If state is "open", insert the links
            if (state === 'open') {
                const links = [
                    { url: 'https://github.com/codecollabspace/chatgpt_citations', text: 'ChatGPT Citations Github' },
                    { url: 'https://github.com/codecollabspace/chatgpt_citations/issues', text: 'ChatGPT Citations Issues' },
                ];
            
                insertLinks(links);
            }
        }
    });
});


observer.observe(document.body, { childList: true, subtree: true });
headlessObserver.observe(document.body, { attributes: true, subtree: true });