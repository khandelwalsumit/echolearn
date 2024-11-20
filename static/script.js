const editor = document.getElementById('editor');
const charToggle = document.getElementById('charToggle');
const wordToggle = document.getElementById('wordToggle');
const sentenceToggle = document.getElementById('sentenceToggle');
const speedInput = document.getElementById('speed');
const speedValueLabel = document.getElementById('speedValue');
const delayInput = document.getElementById('delay');


let speechSpeed = parseFloat(speedInput.value);
let speechDelay = parseInt(delayInput.value);

// Update speech settings
speedInput.addEventListener('input', () => {
    speechSpeed = parseFloat(speedInput.value);
    speedValueLabel.textContent = speechSpeed.toFixed(1); // Display value with 1 decimal place
});

delayInput.addEventListener('input', () => {
    speechDelay = parseInt(delayInput.value);
});

// Speech synthesis
function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechSpeed;
    setTimeout(() => synth.speak(utterance), speechDelay);
}

editor.addEventListener('input', (e) => {
    const value = editor.value;
    const lastChar = value.slice(-1);

    // Cancel all speech if Backspace is pressed
    if (e.inputType === 'deleteContentBackward') {
        window.speechSynthesis.cancel();
        return;
    }

    // Character feedback
    if (charToggle.checked && lastChar.match(/[\w\s]/)) {
        speak(lastChar);
    }

    // Word feedback (space key)
    if (wordToggle.checked && lastChar === ' ') {
        const words = value.trim().split(' ');
        const lastWord = words[words.length - 1];
        speak(lastWord);
    }

    // Sentence feedback (full stop or comma)
    if (sentenceToggle.checked && (lastChar === '.' || lastChar === ',')) {
        const sentences = value.split(/[.,]/);
        const lastSentence = sentences[sentences.length - 2]; // Last complete sentence
        speak(lastSentence);
    }
});
