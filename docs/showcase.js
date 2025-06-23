/* import { QuickCTX, MenuCommand } from '@nicobarbieri/quickctx'; */

const { QuickCTX, MenuCommand } = window.QuickCTX;

import {
    launchConfetti,
    showCat,
    jumpscarehehe,
    toggleInvert,
    heartExplosion,
    copyLink,
    postOnX,
    sendToMars,
    openCuteGallery,
    deleteItem,
    getInfo,
    downloadImage,
    toggleNyanCat,
} from "./utils/memes.js";

import { showToast, init3dBoxes, goToSection } from "./utils/utils.js";

const ctxManager = new QuickCTX({
    overlapStrategy: "deepest",
    classes: {
        container: "quickctx-container pointable hide-outline-on-hover",
        item: "quickctx-item transition-all",
    },
});

document.addEventListener("DOMContentLoaded", () => {
    // Init all scripts...
    function initShowcase() {
        initThemeSwitcher();
        initCustomCursor();
        init3dBoxes();
        initScrollspyNav();
        initAllMenus();
        initInteractiveControls();
        initGlobalEventListener();
    }

    // Manage dark/light theme switch
    function initThemeSwitcher() {
        const themeSwitcher = document.getElementById("theme-switcher");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        const savedTheme = localStorage.getItem("quickctx-theme");

        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add("dark-mode");
        }

        themeSwitcher.addEventListener("click", () => {
            document.documentElement.classList.toggle("dark-mode");
            const currentTheme = document.documentElement.classList.contains(
                "dark-mode"
            )
                ? "dark"
                : "light";
            localStorage.setItem("quickctx-theme", currentTheme);
        });
    }

    // Manage custom cursor
    function initCustomCursor() {
        const dot = document.querySelector(".cursor-dot");
        const outline = document.querySelector(".cursor-outline");

        let mouseX = 0,
            mouseY = 0;
        let outlineX = 0,
            outlineY = 0;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        });

        window.addEventListener("mousedown", () => {
            const cursorOutline = document.querySelector(".cursor-outline");
            cursorOutline.classList.add("pressing");
        });

        window.addEventListener("mouseup", () => {
            const cursorOutline = document.querySelector(".cursor-outline");
            setTimeout(() => {
                cursorOutline.classList.remove("pressing");
            }, 200);
        });

        const animateOutline = () => {
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;
            outline.style.left = `${outlineX}px`;
            outline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateOutline);
        };
        animateOutline();
    }

    // create side navigation and sync with scroll
    function initScrollspyNav() {
        const sections = [...document.querySelectorAll(".showcase-section")];
        const snapNavContainer = document.getElementById("snap-navigation");
        sections.forEach((section) => {
            const navLink = document.createElement("a");
            navLink.href = `#${section.id}`;
            navLink.dataset.target = section.id;
            navLink.classList.add("pointable");
            snapNavContainer.appendChild(navLink);
        });

        const navLinks = [...snapNavContainer.querySelectorAll("a")];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        navLinks.forEach((link) => {
                            link.classList.toggle(
                                "active",
                                link.dataset.target === id
                            );
                        });
                    }
                });
            },
            { threshold: 0.7 }
        );

        snapNavContainer.addEventListener("click", (event) => {
            if (event.target.tagName === "A") {
                event.preventDefault();

                const targetId = event.target.getAttribute("href");

                goToSection(targetId);
            }
        });

        sections.forEach((section) => observer.observe(section));
    }

    initShowcase();
});

function initAllMenus() {
    ctxManager.createAndBindMenu({
        menuId: "hero",
        selector: "#hero-box",
        structure: [
            {
                label: "Say Hello",
                action: () => showToast("Hello! 👾"),
                iconClass: "fas fa-hand",
            },
            {
                label: "✨ Magic Trick",
                action: launchConfetti,
            },
            MenuCommand.Separator(),
            {
                label: "Get Started",
                action: () => goToSection("#submenus"),
                iconClass: "fas fa-rocket",
            },
        ],
    });

    ctxManager.registerAction("openCuteGallery", (e) => {
        const open = openCuteGallery(e);
        if (open) {
            ctxManager.updateMenuCommand("submenu", "openCuteGallery", {
                label: "Close",
            });
        } else {
            ctxManager.updateMenuCommand("submenu", "openCuteGallery", {
                label: "Open",
            });
        }
    });

    // Submenu Menu
    ctxManager.createAndBindMenu({
        menuId: "submenu",
        selector: "#submenu-box",
        structure: [
            {
                label: "Open",
                action: "openCuteGallery",
                iconClass: "fas fa-folder-open",
                disabled: true,
            },
            {
                label: "Invert Colors",
                action: () =>
                    toggleInvert(document.getElementById("submenu-box")),
                iconClass: "fas fa-adjust",
            },
            MenuCommand.Separator(),
            {
                label: "Share",
                iconClass: "fas fa-share-alt",
                type: "sublist",
                subCommands: [
                    {
                        label: "Copy Link",
                        action: copyLink,
                        iconClass: "fas fa-link",
                    },
                    {
                        label: "Post to X",
                        action: postOnX,
                        iconClass: "fab fa-twitter",
                    },
                    MenuCommand.Separator(),
                    {
                        label: "More Options...",
                        type: "sublist",
                        subCommands: [
                            {
                                label: "Send to Mars",
                                action: sendToMars,
                                iconClass: "fas fa-space-shuttle",
                            },
                        ],
                    },
                ],
            },
        ],
    });

    ctxManager.createAndBindMenu({
        menuId: "trigger",
        selector: "#trigger-box",
        triggerEvent: "click",
        structure: [
            {
                label: "Like",
                iconClass: "fas fa-heart",
                action: (e) => heartExplosion(e),
            },
            {
                label: "Bookmark",
                iconClass: "fas fa-bookmark",
                action: () => showToast("Press Ctrl+D (or Cmd+D) to bookmark!"),
            },
        ],
    });

    ctxManager.registerAction("unlock", () => {
        const result = ctxManager.updateMenuCommand(
            "submenu",
            "openCuteGallery",
            { disabled: false }
        );
        if (result) {
            showToast("Nice one! You've unlocked something... 😼");
            ctxManager.updateMenuCommand("contextual", "unlock", {
                disabled: true,
                label: "Unlocked!",
                iconClass: "fas fa-unlock"
            });
        }
    });

    ctxManager.createAndBindMenu({
        menuId: "contextual",
        selector: ".context-item",
        filterStrategy: "disable",
        structure: [
            {
                label: "Unlock...",
                action: "unlock",
                iconClass: "fas fa-lock",
                targetTypes: ["folder"],
            },
            {
                label: "Download Image",
                action: downloadImage,
                iconClass: "fas fa-download",
                targetTypes: ["image"],
            },
            {
                label: "Preview",
                action: showCat,
                iconClass: "fas fa-eye",
                targetTypes: ["image"],
            },
            MenuCommand.Separator(),
            {
                label: "Get Info",
                action: getInfo,
                iconClass: "fas fa-info-circle",
                targetTypes: ["folder", "image"],
            },
            MenuCommand.Separator(),
            {
                label: "Delete",
                action: (e) => deleteItem(e),
                iconClass: "fas fa-trash",
                targetTypes: ["folder", "image"],
            },
        ],
    });

    ctxManager.createAndBindMenu({
        menuId: "nestingOuter",
        selector: "#nesting-box-outer",
        defaultTargetType: "outer-box",
        structure: [{ label: "Action for OUTER box", action: () => showToast('Clicked on outer action!')}],
    });

    ctxManager.createAndBindMenu({
        menuId: "nestingInner",
        selector: "#nesting-box-inner",
        defaultTargetType: "inner-box",
        structure: [{ label: "Action for INNER box", action: () => showToast('Clicked on inner action!')}],
    });

    ctxManager.createAndBindMenu({
        menuId: "events",
        selector: "#event-box",
        defaultTargetType: "event-box",
        structure: [
            { label: "Save", action: "save", iconClass: "fas fa-save" },
            { label: "Load", action: "load", iconClass: "fas fa-upload" },
            MenuCommand.Separator(),
            {
                label: "Export PDF",
                action: "export_pdf",
                iconClass: "fas fa-file-pdf",
            },
        ],
    });

    ctxManager.createAndBindMenu({
        menuId: "styleCustom",
        selector: "#style-box-custom",
        defaultTargetType: "style-box-custom",
        additionalClasses: "style-custom",
        structure: [
            { label: "Action 1", iconClass: "fas fa-star" },
            { label: "Action 2", iconClass: "fas fa-magic" },
            {
                label: "Sublist",
                iconClass: "fas fa-magic",
                subCommands: [
                    { label: "Action 3", disabled: true },
                    { label: "Action 4" },
                ],
            },
        ],
    });

    const commonActions = [
        { label: "Copy", action: () => {showToast("Copied!")}, iconClass: "fas fa-copy" },
        { label: "Cut", action: () => {showToast("Cut!")}, iconClass: "fas fa-cut" },
        {
            label: "Paste",
            action: "paste",
            iconClass: "fas fa-paste",
            disabled: true,
        },
    ];

    ctxManager.registerAction("toggleNyanCat", (e) => {
        const active = toggleNyanCat(e);

        if (active) {
            ctxManager.updateMenuCommand("advanced", "toggleNyanCat", {
                label: "Hide Cat",
            });
        } else {
            ctxManager.updateMenuCommand("advanced", "toggleNyanCat", {
                label: "Show Cat",
            });
        }
    });

    ctxManager.createAndBindMenu({
        menuId: "advanced",
        selector: "#advanced-box",
        defaultTargetType: "advanced-box",
        structure: [
            ...commonActions,
            MenuCommand.Separator(),
            {
                label: "Lil joke :)",
                action: (e) => jumpscarehehe(e),
                iconClass: "fas fa-ghost",
            },
            {
                label: "Show Cat",
                action: "toggleNyanCat",
                iconClass: "fas fa-cat",
            },
        ],
    });

    initInteractiveControls();
}

// QuickCTXActionSelected event listener
function initGlobalEventListener() {
    document.addEventListener("QuickCTXActionSelected", (e) => {
        const { menuId, commandLabel } = e.detail;

        // show event catch
        if (menuId === "events") {
            showToast(`Event caught! Action label: '${commandLabel}'`);
        }
    });
}

// manage trigger update example
function initInteractiveControls() {
    const triggerButtons = document.querySelectorAll(
        "#trigger-controls .control-btn"
    );
    const delaySlider = document.querySelector("#hover-delay-slider");
    const delayValueSpan = document.querySelector("#hover-delay-value");

    let currentTrigger = "click";
    let currentDelay = 150;

    triggerButtons.forEach((button) => {
        button.addEventListener("click", () => {
            triggerButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            currentTrigger = button.dataset.trigger;
            ctxManager.updateMenuConfiguration("trigger", {
                triggerEvent: currentTrigger,
            });
        });
    });

    delaySlider.addEventListener("input", (e) => {
        currentDelay = parseInt(e.target.value, 10);
        delayValueSpan.textContent = currentDelay;

        ctxManager.updateOptions({
            animations: {
                hoverMenuOpenDelay: currentDelay,
                hoverMenuCloseDelay: currentDelay,
            },
        });
    });
}
