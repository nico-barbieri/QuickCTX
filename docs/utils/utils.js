// show toast notification
function showToast(message, time = 3000) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, time);
}

// 3d cards effects
function init3dBoxes(boxSelector = ".interactive-box") {
    document.querySelectorAll(boxSelector).forEach((box) => {
        box.addEventListener("mousemove", (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateY = (x / (rect.width / 2)) * -5;
            const rotateX = (y / (rect.height / 2)) * 5;
            box.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        box.addEventListener("mouseleave", () => {
            box.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });
}

function goToSection(sectionSelector) {
    const nextSection = document.querySelector(sectionSelector);
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    }
}

export { showToast, init3dBoxes, goToSection };

