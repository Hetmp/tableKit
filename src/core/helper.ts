function createLoadingDots(): HTMLElement {
    const div = document.createElement("div");
    div.classList.add("tablekit-loading");
    div.innerHTML = "<span></span><span></span><span></span>";
    return div;
}
export { createLoadingDots };