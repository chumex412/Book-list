// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() {}

// Method to add book
UI.prototype.addBookToList = function(book) {
  const tBody = document.getElementById('book-section');

  // Create div
  const tr = document.createElement('tr');
  tr.className = 'paragraph';
  tr.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">&times;</a></td>
  `;
  tBody.appendChild(tr);

}

UI.prototype.removeBook = function(target) {
  target.parentElement.parentElement.remove();
}

// Show Alert
UI.prototype.showAlert = function (message, color) {
  const container = document.querySelector('.container'),
        card = document.querySelector('.card');

  const div = document.createElement('div');
  div.className = `alert paragraph`;
  div.append(document.createTextNode(message));
  div.style.backgroundColor = color;
  container.insertBefore(div, card);

  // Remove Alert after 3seconds
  setTimeout(function() {
    document.querySelector('.alert').remove();
  }, 3000)
}

// Clear input field
UI.prototype.clearField = function() {
  document.getElementById('book-title').value = '';
  document.getElementById('book-author').value = '';
  document.getElementById('book-issue').value = '';
}

// Constructor for local storage
function Store() {}

// Get Book from Local storage
Store.getBook = function() {
  let books;
  if(localStorage.getItem('Book') === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('Book', books));
  }
  return books;
}

// Add Book to local storage
Store.addBook = function(book) {
  const books = Store.getBook();

  books.push(book);

  localStorage.setItem('Book', JSON.stringify(books));
}

// Display book from local storage in the UI
Store.displayBooks = function() { 
  const books = Store.getBook();

  books.forEach(book => {
    const ui = new UI();
    ui.addBookToList(book);
  });
}

// Delete book from local storage
Store.deleteBook = function(isbn) {
  const books = Store.getBook();

  books.forEach((book, i) => {
    if(isbn === book.isbn) {
      books.splice(i, 1);
    }
  });

  localStorage.setItem('Book', JSON.stringify(books));
}

// Event Listener for loading DOM content
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event lisner for add book
document.getElementById('book-form').addEventListener('submit', function(e) {

  // UI form Elements
  const title = document.getElementById('book-title').value,
        author = document.getElementById('book-author').value,
        isbn = document.getElementById('book-issue').value;

  // Instantiate Book
  const book = new Book(title, author, isbn)

  // Instantiate UI
  const ui = new UI();

  if (!title || !author || !isbn) {
    ui.showAlert('Please enter all input', 'red');
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add book to local storage
    Store.addBook(book);
    const store = new Store();

    ui.showAlert('Added book', 'green')
  }

  ui.clearField();
  e.preventDefault();
});

// Event Listener to remove book
document.getElementById('book-table').addEventListener('click', function(e) {
  const ui = new UI();

  const store = new Store();

  if(e.target.classList.contains('delete')) {
    ui.removeBook(e.target);

    // Delete book from local storage
    Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);

    ui.showAlert('Book removed', 'green');
  }
}); 