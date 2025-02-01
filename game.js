
// Wait for the entire HTML document to be fully loaded before executing
document.addEventListener("DOMContentLoaded", function () {
    const letterDiv = document.getElementById("letter"); // Get the #letter div
    if (!letterDiv) {
        console.log("No element with id='letter' found.");
        return;
    }

    const textNodes = []; // Array to store text nodes
    let allText = ""; // Store all text content for later word selection

    // Function to recursively extract text nodes while ignoring unwanted elements
    function extractTextNodes(node) {
        // Skip non-content elements
        if (node.nodeType === Node.ELEMENT_NODE &&
            ["SCRIPT", "STYLE", "META", "HEAD", "NOSCRIPT"].includes(node.tagName)) {
            return;
        }

        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
            textNodes.push(node); // Store the text node
            allText += " " + node.nodeValue; // Accumulate text content
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Recursively process child nodes
            node.childNodes.forEach(extractTextNodes);
        }
    }

    extractTextNodes(letterDiv); // Start extraction from #letter div

    // Replace each text node with buttons for each word
    textNodes.forEach(node => {
        const words = node.nodeValue.split(/\s+/).filter(word => word.trim() !== ""); // Split text into words and filter out empty words
        const fragment = document.createDocumentFragment(); // Use a fragment for efficient DOM updates

        words.forEach((word, index) => {
            const button = document.createElement("button"); // Create a button element
            button.textContent = word; // Set button text to the word
            fragment.appendChild(button); // Append button to fragment

            // Preserve spaces between words
            if (index < words.length - 1) {
                fragment.appendChild(document.createTextNode(" "));
            }
        });

        // Replace the text node with the new buttons in its parent
        node.parentNode.replaceChild(fragment, node);
    });

    selectRandomWord(allText); // Select a random word from the extracted text
});

// Function to select a random word with at least 4 alphabetic letters
function selectRandomWord(text) {
    // Convert text to lowercase and split into words
    const words = text.toLowerCase().split(/\s+/).filter(word => /[a-z]/.test(word) && word.replace(/[^a-z]/gi, "").length >= 4);

    if (words.length === 0) {
        console.log('No valid word found with at least 4 alphabetic letters.');
        return;
    }

    // Select a random word from the filtered list
    const randomWord = words[Math.floor(Math.random() * words.length)];
    console.log('Random word:', randomWord);

    // Calculate details about the selected word
    const wordDetails = calculateWordDetails(randomWord);

    // Add event listeners to handle button clicks
    addButtonClickListener(wordDetails, document.body, randomWord);
}

// Function to analyze the selected word
function calculateWordDetails(word) {
    const cleanedWord = word.replace(/[^a-z]/gi, ""); // Remove non-alphabetic characters
    const vowelsSet = new Set('aeiou'); // Define a set of vowels for quick lookup
    let vowelCount = 0; // Counter for vowels
    let consonantCount = 0; // Counter for consonants
    let letters = {}; // Object to store individual letters

    // Loop through each letter of the cleaned word
    for (let i = 0; i < cleanedWord.length; i++) {
        const letter = cleanedWord[i];
        letters[`letter${i + 1}`] = letter; // Store letter in object

        // Check if the letter is a vowel or consonant
        if (vowelsSet.has(letter)) {
            vowelCount++;
        } else {
            consonantCount++;
        }
    }

    // Log word details for debugging
    console.log('Cleaned Word:', cleanedWord);
    console.log('Letter count:', cleanedWord.length);
    console.log('Vowel count:', vowelCount);
    console.log('Consonant count:', consonantCount);
    console.log('Individual Letters:', letters);

    // Return word details as an object
    return { letterCount: cleanedWord.length, vowelCount, consonantCount, letters };
}

// Function to add event listeners for button clicks
function addButtonClickListener(wordDetails, body, randomWord) {
    const randomWordStripped = randomWord.replace(/[^a-z0-9]/gi, "").toLowerCase(); // Remove non-alphanumeric characters
    const vowelsSet = new Set('aeiou'); // Set of vowels

    // Listen for click events on the body
    body.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON") { // Ensure the clicked element is a button
            const clickedWord = event.target.textContent.toLowerCase(); // Get button text
            const clickedWordStripped = clickedWord.replace(/[^a-z0-9]/gi, ""); // Remove non-alphanumeric characters
            const clickedWordSet = new Set(clickedWordStripped); // Convert clicked word into a set of letters
            let matchingDetails = []; // Array to store matching details

            // Compare vowel count between the clicked word and the selected word
            const clickedVowelCount = [...clickedWordStripped].filter(letter => vowelsSet.has(letter)).length;
            if (clickedVowelCount === wordDetails.vowelCount) {
                matchingDetails.push("matching vowels");
            }

            // Compare consonant count between the clicked word and the selected word
            const clickedConsonantCount = [...clickedWordStripped].filter(letter => !vowelsSet.has(letter) && /[a-z]/.test(letter)).length;
            if (clickedConsonantCount === wordDetails.consonantCount) {
                matchingDetails.push("matching consonants");
            }

            // Check for matching letters using sets
            [...randomWordStripped].forEach(letter => {
                if (clickedWordSet.has(letter)) {
                    matchingDetails.push(`matching ${letter}`);
                }
            });

            // Log matches or indicate no match found
            if (matchingDetails.length > 0) {
                console.log("Matches found:", matchingDetails.join(", "));
            } else {
                console.log("No matches found for:", clickedWord);
            }

            // Check if the clicked word is the correct random word (ignoring non-alphanumeric characters)
            if (clickedWordStripped === randomWordStripped) {
                console.log("Correct word selected!");
            }
        }
    });
}
