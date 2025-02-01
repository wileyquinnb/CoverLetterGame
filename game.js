
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

// Function to add event listeners for button clicks
function addButtonClickListener(wordDetails, body, randomWord) {
    const randomWordStripped = randomWord.replace(/[^a-z0-9]/gi, "").toLowerCase(); // Remove non-alphanumeric characters
    const vowelsSet = new Set('aeiou'); // Set of vowels

    // Get buttons by ID
    const b1 = document.getElementById("b1"); // Vowel count button
    const b2 = document.getElementById("b2"); // Consonant count button
    const b3 = document.getElementById("b3"); // Letter count button
    const b4 = document.getElementById("b4"); // Matching letters button

    let updatedButtons = new Set(); // Track which buttons have been updated
    let revealedLetters = new Set(); // Store already revealed letters for b4
    let firstTimeB4 = true; // Track if b4 is being updated for the first time

    // Listen for click events on the body
    body.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON") { // Ensure the clicked element is a button
            const clickedWord = event.target.textContent.toLowerCase(); // Get button text
            const clickedWordStripped = clickedWord.replace(/[^a-z0-9]/gi, ""); // Remove non-alphanumeric characters
            const clickedWordSet = new Set(clickedWordStripped); // Convert clicked word into a set of letters

            // Compare vowel count
            const clickedVowelCount = [...clickedWordStripped].filter(letter => vowelsSet.has(letter)).length;
            if (clickedVowelCount === wordDetails.vowelCount && !updatedButtons.has("b1")) {
                if (b1) b1.textContent = `VOWEL COUNT: ${wordDetails.vowelCount}`;
                updatedButtons.add("b1");
            }

            // Compare consonant count
            const clickedConsonantCount = [...clickedWordStripped].filter(letter => !vowelsSet.has(letter) && /[a-z]/.test(letter)).length;
            if (clickedConsonantCount === wordDetails.consonantCount && !updatedButtons.has("b2")) {
                if (b2) b2.textContent = `CONSONANT COUNT: ${wordDetails.consonantCount}`;
                updatedButtons.add("b2");
            }

            // Ensure b3 updates only if b1 or b2 has been updated
            if ((updatedButtons.has("b1") || updatedButtons.has("b2")) && clickedWordStripped.length === wordDetails.letterCount && !updatedButtons.has("b3")) {
                if (b3) {
                    b3.textContent = `LETTER COUNT: ${wordDetails.letterCount}`;
                    // b3.classList.remove("inactive-button");
                    // b3.classList.add("button3"); // Add the class after update
                }
                updatedButtons.add("b3");
            }

            // Add the CSS class to b3 after 1 button updates
            if (updatedButtons.size >= 1) {
                b3.classList.remove("inactive-button");
                b3.classList.add("button3");
            }

            // Ensure b4 updates only if at least two of b1, b2, or b3 have been updated
            if (updatedButtons.size >= 2) {
                let matchingLetters = [...randomWordStripped].filter(letter => clickedWordSet.has(letter));
                matchingLetters = matchingLetters.filter(letter => !revealedLetters.has(letter)); // Filter out duplicates
                matchingLetters.forEach(letter => revealedLetters.add(letter)); // Add new matches to the set

                if (matchingLetters.length > 0) {
                    if (b4) {
                        if (firstTimeB4) {
                            b4.textContent = matchingLetters.map(letter => letter.toUpperCase()).join(", ");
                            firstTimeB4 = false;
                        } else {
                            b4.textContent += `, ${matchingLetters.map(letter => letter.toUpperCase()).join(", ")}`;
                        }
                    }
                }

                // Add the CSS class to b4 after at least two buttons are updated
                if (updatedButtons.size >= 2 && b4) {
                    b4.classList.remove("inactive-button");
                    b4.classList.add("button4");
                }
            }
        }
    });
}
