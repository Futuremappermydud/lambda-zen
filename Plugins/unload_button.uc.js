async function apply_unload_button() {
    function add_unload_button(tab) {
        let content = tab.getElementsByClassName("tab-content")[0];

        let unloadButton = document.createElement("button");
        unloadButton.innerHTML = "—";
        unloadButton.setAttribute("class", "tab-unload-button");
        content.appendChild(unloadButton);

        //unload tab
        unloadButton.addEventListener("mousedown", function(event) {
            let shouldSwitch = tab === window.gBrowser.selectedTab;
            console.log(tab);
            console.log(window.gBrowser.selectedTab);
            console.log(shouldSwitch);
            if (shouldSwitch)
            {
                console.log("Unloading active tab");
                let selectedIndex = gBrowser.tabs.indexOf(gBrowser.selectedTab);
                let beforeOrAfter = selectedIndex === gBrowser.tabs.length - 1 ? -1 : 1;
                window.gBrowser.selectTabAtIndex(selectedIndex+beforeOrAfter, null);
            }
            window.gBrowser.discardBrowser(tab);
            event.bubbles = false;
            event.stopPropagation();
        });
    }

    function remove_unload_button(tab) {
        let content = tab.getElementsByClassName("tab-content")[0];
        let unloadButton = content.getElementsByClassName("tab-unload-button")[0];
        unloadButton.remove();
    }
    
    let styles = `
	tab:not([pending="true"])
    {
        &[pinned] {
            .tab-close-button {
                display: none !important;
            }
        }
    }  
    tab[pending="true"]
    {
        &[pinned] {
            .tab-unload-button {
                display: none !important;
            }
        }
    }

    tab:hover
    {
        .tab-unload-button {
            display: block !important;
        } 
    }

    .tab-unload-button {
        border: none;
        transition-duration: 0s !important;
        width: 24px;
        height: 24px;
        background-color: transparent;
        border-radius: var(--tab-border-radius);
        display: none;
    }

    .tab-unload-button:hover {
        background-color: color-mix(in srgb, currentColor 10%, transparent);
    }
    `       

    let styleSheet = document.createElement("style")
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)

    const targetNode = document.getElementById("tabbrowser-tabs"); // or any container element

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {

            if (mutation.type === 'attributes' && mutation.attributeName === 'zen-pin-id') {
                const attributeName = mutation.attributeName;
                const oldValue = mutation.oldValue;

                if (mutation.target.hasAttribute(attributeName)) {
                    console.log(`Added tab with zen-pin-id '${mutation.target.getAttribute('zen-pin-id')}'`);
                    add_unload_button(mutation.target);
                } else {
                    console.log(`Removed tab with zen-pin-id '${oldValue}'`);
                    remove_unload_button(mutation.target);
                }
            }
        }   
    });

    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(targetNode, config);

    await new Promise(r => setTimeout(r, 500));
    let pinnedTabs = document.getElementById("vertical-pinned-tabs-container");
    //add button to all pinned tabs
    for (let tab of pinnedTabs.children) {
        add_unload_button(tab);
    }
}

apply_unload_button();