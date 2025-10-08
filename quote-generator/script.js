// DOM Elements
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('author');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const shareTwitterBtn = document.getElementById('shareTwitterBtn');
const copyBtn = document.getElementById('copyBtn');
const notification = document.getElementById('notification');

// Keep track of the last quote to avoid repetition
let lastQuoteIndex = -1;

/**
 * Get a random quote that's different from the last one
 */
function getRandomQuote() {
    let randomIndex;
    
    // Ensure we don't get the same quote twice in a row
    do {
        randomIndex = Math.floor(Math.random() * quotes.length);
    } while (randomIndex === lastQuoteIndex && quotes.length > 1);
    
    lastQuoteIndex = randomIndex;
    return quotes[randomIndex];
}

/**
 * Display a new quote with animation
 */
function displayNewQuote() {
    const quote = getRandomQuote();
    
    // Add fade out animation
    quoteText.style.animation = 'none';
    quoteAuthor.style.animation = 'none';
    
    // Trigger reflow
    void quoteText.offsetWidth;
    
    // Update content
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = `- ${quote.author}`;
    
    // Add fade in animation
    quoteText.style.animation = 'fadeIn 0.8s ease-out';
    quoteAuthor.style.animation = 'fadeIn 0.8s ease-out 0.2s both';
}

/**
 * Share quote on Twitter
 */
function shareOnTwitter() {
    const quote = quoteText.textContent;
    const author = quoteAuthor.textContent;
    const tweetText = `"${quote}" ${author}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    
    window.open(twitterUrl, '_blank', 'width=550,height=420');
}

/**
 * Copy quote to clipboard
 */
async function copyToClipboard() {
    const quote = quoteText.textContent;
    const author = quoteAuthor.textContent;
    const fullQuote = `"${quote}" ${author}`;
    
    try {
        await navigator.clipboard.writeText(fullQuote);
        showNotification();
    } catch (err) {
        // Fallback for older browsers
        fallbackCopyToClipboard(fullQuote);
    }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification();
    } catch (err) {
        console.error('Failed to copy:', err);
    }
    
    document.body.removeChild(textArea);
}

/**
 * Show notification when quote is copied
 */
function showNotification() {
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

/**
 * Initialize the app
 */
function init() {
    // Display first quote on load
    displayNewQuote();
    
    // Event listeners
    newQuoteBtn.addEventListener('click', displayNewQuote);
    shareTwitterBtn.addEventListener('click', shareOnTwitter);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Keyboard shortcut - Press Space for new quote
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            displayNewQuote();
        }
    });
}

// Start the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}