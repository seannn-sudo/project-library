// DOM elements
const modal = document.querySelector(".modal");
const signUpForm = document.querySelector(".sign-up-form");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");

// Library data and counters
let myLibrary = [];
let unReadBookStat = 0;

// Toggle modal visibility
function toggleModal() {
    modal.classList.toggle("show-modal");
    signUpForm.classList.toggle("show-form");
}

// Close modal when clicking outside of it
function closeModal(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

// Book constructor
function bookInput(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

// Add book to library
function addBookToLibrary(event) {
    event.preventDefault();
    const form = event.target.elements;
    const book = new bookInput(
        form['book-title'].value,
        form['author'].value,
        form['number-of-pages'].value,
        form['read'].checked
    );
    myLibrary.push(book);
    displayLibrary();
    event.target.reset();
}

// Display the library on the page
function displayLibrary() {
    // Create elements for a new book card
    const lastElementIndex = myLibrary.length - 1;
    const lastElement = myLibrary[lastElementIndex];
    const bookDisplay = document.querySelector(".book-display");
    const div = document.createElement('div');
    const author = document.createElement('p');  
    const title = document.createElement('p');  
    const pages = document.createElement('p');  
    const isRead = document.createElement('span');
    const deleteButton = document.createElement('button');
    const readCheckbox = document.createElement('input');  
    const dummyDiv = document.createElement('div');

    // Add classes and attributes
    div.classList.add('card');
    title.classList.add('card-title');
    div.setAttribute('data-index-number', `${lastElementIndex}`);
    readCheckbox.setAttribute("type", "checkbox");

    // Check if the book is read or unread
    if (lastElement.isRead) {
        readCheckbox.setAttribute('checked', 'checked');
    } else {
        unReadBookStat++;
    }

    // Set content and event listeners
    title.textContent = lastElement.title;
    author.textContent = `Author: ${lastElement.author}`;
    pages.textContent = `Number of Pages: ${lastElement.pages}`;
    isRead.textContent = `Finished Reading? `;
    deleteButton.textContent = 'Delete Book';
    deleteButton.addEventListener("click", deleteBook);
    readCheckbox.addEventListener('change', changeReadStatus);

    // Append elements to the card
    div.appendChild(title);
    div.appendChild(author);
    div.appendChild(pages);
    div.appendChild(isRead);
    div.appendChild(readCheckbox);
    div.appendChild(dummyDiv);
    div.appendChild(deleteButton);
    bookDisplay.appendChild(div);
    updateBookStats();
}

// Delete a book from the library
function deleteBook(event) {
    const bookDisplay = document.querySelector(".book-display");
    const cardToBeRemoved = event.target.parentElement;
    const bookIndexNumber = cardToBeRemoved.dataset.indexNumber;

    // Update unread book count if necessary
    if (!myLibrary[bookIndexNumber].isRead) {
        unReadBookStat--;
    }

    // Remove the book from the library and the display
    myLibrary.splice(bookIndexNumber, 1);
    bookDisplay.removeChild(cardToBeRemoved);

    // Update data-index-number attribute for remaining cards
    const cardIndex = document.querySelectorAll(".card");
    cardIndex.forEach((card, newIndex) => {
        card.dataset.indexNumber = newIndex;
    });

    updateBookStats();
}

// Change read status of a book
function changeReadStatus(event) {
    const cardToBeChanged = event.target.parentElement;
    const bookIndexNumber = cardToBeChanged.dataset.indexNumber;
    const checkboxInput = cardToBeChanged.querySelector('input');

    // Update the read status and unread book count
    myLibrary[bookIndexNumber].isRead = event.target.checked;
    if (myLibrary[bookIndexNumber].isRead) {
        checkboxInput.setAttribute('checked', 'checked');
        unReadBookStat--;
    } else {
        checkboxInput.removeAttribute('checked');
        unReadBookStat++;
    }

    updateBookStats();
}

// Update book statistics on the page
function updateBookStats() {
    document.querySelector(".total-books").textContent = `Total Books: ${myLibrary.length}`;
    document.querySelector(".book-read").textContent = `Books Read: ${myLibrary.length - unReadBookStat}`;
    document.querySelector(".book-unread").textContent = `Books Unread: ${unReadBookStat}`;
}

// Update the copyright year in the footer
function updateYear() {
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
}

// Attach event listeners
updateYear();
trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", closeModal);
signUpForm.addEventListener("submit", addBookToLibrary);