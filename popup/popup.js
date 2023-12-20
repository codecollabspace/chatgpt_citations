document.addEventListener("DOMContentLoaded", function () {
  var generateButton = document.getElementById("generate_citation");
  var form = document.getElementById("form");

  // Check if the current tab is a valid URL
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentTablUrl = tabs[0].url;
    if (!isValidUrl(currentTablUrl)) {
      // Disable the button if the URL is invalid by adding the disabled class
      form.classList.add("hidden");
      generateButton.disabled = true; // Disables the button functionality

      // Display a message to the user
      displayProgressMessage(
        "This page is not supported by the citation generator."
      );
    } else {
      // Remove the disabled class from the button
      form.classList.remove("hidden");
      generateButton.disabled = false; // Enables the button functionality
    }
  });

  generateButton.addEventListener("click", function (event) {
    event.preventDefault();
    let displayAuthor = getAuthorName() == "" ? "" : getAuthorName()+"'s";

    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      displayProgressMessage("Fetching " + displayAuthor + " prompts ...");
      browser.tabs.sendMessage(tabs[0].id, { action: "fetchPrompts" }).then((response) => {
          if (response && response.prompts) {
            // Display a progress message
            let promptLength = response.prompts.length;

            let prompts = response.prompts;
            let author = getAuthorName();
            let chatId = getUrlChatId(tabs[0].url);

            displayProgressMessage(
              "Recieved " + promptLength + " user prompts. Preparing ..."
            );

            // Format the prompts as an object list, send it to the generateCitation function and display the result
            let entries = generateEntryForEachPrompt(prompts, chatId, author);

            displayProgressMessage(
              "Prepared " +
                entries.length +
                " prompts. Generating the bibTeX citation ..."
            );
            // Generate the citation
            browser.tabs.sendMessage(
              tabs[0].id,
              { action: "generateCitation", entry: entries }).then((response) => {
                if (response && response.citation) {
                    displayProgressMessage(
                      "Successfully generated " +
                        entries.length +
                        " citations. Displaying the result ..."
                    );
  
                    // Display the citation
                    displayBibTexCitation(response.citation);

                    // Clear the progress message
                    displayProgressMessage("");
                  }
              }
            );
          }
        });
    });
  });
});




function displayBibTexCitation(citationTexts) {
    // Display the generated citation in the popup
    var citationTexarea = document.getElementById("citation");

    
    if (citationTexarea.classList.contains("hidden")) {
        citationTexarea.classList.remove("hidden");
    }

    // Display copy citation button
    var copyButton = document.getElementById("copy_citation");
    if (copyButton.classList.contains("hidden")) {
        copyButton.classList.remove("hidden");
    }
    copyButton.addEventListener("click", copyCitation);

    // Clear the citation div
    citationTexarea.innerHTML = "";

    // Display the list of citations with a <br> tag between each citation
    citationTexts.forEach(citationText => {
        citationTexarea.innerHTML += citationText + "&#013;&#010;&#013;&#010;";
    });
    

}

function isValidUrl(urlString) {
  try {
    let url = new URL(urlString);

    // Check if the protocol is HTTPS, the hostname matches, and the pathname starts with /c/ and is followed by a UUID
    return url.protocol === "https:" && url.pathname.startsWith("/c/");
  } catch (e) {
    console.error("Invalid URL:", e);
    return false;
  }
}

function displayProgressMessage(message) {
  var progressDiv = document.getElementById("info_message");

  // Remove the hidden class
  if (progressDiv.classList.contains("hidden")) {
    progressDiv.classList.remove("hidden");
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
        publisher: "",
        url: "https://chat.openai.com/c/" + chatId,
      };
      entries.push(entry);
    } catch (error) {
      continue;
    }
  }
  return entries;
}

function generateEntryId(chatId) {
  let shortId = chatId.substring(0, 8);
  let randomId = Math.floor(Math.random() * 1000000);
  return shortId + "_" + Date.now() + "_" + randomId;
}

function getAuthorName() {
  let authorElement = document.getElementById("author");
  return authorElement.value;
}

function findAuthorName() {
  // Try to find the username of the logged in user
  let authorElement = document.querySelector("div.font-semibold");

  let authorInput = document.getElementById("author");

  // If the element is found, return its text content
  if (authorElement) {
    authorInput.value = authorElement.textContent.trim();
  } else {
    authorInput.value = "";
  }
}

function getUrlChatId(urlString) {
  try {
    let url = new URL(urlString);
    // Check if the protocol is HTTPS, the hostname matches, and the pathname starts with /c/ and is followed by a UUID
    if (
      url.protocol === "https:" &&
      url.hostname === "chat.openai.com" &&
      url.pathname.startsWith("/c/")
    ) {
      let chatId = url.pathname.substring(3);
      return chatId;
    } else {
      return "";
    }
  } catch (e) {
    console.error("Invalid URL:", e);
    return "";
  }
}

function copyCitation() {
    var citationTextarea = document.getElementById("citation");
    navigator.clipboard.writeText(citationTextarea.value)
        .then(() => {
            console.log('Citation copied to clipboard');
            // Optionally, display a success message to the user
        })
        .catch(err => {
            console.error('Error in copying text: ', err);
        });
}


function copyCitation() {
    var citationTextarea = document.getElementById("citation");
    navigator.clipboard.writeText(citationTextarea.value)
        .then(() => {
            console.log('Citation copied to clipboard');
            // Optionally, display a success message to the user
        })
        .catch(err => {
            console.error('Error in copying text: ', err);
        });
}
