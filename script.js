const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const screen1 = document.getElementById("screen-1");
const screen2 = document.getElementById("screen-2");
const previewContainer = document.getElementById("preview-container");
const previewImg = document.getElementById("preview-img");
const teamSelect = document.getElementById("team-select");
const btnNext = document.getElementById("btn-next");

let currentTeam = "";
const teams = [
    "Akshar Army", "Akshar Avengers", "Atmiya XI", "Bhoolku Challengers",
    "Chaitanya Super Kings", "Divine Daredevils", "Dynamic Sevaks", "Ekantik Titans",
    "Gunatit Guardians", "Gunatit Lions", "Nimit Ninjas", "Nirman Knight Riders",
    "Nishtha Chargers", "Prabhudas Paltans", "Prabodham Legends", "Prabodham Panthers",
    "Pragat Warriors", "Sambandh Squad", "Sanmukh Spartans", "Sahajanandi Lions",
    "Suruchi Risers", "Survir Super Giants", "Swadharma Scorers", "Swaroop Strikers",
    "Vivek Victors"
];

// Populate dropdown dynamically with 25 teams
if (teamSelect) {
    teams.forEach((teamName) => {
        const opt = document.createElement("option");
        opt.value = teamName;
        opt.textContent = teamName;
        teamSelect.appendChild(opt);
    });

    teamSelect.addEventListener("change", () => {
        if (teamSelect.value && userImg.src) {
            btnNext.disabled = false;
        }
    });
}

let userImg = new Image();
let frame = new Image();

let imgX = 0, imgY = 0;
let scale = 1;
let isDragging = false;
let startX, startY;

/* 📤 Upload & Preview */
document.getElementById("upload").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    // Show preview
    previewImg.src = url;
    previewContainer.style.display = "block";

    // Enable selection dropdown
    teamSelect.disabled = false;
    if (teamSelect.value) {
        btnNext.disabled = false;
    }

    // Load actual image
    userImg = new Image();
    userImg.src = url;
});

/* 🚀 Navigation */
function goToScreen2() {
    if (!userImg.src || !teamSelect.value) return;

    currentTeam = teamSelect.value;

    canvas.width = 1080;
    canvas.height = 1920;

    // Load the respective frame for that team
    frame.src = `${currentTeam}.png`;
    frame.onload = () => {
        resetImage();
    };

    // Switch screens
    screen1.style.display = "none";
    screen2.style.display = "block";
}

function goBack() {
    screen2.style.display = "none";
    screen1.style.display = "block";
}

function resetImage() {
    if (!userImg.src || !userImg.width) return;

    scale = Math.max(
        canvas.width / userImg.width,
        canvas.height / userImg.height
    );

    const zoomSlider = document.getElementById("zoom-slider");
    if (zoomSlider) {
        zoomSlider.value = scale;
    }

    imgX = (canvas.width - userImg.width * scale) / 2;
    imgY = (canvas.height - userImg.height * scale) / 2;

    draw();
}

/* 🎨 Draw */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (userImg.src && userImg.complete) {
        ctx.drawImage(
            userImg,
            imgX,
            imgY,
            userImg.width * scale,
            userImg.height * scale
        );
    }

    if (frame.complete) {
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
    }
}

/* 🖱️ Drag (Mouse) */
canvas.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.offsetX - imgX;
    startY = e.offsetY - imgY;
});

canvas.addEventListener("mousemove", e => {
    if (!isDragging) return;
    imgX = e.offsetX - startX;
    imgY = e.offsetY - startY;
    draw();
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);

/* 📱 Drag (Touch) */
canvas.addEventListener("touchstart", e => {
    // Prevent scrolling when touching the canvas
    e.preventDefault();
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];

    startX = (t.clientX - rect.left) - imgX;
    startY = (t.clientY - rect.top) - imgY;
}, { passive: false });

canvas.addEventListener("touchmove", e => {
    if (!isDragging) return;
    // Prevent scrolling when dragging
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];

    imgX = (t.clientX - rect.left) - startX;
    imgY = (t.clientY - rect.top) - startY;
    draw();
}, { passive: false });

canvas.addEventListener("touchend", () => isDragging = false);

/* 🔍 Zoom */
function handleZoom(value) {
    // Determine center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate new scale
    const newScale = parseFloat(value);

    // Adjust imgX and imgY so it zooms towards the center
    imgX = centerX - (centerX - imgX) * (newScale / scale);
    imgY = centerY - (centerY - imgY) * (newScale / scale);

    scale = newScale;
    draw();
}

/* ⬇️ Download */
function downloadImage() {
    const link = document.createElement("a");
    link.download = `${currentTeam}_frame.png`;

    link.href = canvas.toDataURL("image/png");
    link.click();
}