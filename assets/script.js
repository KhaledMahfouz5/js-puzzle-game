const imageFiles = Array.from({ length: 25 }, (_, i) => `image${i + 1}.jpg`);
const selectedImage = `images/${imageFiles[Math.floor(Math.random() * imageFiles.length)]}`;
const reloadBtn = document.getElementById('reloadBtn');
const PIECE_COUNT = 16;
const GRID_SIZE = 4;
const BOARD_SIZE = 500;

let draggedPiece = null;

// Initialize game
document.documentElement.style.setProperty('--puzzle-image', `url(${selectedImage})`);
createBoard();
createPieces();
setupEventListeners();

function createBoard() {
	const board = document.getElementById('board');
	board.style.backgroundImage = `url(${selectedImage})`;
	board.innerHTML = '';

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
	piecesContainer.innerHTML = '';

	const pieceSize = BOARD_SIZE / GRID_SIZE;
	const positions = Array.from({length: PIECE_COUNT}, (_, i) => i);

	// Shuffle positions
	for (let i = positions.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[positions[i], positions[j]] = [positions[j], positions[i]];
	}

	// Create pieces in shuffled positions
	positions.forEach((posIndex, i) => {
		const piece = document.createElement('div');
		piece.className = 'puzzle-piece';
		piece.dataset.position = posIndex;

		const col = posIndex % GRID_SIZE;
		const row = Math.floor(posIndex / GRID_SIZE);

		piece.style.backgroundImage = `url(${selectedImage})`;
		piece.style.backgroundPosition = `${-col * pieceSize}px ${-row * pieceSize}px`;

		// Calculate grid position in pieces container
		const containerCol = i % GRID_SIZE;
		const containerRow = Math.floor(i / GRID_SIZE);

		piece.style.gridColumn = containerCol + 1;
		piece.style.gridRow = containerRow + 1;

		// Set animation properties
		piece.style.setProperty('--tx', '0');
		piece.style.setProperty('--ty', '0');

		piecesContainer.appendChild(piece);

		// Trigger scattering animation
		setTimeout(() => {
			piece.classList.add('scattering');
			piece.classList.add('draggable');
			piece.draggable = true;
		}, 100 * i);
	});
}

function handleDragStart(e) {
	if (!e.target.classList.contains('draggable')) {
		e.preventDefault();
		return;
	}
	draggedPiece = e.target;
	e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
	if (draggedPiece) {
		draggedPiece.style.opacity = '1';
		draggedPiece = null;
	}
}

function handleDragOver(e) {
	e.preventDefault();
}

function handleDrop(e) {
	e.preventDefault();
	if (!draggedPiece) return;

	const targetSlot = e.target.classList.contains('puzzle-slot') ? 
		e.target : e.target.closest('.puzzle-slot');

	if (targetSlot && !targetSlot.children.length) {
		const piecePosition = parseInt(draggedPiece.dataset.position);
		const slotPosition = parseInt(targetSlot.dataset.position);

		if (piecePosition === slotPosition) {
			placePiece(targetSlot);
		} else {
			showInvalidFeedback(targetSlot);
		}
	}
}

function placePiece(slot) {
	const clone = draggedPiece.cloneNode(true);
	clone.classList.remove('draggable');
	clone.classList.add('placed');
	clone.classList.add('correct-placement');
	clone.draggable = false;
	slot.appendChild(clone);
	draggedPiece.remove();
	checkCompletion();
}

function showInvalidFeedback(element) {
	element.style.background = '#ffebee';
	setTimeout(() => element.style.background = '', 300);
}

function checkCompletion() {
  const placedPieces = document.querySelectorAll('.placed').length;
  if (placedPieces === PIECE_COUNT) {
    const victorySound = document.getElementById('victorySound');

    // Modern browsers handle promises for audio playback
    const playSound = () => {
      victorySound.currentTime = 0; // Rewind to start
      victorySound.play().catch(e => console.log("Audio play failed:", e));
    };

    // iOS requires this to be triggered by user gesture
    if (victorySound.readyState > 0) {
      playSound();
    } else {
      victorySound.addEventListener('canplaythrough', playSound);
    }

    setTimeout(() => {
      alert('Congratulations! Puzzle Solved! 🎉');
    }, 100);
  }
}

function setupEventListeners() {
	document.addEventListener('dragstart', handleDragStart);
	document.addEventListener('dragend', handleDragEnd);
}

reloadBtn.addEventListener('click', () => {
	window.location.reload();
});
