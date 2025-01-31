
// Wait for the entire HTML document to be fully loaded before executing
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body; // Reference to the body element
    const textNodes = []; // Array to store text nodes
    let allText = ""; // Store all text content for later word selection

    // Function to recursively extract text nodes from the document
    function extractTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
            textNodes.push(node); // Store the text node
            allText += " " + node.nodeValue; // Accumulate text content
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Recursively process child nodes
            node.childNodes.forEach(extractTextNodes);
        }
    }

    extractTextNodes(body); // Start extraction from the body

    // Replace each text node with buttons for each word
    textNodes.forEach(node => {
        const words = node.nodeValue.split(/\s+/); // Split text into words
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
    const words = text.toLowerCase().split(/\s+/).filter(word => /^[a-z]+$/.test(word) && word.length >= 4);

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
    const lowerCaseWord = word.toLowerCase(); // Convert word to lowercase for consistency
    const vowelsSet = new Set('aeiou'); // Define a set of vowels for quick lookup
    let vowelCount = 0; // Counter for vowels
    let consonantCount = 0; // Counter for consonants
    let letters = {}; // Object to store individual letters

    // Loop through each letter of the word
    for (let i = 0; i < lowerCaseWord.length; i++) {
        const letter = lowerCaseWord[i];
        letters[`letter${i + 1}`] = letter; // Store letter in object

        // Check if the letter is a vowel or consonant
        if (vowelsSet.has(letter)) {
            vowelCount++;
        } else {
            consonantCount++;
        }
    }

    // Log word details for debugging
    console.log('Word:', word);
    console.log('Letter count:', lowerCaseWord.length);
    console.log('Vowel count:', vowelCount);
    console.log('Consonant count:', consonantCount);
    console.log('Individual Letters:', letters);

    // Return word details as an object
    return { letterCount: lowerCaseWord.length, vowelCount, consonantCount, letters };
}

// Function to add event listeners for button clicks
function addButtonClickListener(wordDetails, body, randomWord) {
    const randomWordSet = new Set(randomWord.toLowerCase()); // Convert random word to a set of letters
    const vowelsSet = new Set('aeiou'); // Set of vowels

    // Listen for click events on the body
    body.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON") { // Ensure the clicked element is a button
            const clickedWord = event.target.textContent.toLowerCase(); // Get button text
            const clickedWordSet = new Set(clickedWord); // Convert clicked word into a set of letters
            let matchingDetails = []; // Array to store matching details

            // Compare vowel count between the clicked word and the selected word
            const clickedVowelCount = [...clickedWord].filter(letter => vowelsSet.has(letter)).length;
            if (clickedVowelCount === wordDetails.vowelCount) {
                matchingDetails.push("matching vowels");
            }

            // Compare consonant count between the clicked word and the selected word
            const clickedConsonantCount = [...clickedWord].filter(letter => !vowelsSet.has(letter) && /[a-z]/.test(letter)).length;
            if (clickedConsonantCount === wordDetails.consonantCount) {
                matchingDetails.push("matching consonants");
            }

            // Check for matching letters using sets
            [...randomWordSet].forEach(letter => {
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

            // Check if the clicked word is the correct random word
            if (clickedWord === randomWord) {
                console.log("Correct word selected!");
            }
        }
    });
}
