async function apply_better_rightside() {
    await new Promise(r => setTimeout(r, 1000));
    let toolbox = document.getElementById("navigator-toolbox");
    let target = document.getElementById("nav-bar-customization-target");
    const callback = () => {
        if (!toolbox.hasAttribute("zen-right-side") || !toolbox.hasAttribute("zen-expanded"))
        {
            target.setAttribute("style", `margin-right: 0px;`);
            return;
        }
        console.log(toolbox.getAttribute("width"));

        target.setAttribute("style", `margin-right: ${Math.max(toolbox.getAttribute("width")-171, 3.5)}px;`);
    };

    const observer = new MutationObserver(callback);

    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(toolbox, config);

    callback();
}
apply_better_rightside();