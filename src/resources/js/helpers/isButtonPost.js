function isButtonPost(buttonEl) {
    if ('buttonPost' in buttonEl.dataset) {
        return true;
    }
    return false;
}

export default isButtonPost