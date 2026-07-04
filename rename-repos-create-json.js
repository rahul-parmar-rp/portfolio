import fs from "fs";

// Read the JSON file
fs.readFile("./repos.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    const repos = JSON.parse(data);
    const formattedRepos = repos.map((repo) => {
      // Format the repository name
      const formattedName = repo.name
        .replace(/([a-z])([A-Z])/g, "$1-$2") // Add dash between camel case
        .replace(/_/g, "-") // Replace underscores with dashes
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-z0-9-]/g, ""); // Remove invalid characters

      return {
        ...repo,
        renameWith: formattedName, // Add new field instead of updating name
      };
    });

    // Output the updated repositories with the new field
    console.log(formattedRepos);

    //   Optionally, write the updated array back to the file
    fs.writeFile(
      "./repos.json",
      JSON.stringify(formattedRepos, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing to the file:", writeErr);
        } else {
          console.log("File updated successfully with new renameWith field.");
        }
      },
    );
  } catch (jsonErr) {
    console.error("Error parsing JSON:", jsonErr);
  }
});
