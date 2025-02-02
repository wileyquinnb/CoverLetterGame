
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

    // Get buttons by ID
    const b1 = document.getElementById("b1"); // Vowel count button
    const b2 = document.getElementById("b2"); // Consonant count button
    const b3 = document.getElementById("b3"); // Letter count button
    const b4 = document.getElementById("b4"); // Matching letters button

    let updatedButtons = new Set(); // Track which buttons have been updated
    let revealedLetters = new Set(); // Store already revealed letters for b4
    let firstTimeB4 = true; // Track if b4 is being updated for the first time

    // Select a random letter from randomWordStripped
    const randomLetter = randomWordStripped[Math.floor(Math.random() * randomWordStripped.length)].toUpperCase();

    // Display hint
    const logDiv = document.getElementById("log"); // Log div for messages
    logDiv.innerHTML += `Hint: ${randomLetter}`;

    // Listen for click events on the body
    body.addEventListener("click", function (event) {
        const letterDiv = document.getElementById("letter");
        if (event.target.tagName === "BUTTON" && letterDiv.contains(event.target)) { // Ensure the clicked element is a button within #letter
            const clickedWord = event.target.textContent.toLowerCase(); // Get button text
            const clickedWordStripped = clickedWord.replace(/[^a-z0-9]/gi, ""); // Remove non-alphanumeric characters
            const clickedWordSet = new Set(clickedWordStripped); // Convert clicked word into a set of letters
            const logDiv = document.getElementById("log"); // Log div for messages

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
                }
                updatedButtons.add("b3");
            }

            // Add the CSS class to b3 after 1 button updates
            if (updatedButtons.size >= 1) {
                b3.classList.remove("inactive-button");
                b3.classList.add("button3");
                if (!logDiv.innerHTML.includes("Letter Count Unlocked!")) {
                    logDiv.innerHTML += "<br>Letter Count Unlocked!";
                }
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
                    if (!logDiv.innerHTML.includes("Matching Letters Unlocked!")) {
                        logDiv.innerHTML += "<br>Matching Letters Unlocked!";
                    }
                }
            }
            // Check if the clicked word matches the random word
            if (clickedWordStripped === randomWordStripped) {
                logDiv.innerHTML += "<br>Word Found! You Win!";
                return;
            }
        }
    });
}





// Click counter
document.addEventListener("DOMContentLoaded", function () {
    let count = 0;
    const button = document.getElementById("bc");
    const letterDiv = document.getElementById("letter");

    letterDiv.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON") {
            count++;
            button.textContent = `CLICKS: ${count}`;
        }
    });
});


// Change clicked word color
document.addEventListener("DOMContentLoaded", function () {
    const letterDiv = document.getElementById("letter");
    if (letterDiv) {
        const buttons = letterDiv.getElementsByTagName("button");
        for (let button of buttons) {
            button.addEventListener("click", function () {
                button.style.color = "rgb(153, 202, 146)";
            });
        }
    }
});