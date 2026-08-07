const audioElement = document.getElementById('audio-element');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const playlistItems = document.querySelectorAll('.playlist-item');

let currentTrackIndex = 0;

// Update Play/Pause Status
function togglePlay() {
    if (audioElement.paused) {
        audioElement.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        audioElement.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
}

playBtn.addEventListener('click', togglePlay);

// Load and Play Song
function loadTrack(index) {
    const item = playlistItems[index];
    const src = item.getAttribute('data-src');
    const title = item.getAttribute('data-title');
    const artist = item.getAttribute('data-artist');

    audioElement.src = src;
    trackTitle.textContent = title;
    trackArtist.textContent = artist;

    playlistItems.forEach(el => el.classList.remove('active'));
    item.classList.add('active');
    
    audioElement.play();
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
}

// Playlist Clicks
playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
    });
});

// Next / Prev Controls
nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlistItems.length;
    loadTrack(currentTrackIndex);
});

prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlistItems.length) % playlistItems.length;
    loadTrack(currentTrackIndex);
});

// Update Progress Bar & Time
audioElement.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    if (isNaN(duration)) return;
    
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Format Times
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
});

// Click on Progress Bar to Seek
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioElement.duration;
    audioElement.currentTime = (clickX / width) * duration;
});

// Auto play next track when ended
audioElement.addEventListener('ended', () => {
    nextBtn.click();
});
