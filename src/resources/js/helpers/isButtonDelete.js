function isButtonDelete(buttonEl) {
    if ('buttonDelete' in buttonEl.dataset) {
        return true;
    }
    return false;
}

export default isButtonDelete