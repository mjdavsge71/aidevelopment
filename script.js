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
