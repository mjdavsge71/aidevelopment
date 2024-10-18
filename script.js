const notesContainer = document.getElementById('notes-container');
const newNoteBtn = document.getElementById('new-note-btn');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const addNoteBtn = document.getElementById('add-note-btn');
const noteTitleInput = document.getElementById('note-title');
const noteDescriptionInput = document.getElementById('note-description');

let notes = [];

function displayNotes() {
    notesContainer.innerHTML = '';
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
            <h2>${note.title}</h2>
            <p>${note.description}</p>
        `;
        notesContainer.appendChild(noteElement);
    });
}

function addNote() {
    const title = noteTitleInput.value.trim();
    const description = noteDescriptionInput.value.trim();
    if (title && description) {
        notes.push({ title, description });
        displayNotes();
        closeModal();
        noteTitleInput.value = '';
        noteDescriptionInput.value = '';
    }
}

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

newNoteBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
addNoteBtn.addEventListener('click', addNote);

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Initial display
displayNotes();
document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 10;
    const mineCount = 10;
    const board = document.getElementById('game-board');
    const cells = [];
    let mines = [];

    function initBoard() {
        board.innerHTML = '';
        cells.length = 0;
        mines = generateMines();

        for (let i = 0; i < boardSize; i++) {
            cells[i] = [];
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => revealCell(i, j));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    toggleFlag(i, j);
                });
                board.appendChild(cell);
                cells[i][j] = cell;
            }
        }
    }

    function generateMines() {
        const minePositions = new Set();
        while (minePositions.size < mineCount) {
            const position = Math.floor(Math.random() * boardSize * boardSize);
            minePositions.add(position);
        }
        return Array.from(minePositions).map(pos => [Math.floor(pos / boardSize), pos % boardSize]);
    }

    function revealCell(row, col) {
        const cell = cells[row][col];
        if (cell.classList.contains('revealed') || cell.classList.contains('flag')) return;

        cell.classList.add('revealed');
        if (isMine(row, col)) {
            cell.classList.add('mine');
            alert('Game Over!');
            initBoard();
        } else {
            const mineCount = countAdjacentMines(row, col);
            if (mineCount > 0) {
                cell.textContent = mineCount;
            } else {
                revealAdjacentCells(row, col);
            }
        }
    }

    function toggleFlag(row, col) {
        const cell = cells[row][col];
        if (cell.classList.contains('revealed')) return;

        cell.classList.toggle('flag');
    }

    function isMine(row, col) {
        return mines.some(mine => mine[0] === row && mine[1] === col);
    }

    function countAdjacentMines(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    if (isMine(newRow, newCol)) count++;
                }
            }
        }
        return count;
    }

    function revealAdjacentCells(row, col) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }

    initBoard();
});
