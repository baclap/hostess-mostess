// modal utils
const mdl = {
    show(modalElement) {
        modalElement.classList.remove('hidden');
    },
    hide(modalElement) {
        modalElement.classList.add('hidden');
    },
    addMessage(modalElement, message) {
        modalElement.querySelector('.modal-message').innerHTML = message;
    },
    hideCurrentlyVisible() {
        this.hide(document.querySelector('.modal:not(.hidden)'));
    }
};

export default mdl;
