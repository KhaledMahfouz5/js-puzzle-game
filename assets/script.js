const imageFiles = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
const selectedImage = `./images/${imageFiles[Math.floor(Math.random() * imageFiles.length)]}`;
const PIECE_COUNT = 16;  
const COLS = 4, ROWS = 4;  

let draggedPiece = null;

function createBoard() {
    const board = document.getElementById('board');
    for(let i = 0; i < PIECE_COUNT; i++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.dataset.position = i;
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('drop', handleDrop);
        board.appendChild(slot);
    }
}

function createPieces() {
    const piecesContainer = document.getElementById('pieces');
    const pieces = [];

    for(let i = 0; i < PIECE_COUNT; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece draggable';
        piece.draggable = true;
        piece.dataset.position = i;
        
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        piece.style.backgroundImage = `url(${selectedImage})`;
	piece.style.backgroundPosition = `${-col * (100 / (COLS - 1))}% ${-row * (100 / (ROWS - 1))}%`;
	    
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragend', handleDragEnd);
        
        pieces.push(piece);
    }

    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => piecesContainer.appendChild(piece));
}

function handleDragStart(e) {
    draggedPiece = e.target;
    e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    draggedPiece = null;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    if(!draggedPiece) return;

    const targetSlot = e.target.classList.contains('puzzle-slot') ? 
        e.target : e.target.closest('.puzzle-slot');

    if(targetSlot && !targetSlot.children.length) {
        if(draggedPiece.dataset.position === targetSlot.dataset.position) {
            const clone = draggedPiece.cloneNode(true);
            clone.classList.remove('draggable');
            clone.classList.add('placed');
            clone.draggable = false;
            targetSlot.appendChild(clone);
            draggedPiece.remove();
            
            checkCompletion();
        } else {
            targetSlot.classList.add('incorrect');
            setTimeout(() => {
                targetSlot.classList.remove('incorrect');
            }, 300);
        }
    }
}

function checkCompletion() {
    const placedPieces = document.querySelectorAll('.placed').length;
    if(placedPieces === PIECE_COUNT) {
        setTimeout(() => {
            alert('Congratulations! Puzzle solved!');
        }, 100);
    }
}

// Initialize game
createBoard();
createPieces();
