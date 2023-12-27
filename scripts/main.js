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

observer.observe(document.body, { childList: true, subtree: true });
