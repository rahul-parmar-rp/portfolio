/**
 * @no_jscheck
 */
document.getElementById("scrapeBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.innerText = "Scraping...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        // Simple logic to find elements that might represent contacts in WhatsApp Web
        // This selector is a placeholder as the actual WhatsApp DOM changes frequently.
        const elements = document.querySelectorAll(
          'span[title*=""], span[title]',
        );
        const contacts = Array.from(elements)
          .map((el) => el.getAttribute("title"))
          .filter((title) => title && title.length > 0);

        // Filter for unique titles and basic cleanup
        const uniqueContacts = [...new Set(contacts)].sort();

        if (uniqueContacts.length === 0) {
          alert("No contacts found or you are not on a valid page.");
        } else {
          console.log("Found contacts:", uniqueContacts);
          alert(
            `Found ${uniqueContacts.length} potential entries: \n${uniqueContacts.slice(0, 10).join(", ")}...`,
          );
        }
      },
    },
    () => {
      status.innerText = "Done!";
    },
  );
});
