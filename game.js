
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



// Function to match words and button updates
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

    // Determine letter count label for b3
    const letterCountLabel = randomWordStripped.length > 6 ? ">6" : "<7";

    // Select a random vowel from randomWordStripped
    const vowelsInWord = [...randomWordStripped].filter(letter => vowelsSet.has(letter));
    const randomVowel = vowelsInWord.length > 0 ? vowelsInWord[Math.floor(Math.random() * vowelsInWord.length)].toUpperCase() : "No vowels"; // Choose random vowel or display fallback

    // Display hint
    const logDiv = document.getElementById("log"); // Log div for messages
    logDiv.innerHTML += `Hint: ${randomVowel}`;

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

            // Add the CSS class and update text in b3 after 1 button is updated
            if (updatedButtons.size >= 1 && !updatedButtons.has("b3")) {
                if (b3) {
                    b3.textContent = `LETTER COUNT: ${letterCountLabel}`;
                    b3.classList.remove("inactive-button");
                    b3.classList.add("button3");
                }
                updatedButtons.add("b3");

                if (!logDiv.innerHTML.includes("Letter Count Unlocked!")) {
                    logDiv.innerHTML += "<br>Letter Count Unlocked!";
                }
            }

            // Ensure b4 updates only if b1 and b2 have both been updated
            if (updatedButtons.has("b1") && updatedButtons.has("b2")) {
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

                // Add the CSS class to b4 after b1 and b2 are updated
                if (b4) {
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


// Function that creates tooltip for letter count
document.addEventListener("DOMContentLoaded", function () {
    const letterDiv = document.getElementById("letter");

    if (!letterDiv) return;

    letterDiv.addEventListener("mouseover", function (event) {
        if (event.target.tagName === "BUTTON") {
            const button = event.target;
            const alphanumericCount = (button.textContent.match(/[a-zA-Z0-9]/g) || []).length;

            let tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.textContent = alphanumericCount;
            document.body.appendChild(tooltip);

            tooltip.style.position = "absolute";
            tooltip.style.background = "rgb(44, 81, 44)";
            tooltip.style.color = "white";
            tooltip.style.padding = "5px 10px";
            // tooltip.style.borderRadius = "5px";
            tooltip.style.fontSize = "12px";
            tooltip.style.pointerEvents = "none";
            tooltip.style.zIndex = "1000";

            requestAnimationFrame(() => {
                const rect = button.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();

                tooltip.style.left = `${rect.left + window.scrollX + (rect.width - tooltipRect.width) / 2}px`;
                tooltip.style.top = `${rect.top + window.scrollY - tooltipRect.height + 0}px`;
            });

            button.addEventListener("mouseleave", function removeTooltip() {
                tooltip.remove();
                button.removeEventListener("mouseleave", removeTooltip);
            });
        }
    });
});



// Function to make layout mobile friendly beacuse I'm a dumbass and didn't design mobile-first so now I'm suffering the consequences and too stubborn to redo the project
function adjustLayout() {
    const maxAspectRatio = 0.9;
    const currentAspectRatio = window.innerWidth / window.innerHeight;
    const d2 = document.getElementById('d2');
    const d1 = document.getElementById('d1');
    const b2 = document.getElementById('b2');
    const b4 = document.getElementById('b4');

    let b2Container = document.getElementById('b2-container');
    let b4Container = document.getElementById('b4-container');

    if (currentAspectRatio < maxAspectRatio) {
        if (!b2Container) {
            b2Container = document.createElement('div');
            b2Container.id = 'b2-container';
            b2Container.className = 'button-card';
            b2.parentNode.removeChild(b2);
            b2Container.appendChild(b2);
        }

        if (!b4Container) {
            b4Container = document.createElement('div');
            b4Container.id = 'b4-container';
            b4Container.className = 'button-card';
            b4.parentNode.removeChild(b4);
            b4Container.appendChild(b4);
        }

        d2.parentNode.insertBefore(b2Container, d1.nextSibling);
        b2Container.parentNode.insertBefore(b4Container, b2Container.nextSibling);
    } else {
        if (b2Container) {
            b2Container.parentNode.removeChild(b2Container);
            d1.appendChild(b2);
        }

        if (b4Container) {
            b4Container.parentNode.removeChild(b4Container);
            d2.appendChild(b4);
        }
    }
}

window.addEventListener('resize', adjustLayout);
window.addEventListener('load', adjustLayout);

