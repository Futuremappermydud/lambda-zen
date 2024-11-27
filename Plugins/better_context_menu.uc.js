function apply_better_context_menu() {
    let styles = `
    #essential-button-container {
        margin: 5px;
        height: 50px;
        width: auto;
        display: flex;
        flex-wrap: wrap;
        gap: 7.5px;
    }

    .essential-button {
        width: auto;
        height: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        background-color: rgba(255,255,255,0.1);
    }

    .essential-button:hover {
        background-color: rgba(255,255,255,0.3);
    }

    .essential-button-img {
        filter: invert(100%);
        height: 50%;
    }
    `   

    let styleSheet = document.createElement("style")
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)

    let contextMenu = document.getElementById("tabContextMenu");

    let separator = document.getElementsByTagName("menuseparator")[0];

    function addBeginning(node) {
        contextMenu.insertBefore(node, contextMenu.firstChild);
    }

    addBeginning(separator.cloneNode());

    let essentialContainer = document.createElement("div");
    essentialContainer.setAttribute("id", "essential-button-container");


    function createEssentialButton(id, icon) {
        let button = document.createElement("button");
        button.setAttribute("id", `essential-${id}`);
        button.setAttribute("class", `essential-button`);

        let image = document.createElement("img");
        image.setAttribute("src", `chrome://browser/skin/zen-icons/${icon}`);
        image.setAttribute("id", `essential-${id}-img`);
        image.setAttribute("class", `essential-button-img`);

        button.appendChild(image);

        essentialContainer.appendChild(button);

        return button;
    }

    createEssentialButton("reload", "reload.svg").addEventListener("click", () => {
        let node = document.getElementById("tabContextMenu").triggerNode;
        // Get <tab /> from ancestors
        while (node && node.tagName != "tab") {
            node = node.parentNode;
        }

        if (node) {
            node.linkedBrowser.reload();
        }
    });
    createEssentialButton("pin", "pin.svg");
    createEssentialButton("add-essential", "essential-add.svg");
    createEssentialButton("bookmark", "bookmark-hollow.svg");


    addBeginning(essentialContainer);
}
apply_better_context_menu();