// disableCopy.js
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    showMessage('You can\'t right-click is disabled on this page.');
});

document.addEventListener('selectstart', function(event) {
    event.preventDefault();
    showMessage('Text selection is disabled on this page.');
});

document.addEventListener('dragstart', function(event) {
    event.preventDefault();
    showMessage('Image dragging is disabled on this page.');
});

function showMessage(message) {
    const msgElement = document.createElement('div');
    msgElement.className = 'custom-message';
    msgElement.textContent = message;
    document.body.appendChild(msgElement);
    setTimeout(function() {
        document.body.removeChild(msgElement);
    }, 2000);
}
