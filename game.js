
// Turn all words in body text into buttons
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const textNodes = [];

    function extractTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
            textNodes.push(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(extractTextNodes);
        }
    }

    extractTextNodes(body);

    textNodes.forEach(node => {
        const bodyWords = node.nodeValue.split(/\s+/);
        const fragment = document.createDocumentFragment();

        bodyWords.forEach((word, index) => {
            const button = document.createElement("button");
            button.textContent = word;
            fragment.appendChild(button);

            if (index < bodyWords.length - 1) {
                fragment.appendChild(document.createTextNode(" "));
            }
        });

        node.parentNode.replaceChild(fragment, node);
    });
});


// Function to select a random >3 letter word
window.onload = function () {
    // Get all the text content from the body
    const bodyText = document.body.innerText;

    // Split the text into an array of words
    const words = bodyText.split(/\s+/);

    // Filter out any non-alphabetic words and words that are less than 4 letters long
    const filteredWords = words.filter(word => /^[A-Za-z]+$/.test(word) && word.length >= 4);

    // Check if there are any valid words with 4 or more letters
    if (filteredWords.length > 0) {
        // Select a random word from the filtered array
        const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];

        // Log the random word to the console
        console.log('Random word (alphabetic and at least 4 letters):', randomWord);

        // Calculate letter, vowel, and consonant counts for the selected word
        const wordDetails = calculateWordDetails(randomWord);

        // Add click event listener to buttons
        addButtonClickListener(wordDetails, document.body, randomWord);

        // Create buttons for each word in the body text
        const body = document.body;
        const textNodes = [];

        function extractTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
                textNodes.push(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                node.childNodes.forEach(extractTextNodes);
            }
        }

        extractTextNodes(body);

        textNodes.forEach(node => {
            const bodyWords = node.nodeValue.split(/\s+/);
            const fragment = document.createDocumentFragment();

            bodyWords.forEach((word, index) => {
                const button = document.createElement("button");
                button.textContent = word;
                fragment.appendChild(button);

                if (index < bodyWords.length - 1) {
                    fragment.appendChild(document.createTextNode(" "));
                }
            });

            node.parentNode.replaceChild(fragment, node);
        });
    } else {
        console.log('No valid word found with at least 4 alphabetic letters.');
    }
};


// Function to calculate the letter, vowel, and consonant counts for a word
function calculateWordDetails(word) {
    // Convert the word to lowercase for case-insensitive comparison
    const lowerCaseWord = word.toLowerCase();
    const letterCount = lowerCaseWord.length;  // Total number of letters in the word
    let vowelCount = 0;
    let consonantCount = 0;

    // Define vowels
    const vowels = 'aeiou';

    // Object to hold each letter as a variable
    let letters = {};

    // Iterate through each letter of the word
    for (let i = 0; i < lowerCaseWord.length; i++) {
        const letter = lowerCaseWord[i];

        // Store each letter in the object as a dynamic variable
        letters[`letter${i + 1}`] = letter;

        // Count vowels and consonants
        if (vowels.includes(letter)) {
            vowelCount++;  // Count vowels
        } else if (/[a-zA-Z]/.test(letter)) {
            consonantCount++;  // Count consonants (letters only)
        }
    }

    // Log the results
    console.log('Word:', word);
    console.log('Letter count:', letterCount);
    console.log('Vowel count:', vowelCount);
    console.log('Consonant count:', consonantCount);
    console.log('Individual Letters:', letters);

    return { letterCount, vowelCount, consonantCount, letters };
}

// Function to listen for button clicks and compare with the selected word
function addButtonClickListener(wordDetails, body, randomWord) {
    const randomWordLower = randomWord.toLowerCase();  // Convert random word to lowercase for case-insensitive comparison
    body.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON") {
            const clickedWord = event.target.textContent.toLowerCase();  // Convert clicked word to lowercase
            let matchingDetails = [];
            let matchedLetters = new Set();  // Track matched letters to avoid duplicate logging

            // Compare vowels count
            const clickedVowels = clickedWord.split('').filter(letter => 'aeiou'.includes(letter)).length;
            if (clickedVowels === wordDetails.vowelCount) {
                matchingDetails.push("matching vowels");
            }

            // Compare consonants count
            const clickedConsonants = clickedWord.split('').filter(letter => /[a-zA-Z]/.test(letter) && !'aeiou'.includes(letter)).length;
            if (clickedConsonants === wordDetails.consonantCount) {
                matchingDetails.push("matching consonants");
            }

            // Compare individual letters (without duplicating matches)
            Object.keys(wordDetails.letters).forEach(key => {
                const letter = wordDetails.letters[key];

                // If the letter is found in the clicked word and has not been matched yet, log it
                if (clickedWord.includes(letter) && !matchedLetters.has(letter)) {
                    matchingDetails.push(`matching ${letter}`);
                    matchedLetters.add(letter);  // Mark this letter as matched
                }
            });

            // Log matching details 
            if (matchingDetails.length > 0) {
                console.log("Matches found:", matchingDetails.join(", "));
            } else {
                console.log("No matches found for:", clickedWord);
            }

            // Only log "Correct word selected!" if the clicked word is the random word
            if (clickedWord === randomWordLower) {
                console.log("Correct word selected!");
            }
        }
    });
}