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
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const restartButton = document.getElementById('restart');

    context.scale(20, 20);

    let score = 0;

    function arenaSweep() {
        let rowCount = 1;
        outer: for (let y = arena.length - 1; y > 0; --y) {
            for (let x = 0; x < arena[y].length; ++x) {
                if (arena[y][x] === 0) {
                    continue outer;
                }
            }

            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            ++y;

            score += rowCount * 10;
            rowCount *= 2;
        }
    }

    function collide(arena, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                   (arena[y + o.y] &&
                    arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function createMatrix(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    function createPiece(type) {
        if (type === 'T') {
            return [
                [0, 0, 0],
                [5, 5, 5],
                [0, 5, 0],
            ];
        } else if (type === 'O') {
            return [
                [7, 7],
                [7, 7],
            ];
        } else if (type === 'L') {
            return [
                [0, 6, 0],
                [0, 6, 0],
                [0, 6, 6],
            ];
        } else if (type === 'J') {
            return [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0],
            ];
        } else if (type === 'I') {
            return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ];
        } else if (type === 'S') {
            return [
                [0, 3, 3],
                [3, 3, 0],
                [0, 0, 0],
            ];
        } else if (type === 'Z') {
            return [
                [2, 2, 0],
                [0, 2, 2],
                [0, 0, 0],
            ];
        }
    }

    function drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    context.fillStyle = colors[value];
                    context.fillRect(x + offset.x,
                                     y + offset.y,
                                     1, 1);
                }
            });
        });
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawMatrix(arena, {x: 0, y: 0});
        drawMatrix(player.matrix, player.pos);
    }

    function merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    function rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [
                    matrix[x][y],
                    matrix[y][x],
                ] = [
                    matrix[y][x],
                    matrix[x][y],
                ];
            }
        }

        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    function playerDrop() {
        player.pos.y++;
        if (collide(arena, player)) {
            player.pos.y--;
            merge(arena, player);
            playerReset();
            arenaSweep();
            updateScore();
        }
        dropCounter = 0;
    }

    function playerMove(dir) {
        player.pos.x += dir;
        if (collide(arena, player)) {
            player.pos.x -= dir;
        }
    }

    function playerReset() {
        const pieces = 'ILJOTSZ';
        player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
        player.pos.y = 0;
        player.pos.x = (arena[0].length / 2 | 0) -
                       (player.matrix[0].length / 2 | 0);
        if (collide(arena, player)) {
            arena.forEach(row => row.fill(0));
            score = 0;
            updateScore();
        }
    }

    function playerRotate(dir) {
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);
        while (collide(arena, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    }

    let dropCounter = 0;
    let dropInterval = 1000;

    let lastTime = 0;
    function update(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;

        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            playerDrop();
        }

        draw();
        requestAnimationFrame(update);
    }

    function updateScore() {
        scoreElement.innerText = score;
    }

    document.addEventListener('keydown', event => {
        if (event.keyCode === 37) {
            playerMove(-1);
        } else if (event.keyCode === 39) {
            playerMove(1);
        } else if (event.keyCode === 40) {
            playerDrop();
        } else if (event.keyCode === 81) {
            playerRotate(-1);
        } else if (event.keyCode === 87) {
            playerRotate(1);
        }
    });

    restartButton.addEventListener('click', () => {
        arena.forEach(row => row.fill(0));
        score = 0;
        updateScore();
        playerReset();
    });

    const colors = [
        null,
        '#FF0D72',
        '#0DC2FF',
        '#0DFF72',
        '#F538FF',
        '#FF8E0D',
        '#FFE138',
        '#3877FF',
    ];

    const arena = createMatrix(12, 20);

    const player = {
        pos: {x: 0, y: 0},
        matrix: null,
    };

    playerReset();
    updateScore();
    update();
});
