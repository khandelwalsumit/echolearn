// Connect to the Socket.IO server
var socket = io.connect('http://' + document.domain + ':' + location.port);

// Get the textarea element
var textarea = document.getElementById('editor');

// Speech settings
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const delayInput = document.getElementById('delay');
let speechSpeed = speedSlider.value;
let speechDelay = delayInput.value;

// Update speech speed and delay value
speedSlider.addEventListener('input', function() {
    speechSpeed = speedSlider.value;
    speedValue.innerText = speechSpeed;
});

delayInput.addEventListener('input', function() {
    speechDelay = delayInput.value;
});

// Emit text change when typing
textarea.addEventListener('input', function() {
    socket.emit('text_change', { text: textarea.value });
    handleLocalArticulation(); // Handle speech locally
});

// Listen for text updates from others
socket.on('update_text', function(data) {
    textarea.value = data.text;
});

// Emit speech data to the server for broadcasting
function emitSpeakEvent(text) {
    socket.emit('speak_text', { text, speed: speechSpeed });
}

// Listen for speech events from the server
socket.on('broadcast_speak', function(data) {
    speakText(data.text, data.speed);
});

// Handle local articulation
textarea.addEventListener('keydown', function(event) {
    const text = textarea.value;

    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent a new line
        if (document.getElementById('sentenceToggle').checked) {
            setTimeout(() => {
                emitSpeakEvent(text);
            }, speechDelay);
        }
    }
});

textarea.addEventListener('input', function() {
    const text = textarea.value;
    const lastChar = text.slice(-1);

    if (document.getElementById('charToggle').checked) {
        emitSpeakEvent(lastChar); // Broadcast character articulation
    }

    if (document.getElementById('wordToggle').checked && lastChar === ' ') {
        const words = text.trim().split(' ');
        const lastWord = words[words.length - 1];
        emitSpeakEvent(lastWord); // Broadcast word articulation
    }

    if (document.getElementById('sentenceToggle').checked && /[.!?]$/.test(text)) {
        emitSpeakEvent(text.trim()); // Broadcast sentence articulation
    }
});

// Speech function
function speakText(text, speed) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.volume = 1;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}
