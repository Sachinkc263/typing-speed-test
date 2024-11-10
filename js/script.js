const typingText = document.getElementById("quote"),
inpField = document.getElementsByClassName("input-field")[0],
wpmDisplay = document.getElementById("wpm_text"),
accuracyDisplay = document.getElementById("accuracy_text"),
timeDisplay = document.getElementById("time_text"),
restartButton = document.getElementById("restart");

let timer,
maxTime = 60,
timeLeft = maxTime,
charIndex =0,
mistakes =0,
isTyping = false;


function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = paragraphs[ranIndex]
        .split("")
        .map(char => `<span>${char}</span>`)
        .join("");
    
    // Set the first character as active
    typingText.querySelectorAll("span")[0].classList.add("active");

    // Focus input field on start
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

loadParagraph();

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeDisplay.innerText = `Time:${timeLeft}s`;

        const wpm = calculateWPM();
        wpmDisplay.innerText = `WPM:${wpm}`;
    } else {
        clearInterval(timer);
        endTest();
    }
}
// Calculate WPM and accuracy
function calculateWPM() {
    return Math.max(0,((charIndex / 5 - mistakes)) / ((maxTime - timeLeft) / 60)).toFixed(0);
}
function calculateAccuracy() {
    return Math.round(((charIndex - mistakes) / charIndex) * 100) || 0;
}
function initTyping() {
    const characters = typingText.querySelectorAll("span");
    const typedChar = inpField.value.split("")[charIndex];

    // Check if the active character is a space
    const isActiveCharSpace = characters[charIndex].innerText === " ";
    
    // Disable typing space if the active character is not a space
    if (typedChar === " " && !isActiveCharSpace) {
        // Remove the extra space from input field
        inpField.value = inpField.value.slice(0, -1);
        return;
    }

    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if (typedChar == null) {  // Handle backspace
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {  // Handle other charactersA broadband
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }

        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");
        

        const wpm = calculateWPM();
        const accuracy = calculateAccuracy();

        wpmDisplay.innerText = `WPM:${wpm}`;
        accuracyDisplay.innerText = `Accuracy:${accuracy}%`;
    } else {
        clearInterval(timer);
        endTest();
    }
}
function endTest() {
    inpField.value = "";
    isTyping = false;
}
function resetGame() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = 0;
    isTyping = false;
    inpField.value = "";
    wpmDisplay.innerText = "WPM:0";
    accuracyDisplay.innerText = "Accuracy:0%";
    timeDisplay.innerText = `Time:${maxTime}s`;
}

inpField.addEventListener("input", initTyping);
restartButton.addEventListener("click", resetGame);

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        answer.classList.toggle('open');

        // Toggle max-height for smooth opening and closing
        if (answer.classList.contains('open')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = '0';
        }
    });
});
