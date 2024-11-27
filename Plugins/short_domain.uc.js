function apply_short_domain() {
    let urlinput = document.getElementById('urlbar-input'); 
    let tabpanels = document.getElementById('tabbrowser-tabpanels');

    function getURL(domain) {
        return new URL(domain.startsWith('http') ? domain : `http://${domain}`);
    }

    function extractDomain(domain) {
        try {
            if (domain.startsWith('about:')) {
                return domain;
            }
            // Ensure we have a proper URL format
            let url = getURL(domain);
            let host = url.hostname;

            // Split hostname into parts
            let parts = host.split('.');
            
            // Handle cases with fewer than 3 parts or "www"
            if (parts.length < 3 || parts[0] === 'www') {
                return parts.slice(-2).join('.'); // Return base domain
            }
            
            // Include subdomain
            return host;
        } catch (error) {
            console.error('Invalid domain format:', error.message);
            return null;
        }
    }

    let domainContainer = document.createElement('div');
    domainContainer.setAttribute('id', 'short-domain-container');

    let copyURL = document.createElement('button');
    copyURL.setAttribute('id', 'copyURL');
    domainContainer.appendChild(copyURL);

    copyURL.addEventListener('click', () => {
        if (!urlinput.value) return;
        navigator.clipboard.writeText(getURL(urlinput.value));
    });

    let img = document.createElement('div');
    img.setAttribute('id', 'copyURL-img');
    copyURL.appendChild(img);

    let shortDomain = document.createElement('p');
    shortDomain.innerHTML = urlinput.value;
    shortDomain.setAttribute('id', 'short-domain');
    domainContainer.appendChild(shortDomain);

    document.getElementsByClassName("urlbar-input-box")[0].appendChild(domainContainer);

    var styles = `
    #urlbar[breakout-extend="true"] > .urlbar-input-container > .urlbar-input-box > #short-domain-container {
        opacity: 0 !important;
        display: none;
    }

    #short-domain-container {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        flex-direction: row !important;
        justify-content: center !important;
        display: flex;
        margin: 0px;
        height: 26.3333px;
        opacity: 1 !important;
        pointer-events: none;
        gap: 10px;
    }

    #short-domain {
        flex-direction: column !important;
        justify-content: center !important;
        display: flex;
        pointer-events: none;
        height: 100%;
        margin: 0;
        margin-right: 35px;
        
        :root[lwt-toolbar-field="dark"] & {
            color: rgb(255,255,255) !important;
        }
    }

    #copyURL {
        flex-direction: column !important;
        justify-content: center !important;
        display: flex;
        cursor: pointer;
        border: none;
        background: none;
        margin: auto;
        pointer-events: all;
        padding: 0px;
    }

    #copyURL[hidden] {
        display: none !important;
    }

    #copyURL:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
    }

    #copyURL-img {
        min-width: 13px;
        min-height: 13px;
        background-size: contain;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 6px;
    }

    #urlbar-input {
        opacity: 0 !important;
    }

    #urlbar[breakout-extend="true"] > .urlbar-input-container > .urlbar-input-box > #urlbar-input {
        opacity: 1 !important;
    }

    #copyURL-img {
        :root[lwt-toolbar-field="dark"] & {
            filter: invert(100%);   
        }
    }
    `   

    var styleSheet = document.createElement("style")
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)

    let last = "";
    const callback = () => {
        if (!urlinput.value) {
            shortDomain.innerHTML = "";
            copyURL.setAttribute('hidden', '');
            return;
        }
        copyURL.removeAttribute('hidden');
        if (last === urlinput.value) return;
        last = urlinput.value;
        let value = extractDomain(urlinput.value);
        if (value) {
            shortDomain.innerHTML = value;
        }
    };

    const observer = new MutationObserver(callback);

    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(tabpanels, config);

    callback();
}

apply_short_domain();