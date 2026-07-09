// --- SKIP INTRO ENGINE ---
function skipIntro() {
    const intro = document.getElementById('skip-intro');
    if (intro) {
        intro.style.opacity = '0';
        setTimeout(() => intro.style.display = 'none', 500);
    }
}
setTimeout(skipIntro, 4000);

// --- ANNIVERSARY TIMER ENGINE ---
const startDate = new Date("July 18, 2024 10:55:00").getTime();
setInterval(function() {
    const now = new Date().getTime();
    const distance = now - startDate;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById("live-timer").innerHTML = days + "d : " + hours + "h : " + minutes + "m : " + seconds + "s";
}, 1000);

// --- TAB SWITCHER ---
function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');
    
    if(tabId !== 'games') backToGames();
    window.scrollTo(0, 0);
}

// --- SEASON SWITCHER ---
function changeSeason() {
    const selectedSeason = document.getElementById('season-selector').value;
    const season1 = document.getElementById('season-1-episodes');
    const season2 = document.getElementById('season-2-episodes');
    if (selectedSeason === 'season1') {
        season1.style.display = 'flex'; season2.style.display = 'none';
    } else {
        season1.style.display = 'none'; season2.style.display = 'flex';
    }
}

// --- MEDIA MODAL ENGINE ---
function openImageModal(src) {
    document.getElementById('mediaModal').style.display = "block";
    let img = document.getElementById('fullImage');
    img.src = src; img.style.display = "block";
    document.getElementById('fullVideo').style.display = "none";
}
function openVideoModal(src) {
    document.getElementById('mediaModal').style.display = "block";
    let vid = document.getElementById('fullVideo');
    vid.src = src; vid.style.display = "block"; vid.play();
    document.getElementById('fullImage').style.display = "none";
}
function closeModal() {
    document.getElementById('mediaModal').style.display = "none";
    let vid = document.getElementById('fullVideo');
    vid.pause(); vid.currentTime = 0; 
}

// --- AUTO-PLAYING PREVIEWS ENGINE ---
document.querySelectorAll('.episode-row').forEach(row => {
    row.addEventListener('mouseenter', function() {
        const video = this.querySelector('.preview-video');
        if(video) video.play();
    });
    row.addEventListener('mouseleave', function() {
        const video = this.querySelector('.preview-video');
        if(video) { video.pause(); video.currentTime = 0; }
    });
});

// --- GAMES MENU ENGINE ---
function openGame(gameId) {
    document.getElementById('games-menu').style.display = 'none';
    document.getElementById('game-trivia').style.display = 'none';
    document.getElementById('game-scratch').style.display = 'none';
    
    document.getElementById(gameId).style.display = 'block';
    
    if(gameId === 'game-scratch') {
        initScratchCard();
    }
}
function backToGames() {
    document.getElementById('games-menu').style.display = 'flex';
    document.getElementById('game-trivia').style.display = 'none';
    document.getElementById('game-scratch').style.display = 'none';
}

// --- SCRATCH CARD ENGINE ---
function initScratchCard() {
    const canvas = document.getElementById('scratchCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#666';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Helvetica';
    ctx.fillStyle = '#ddd';
    ctx.fillText('Scratch Here', 90, 80);
    ctx.globalCompositeOperation = 'destination-out';

    function scratch(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, {passive: false});
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch, {passive: false});
}

// --- DATABASE AUTO-BUILDER ENGINE ---
function buildPhotoCard(photoSrc, index) {
    let card = document.createElement('div');
    card.className = 'netflix-card';
    let imgSrc = `images/${photoSrc}`;
    card.innerHTML = `
        <img src="${imgSrc}" onclick="openImageModal('${imgSrc}')">
        <div class="card-metadata" onclick="openImageModal('${imgSrc}')">
            <div class="meta-match">100% Match</div>
            <div>Episode ${index + 1}</div>
        </div>
    `;
    return card;
}
function loadDatabaseContent() {
    if(typeof romanticPhotos !== 'undefined') {
        const romGallery = document.getElementById('romantic-gallery');
        if(romGallery) romanticPhotos.forEach((photo, i) => romGallery.appendChild(buildPhotoCard(photo, i)));
    }
    if(typeof happyPhotos !== 'undefined') {
        const hapGallery = document.getElementById('happy-gallery');
        if(hapGallery) happyPhotos.forEach((photo, i) => hapGallery.appendChild(buildPhotoCard(photo, i)));
    }
    if(typeof funnyPhotos !== 'undefined') {
        const funGallery = document.getElementById('funny-gallery');
        if(funGallery) funnyPhotos.forEach((photo, i) => funGallery.appendChild(buildPhotoCard(photo, i)));
    }
    
    // Load Vertical Videos (Shorts Tab)
    if(typeof ourVideos !== 'undefined') {
        const vidGallery = document.getElementById('video-gallery');
        if(vidGallery) {
            ourVideos.forEach(video => {
                let vidSrc = `videos/${video}`;
                let vidElement = document.createElement('video');
                vidElement.src = vidSrc; vidElement.className = 'reel-format';
                vidElement.onclick = () => openVideoModal(vidSrc); 
                vidGallery.appendChild(vidElement);
            });
        }
    }

    // Load Our Mixtape (YouTube Iframes)
    if (typeof ourMixtape !== 'undefined') {
        const mixGallery = document.getElementById('mixtape-gallery');
        if(mixGallery) {
            ourMixtape.forEach(songId => {
                let iframe = document.createElement('iframe');
                iframe.style = "border-radius:8px; min-width: 300px; max-width: 100%; flex-shrink: 0; margin-bottom: 15px;";
                iframe.width = "350"; iframe.height = "100";
                iframe.frameBorder = "0"; iframe.allowFullscreen = true;
                iframe.src = `https://www.youtube.com/embed/${songId}`;
                mixGallery.appendChild(iframe);
            });
        }
    }
}

// Run the builder when the page loads
window.onload = () => {
    loadDatabaseContent();
};