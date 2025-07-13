import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { firebaseConfig, GEMINI_API_KEY, GEMINI_API_URL } from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Global variables
let currentUser = null;
let chatMessages = [];

// Initialize authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadChatHistory();
    } else {
        signInAnonymously(auth);
    }
});

// Load chat history from Firestore
async function loadChatHistory() {
    const q = query(
        collection(db, 'chat_messages'),
        orderBy('timestamp', 'asc')
    );
    
    onSnapshot(q, (snapshot) => {
        chatMessages = [];
        snapshot.forEach((doc) => {
            chatMessages.push({ id: doc.id, ...doc.data() });
        });
        displayChatHistory();
    });
}

// Display chat messages
function displayChatHistory() {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;

    chatContainer.innerHTML = '';
    
    chatMessages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message.text}</div>
                <div class="message-time">${formatTime(message.timestamp)}</div>
            </div>
        `;
        chatContainer.appendChild(messageDiv);
    });
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Format timestamp
function formatTime(timestamp) {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleTimeString();
}

// Save message to Firestore
async function saveMessage(text, sender) {
    try {
        await addDoc(collection(db, 'chat_messages'), {
            text: text,
            sender: sender,
            userId: currentUser.uid,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error saving message:', error);
    }
}

// Call Gemini API
async function callGeminiAPI(prompt) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid response from Gemini API');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}

// Send message
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    
    if (!input.value.trim()) return;
    
    const userMessage = input.value.trim();
    input.value = '';
    
    // Disable send button
    sendButton.disabled = true;
    sendButton.textContent = 'Sending...';
    
    // Save user message
    await saveMessage(userMessage, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get AI response
    const aiResponse = await callGeminiAPI(userMessage);
    
    // Hide typing indicator
    hideTypingIndicator();
    
    // Save AI response
    await saveMessage(aiResponse, 'ai');
    
    // Re-enable send button
    sendButton.disabled = false;
    sendButton.textContent = 'Send';
}

// Show typing indicator
function showTypingIndicator() {
    const chatContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message ai typing';
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Initialize chatbot when DOM is loaded
function initializeChatbot() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const toggleButton = document.getElementById('toggle-chat');
    const chatWidget = document.getElementById('chat-widget');
    
    // Send message on button click
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Send message on Enter key
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Toggle chat widget
    if (toggleButton && chatWidget) {
        toggleButton.addEventListener('click', function() {
            chatWidget.classList.toggle('open');
        });
    }
}

// Export functions for use in other files
export { initializeChatbot, sendMessage };
