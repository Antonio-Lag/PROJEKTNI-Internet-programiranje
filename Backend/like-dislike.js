let likeCount = 0;
let dislikeCount = 0;
let liked = false;
let disliked = false;

function toggleLike() {
    const likeButton = document.getElementById('likeButton');
    const dislikeButton = document.getElementById('dislikeButton');

    if (liked) {
        likeCount--;
        liked = false;
    } else {
        likeCount++;
        if (disliked) {
            dislikeCount--;
            disliked = false;
        }
        liked = true;
    }

    updateCounts();
}

function toggleDislike() {
    const likeButton = document.getElementById('likeButton');
    const dislikeButton = document.getElementById('dislikeButton');

    if (disliked) {
        dislikeCount--;
        disliked = false;
    } else {
        dislikeCount++;
        if (liked) {
            likeCount--;
            liked = false;
        }
        disliked = true;
    }

    updateCounts();
}

function updateCounts() {
    document.getElementById('likeCount').innerText = likeCount;
    document.getElementById('dislikeCount').innerText = dislikeCount;
}