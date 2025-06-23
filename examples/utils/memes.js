import { showToast } from "./utils.js";

// --- MEME FUNCTIONS AND EASTER EGGS ---

// launch confetti using canvas-confetti library
const launchConfetti = () => {
    if (typeof confetti === "function") {
        const root = document.documentElement;
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: [
                getComputedStyle(root).getPropertyValue("--c-primary").trim(),
                getComputedStyle(root).getPropertyValue("--c-secondary").trim(),
                getComputedStyle(root).getPropertyValue("--c-heading").trim(),
            ],
        });
        showToast("🎉 Oh yeah!");
    } else {
        console.warn("Confetti library is not loaded.");
    }
};

async function jumpscarehehe({ target }) {
    if (!target) return;

    target.classList.add("shake");
    setTimeout(() => target.classList.remove("shake"), 500); 

    const roarSound = new Audio('https://www.myinstants.com/media/sounds/all-star.mp3');
    roarSound.volume = 0.7; 
    try {
        await roarSound.play();
    } catch (error) {
        console.error("Could not reproduce the sound: ", error);
    }

    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1000',
        opacity: '0', 
        transition: 'opacity 0.1s ease-in-out',
    });

    const jumpscareImage = document.createElement("img");
    jumpscareImage.src = "./res/shrek_jumpscare.png"; 
    Object.assign(jumpscareImage.style, {
        height: '100%',
        transform: 'scale(0.8)', 
        transition: 'transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28)', 
    });
    
    overlay.appendChild(jumpscareImage);
    document.body.appendChild(overlay);

    // little timeout to apply initial styles
    setTimeout(() => {
        overlay.style.opacity = '1';
        jumpscareImage.style.transform = 'scale(1)';
    }, 10);

    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.addEventListener('transitionend', () => overlay.remove());

    }, 5000);

    const responses = ["GET OUT OF MY SWAMP!", "BOO!", "Scared? Heh..."];
    showToast("💀 " + responses[Math.floor(Math.random() * responses.length)]);
}

function showCat() {
    const container = document.createElement("div");

    Object.assign(container.style, {
        position: "fixed",
        zIndex: "10000",
        display: "block",
        width: "25svw",
        height: "25svh",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    });

    const img = document.createElement("img");
    img.src =
        "https://media.tenor.com/28cCOSYKZtYAAAAj/banana-cat-cat-banana.gif";

    img.alt = "Funny cat";
    container.appendChild(img);

    document.body.appendChild(container);

    setTimeout(() => {
        document.body.removeChild(container);
    }, 1500);

    showToast("Meeeow! 🐈", 1500);
}

function toggleInvert(target) {
    target.classList.toggle("inverted");
}

// simulate like
function heartExplosion({ target }) {
    if (!target) return;

    for (let i = 0; i < 10; i++) {
        const heart = document.createElement("div");
        heart.innerHTML = "❤️";
        heart.style.position = "absolute";
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        heart.style.opacity = "1";
        heart.style.transition =
            "transform 1.5s ease-out, opacity 1.5s ease-out";
        heart.style.pointerEvents = "none";
        heart.style.zIndex = "10";

        (target.append ? target : document.body).appendChild(heart);

        setTimeout(() => {
            const angle = (Math.random() - 0.5) * 200;
            heart.style.transform = `translateY(-200px) translateX(${angle}px) rotate(360deg)`;
            heart.style.opacity = "0";
        }, 10);

        setTimeout(() => {
            heart.remove();
        }, 1500);
    }

    showToast(
        "Thanks! :) If you liked this project, you could leave it a star! ⭐", 5000
    );
}

function copyLink() {
    navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
            showToast("Link copied to clipboard!");
        })
        .catch((err) => {
            console.error("Failed to copy link: ", err);
            showToast("Could not copy link.");
        });
}

function postOnX() {
    const text = encodeURIComponent(
        `Check out QuickCTX, a cool JavaScript library for custom context menus!`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        "_blank"
    );
}

function sendToMars({ target }) {
    if (!target) return;
    showToast("Launch sequence initiated... 🚀");

    Object.assign(target.style, {
        transition:
            "transform 1s cubic-bezier(0.6, -0.28, 0.735, 0.045), opacity 1s ease-in, filter 1s",
        transform: "translateY(-200vh) rotate(45deg) scale(0.1)",
        filter: "blur(5px)",
        opacity: "0",
    });

    setTimeout(() => {
        target.style.transition = "opacity 0.5s ease-in-out, filter 0.5s";
        target.style.transform = "translateY(0) rotate(0deg) scale(1)";
        target.style.filter = "blur(0px)";
        target.style.opacity = "1";
        showToast("Welcome back!");
    }, 4000);
}

function openCuteGallery({ target }) {
    if (!target) return false;

    if (target.dataset.isGallery) {
        clearInterval(target.galleryInterval);
        delete target.dataset.isGallery;
        delete target.galleryInterval;
        target.classList.remove("is-open");
        setTimeout(() => {
            target.innerHTML = target.dataset.originalContent;
            delete target.dataset.originalContent;
            target.classList.remove("hide-outline-on-hover");
        }, 400);
        return false;
    }

    showToast("Cat-lery unlocked! 🔓🖼️🐈‍",);

    target.classList.add("is-open");
    target.classList.add("hide-outline-on-hover");

    target.dataset.originalContent = target.innerHTML;
    target.dataset.isGallery = "true";
    target.innerHTML = "";
    target.style.position = "relative";
    target.style.overflow = "hidden";

    const catImageUrls = [
        `https://cataas.com/cat/says/Hello!%20%3A%29?width=450&height=450&fontColor=white&t=${Date.now()}`,
        `https://cataas.com/cat/gif?t=${Date.now()}`,
        `https://cataas.com/cat/says/Leave%20a%20star!?width=450&height=450&fontColor=white&t=${Date.now()}`,
    ];

    const slideshowContainer = document.createElement("div");
    Object.assign(slideshowContainer.style, {
        display: "flex",
        height: "100%",
        transition: "transform 0.5s ease-in-out",
    });

    // Creating slides...
    const slides = [];
    const originalSlide = document.createElement("div");
    originalSlide.innerHTML = target.dataset.originalContent;
    slides.push(originalSlide);
    catImageUrls.forEach((url) => {
        const img = document.createElement("img");
        img.src = url;
        img.onerror = () => {
            img.src = `https://placehold.co/450x280/5E8B7E/EAE3D9?text=Cute+Cat+Here`;
        };
        slides.push(img);
    });

    slides.forEach((slideContent) => {
        const slide = document.createElement("div");
        Object.assign(slide.style, {
            width: "100%",
            height: "100%",
            flexShrink: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
        });
        if (slideContent.tagName === "IMG") {
            slideContent.style.width = "100%";
            slideContent.style.height = "100%";
            slideContent.style.objectFit = "cover";
        }
        slide.appendChild(slideContent);
        slideshowContainer.appendChild(slide);
    });

    target.appendChild(slideshowContainer);

    // creating controls...
    const prevBtn = document.createElement("button");
    const nextBtn = document.createElement("button");
    const dotsContainer = document.createElement("div");

    // buttons style...
    [prevBtn, nextBtn].forEach((btn) => {
        Object.assign(btn.style, {
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.3)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontSize: "16px",
            zIndex: "10",
            opacity: "0.7",
            transition: "opacity 0.3s",
        });
        btn.onmouseover = () => (btn.style.opacity = "1");
        btn.onmouseout = () => (btn.style.opacity = "0.7");
    });
    prevBtn.style.left = "10px";
    nextBtn.style.right = "10px";
    prevBtn.innerHTML = "&#10094;";
    nextBtn.innerHTML = "&#10095;";

    Object.assign(dotsContainer.style, {
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "5px",
        zIndex: "10",
    });

    slides.forEach((_, i) => {
        const dot = document.createElement("span");
        Object.assign(dot.style, {
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            transition: "background 0.3s",
        });
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    });

    target.append(prevBtn, nextBtn, dotsContainer);

    // slideshow logic
    let currentIndex = 0;
    const dots = dotsContainer.children;

    function updateDots() {
        for (let i = 0; i < dots.length; i++) {
            dots[i].style.background =
                i === currentIndex ? "white" : "rgba(255,255,255,0.5)";
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        slideshowContainer.style.transform = `translateX(-${
            currentIndex * 100
        }%)`;
        updateDots();
    }

    function nextSlide() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0; // go back to first to create infinite loop
        }
        goToSlide(nextIndex);
    }

    function prevSlide() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1; // go back to last to create infinite loop
        }
        goToSlide(prevIndex);
    }

    function startInterval() {
        target.galleryInterval = setInterval(nextSlide, 4000);
    }

    prevBtn.onclick = () => {
        clearInterval(target.galleryInterval);
        prevSlide();
        startInterval();
    };
    nextBtn.onclick = () => {
        clearInterval(target.galleryInterval);
        nextSlide();
        startInterval();
    };
    target.onmousemove = () => clearInterval(target.galleryInterval);
    target.onmouseleave = startInterval;

    goToSlide(0); // starts from first slide
    startInterval(); // starts automatic slide

    return true;
}

function deleteItem({ target }) {
    if (!target || !target.parentNode) return;

    Object.assign(target.style, {
        overflow: "hidden",
        maxWidth: "0%",
        opacity: "0",
        padding: "0",
    });

    target.parentNode.style.gap = "0";

    setTimeout(() => {
        target.display = "none";
    }, 200);

    setTimeout(() => {
        target.style.display = "";
        target.style.maxWidth = "100%";
        target.style.opacity = "1";
        target.style.padding = "1.5rem";
        target.parentNode.style.gap = "1rem";
    }, 10000);

    showToast(
        `Don't worry... the ${target.dataset.customCtxmenuType} will be restored in a few seconds...`,
        5000
    );
}

function getInfo() {
    const responses = [
        "That's classified.",
        "I could tell you, but then I'd have to refactor you.",
        "My secrets are my own. Besides, you wouldn't understand.",
        "403: I can't give you info.",
        "Mind your own business!",
    ];

    showToast(responses[Math.floor(Math.random() * responses.length)] + "🤫");
}

async function downloadImage() {
    showToast("Preparing your cat for download...");
    try {
        const response = await fetch("https://cataas.com/cat");

        const blob = await response.blob();

        const localUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = localUrl;
        link.download = "cat.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(localUrl);
    } catch (error) {
        console.error("Download failed:", error);
        showToast("Could not download the image.");
    }
}

async function toggleNyanCat() {
    const nyanCursorId = 'nyan-cursor';
    const nyanAudioId = 'nyan-audio';

    document.querySelector(".cursor-dot").style.display = "";
    document.querySelector(".cursor-outline").style.display = "";
    
    const existingCursor = document.getElementById(nyanCursorId);
    if (existingCursor) {
        const oldMoveHandler = window.nyanMoveHandler;
        if (oldMoveHandler) {
            window.removeEventListener('mousemove', oldMoveHandler);
        }
        existingCursor.remove();
        const existingAudio = document.getElementById(nyanAudioId);
        if (existingAudio) existingAudio.remove();
        return false;
    }

    const top = document.querySelector(".cursor-dot").getBoundingClientRect().top;
    const left = document.querySelector(".cursor-dot").getBoundingClientRect().left;

    document.querySelector(".cursor-dot").style.display = "none";
    document.querySelector(".cursor-outline").style.display = "none";

    const nyanCursor = document.createElement('div');
    nyanCursor.id = nyanCursorId;
    Object.assign(nyanCursor.style, {
        position: 'fixed',
        width: '50px',
        height: '30px',
        backgroundImage: 'url(https://www.nyan.cat/cats/original.gif)',
        backgroundSize: 'cover',
        pointerEvents: 'none',
        zIndex: '10002',
        willChange: 'transform, left, top',
        transform: 'translate(-50%, -50%) rotate(0deg)',
        top: top + "px",
        left: left + "px",
    });
    
    document.body.append(nyanCursor);

    let lastX = null, lastY = null;
    let currentAngle = 0;
    const smoothing = 0.2;

    const moveNyanHandler = (e) => {
        if (lastX === null) {
            lastX = e.clientX;
            lastY = e.clientY;
        }

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
            currentAngle += (targetAngle - currentAngle) * smoothing;
        }
        
        nyanCursor.style.left = `${e.clientX}px`;
        nyanCursor.style.top = `${e.clientY}px`;
        nyanCursor.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;

        lastX = e.clientX;
        lastY = e.clientY;
        
        const trail = document.createElement('div');
        Object.assign(trail.style, {
            position: 'fixed',
            left: `${e.clientX}px`, top: `${e.clientY}px`,
            width: '6px', height: '20px',
            pointerEvents: 'none', zIndex: '10001',
            background: `linear-gradient(red, orange, yellow, green, blue, indigo, violet)`,
            opacity: '0', animation: 'trail-fade 0.1s linear',
            transform: `translateY(-50%) rotate(${currentAngle}deg)`
        });
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 100);
    };

    window.nyanMoveHandler = moveNyanHandler;
    window.addEventListener('mousemove', moveNyanHandler);
    
    const nyanAudio = document.createElement('audio');
    nyanAudio.id = nyanAudioId;
    nyanAudio.src = 'https://www.nyan.cat/music/original.mp3';
    nyanAudio.loop = true;
    nyanAudio.volume = 0.05;
    document.body.appendChild(nyanAudio);
    await nyanAudio.play().catch(e => console.log("Autoplay audio blocked by browser."));

    return true;
}

export {
    launchConfetti,
    jumpscarehehe,
    showCat,
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
};
