// Book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class
class UI {
  addBookToList(book) {
    const tBody = document.getElementById('book-section');

    // Create Table row
    const tr = document.createElement('tr');
    tr.className = 'paragraph book-list';
    tr.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">&times;</a></td>
    `;
    tBody.append(tr);
  }

  showAlert(message, color) {
    const container = document.querySelector('.container'),
          card = document.querySelector('.card');
    
    // Create Div
    const div  = document.createElement('div');
    div.className = `alert paragraph`;
    div.style.backgroundColor = color;
    div.append(document.createTextNode(message));
    container.insertBefore(div, card);

    // Remove message after 3 seconds
    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  removeBook(target) {
    if(target.classList.contains('delete')) {
      target.parentElement.parentElement.remove();
    }
  }

  clearField() {
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('book-issue').value = '';
  }
}

// Add Book to Local Storage
class Store {
  static getBook() {
    let books;
    if(localStorage.getItem('Book') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('Book'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBook();

    books.forEach(book => {
      const ui = new UI();

      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBook();

    books.push(book);

    localStorage.setItem('Book', JSON.stringify(books));
  }

  static clearBook(isbn) {
    const books = Store.getBook();

    books.forEach((book, i) => {
      if(isbn === book.isbn) {
        books.splice(i, 1);
      }
    });
    localStorage.setItem('Book', JSON.stringify(books));
  }
}

// DOM Event Listener
document.addEventListener('DOMContentLoaded', function() {
  Store.displayBooks();
})

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit', function(e) {
  
  const title = document.getElementById('book-title').value,
        author = document.getElementById('book-author').value,
        isbn = document.getElementById('book-issue').value;

  // Instantiating book
  const book = new Book(title, author, isbn);

  // Instantiating UI
  const ui = new UI();

  if(!title || !author || !isbn) {
    ui.showAlert('Please Enter all input field', 'red');
  } else {
    ui.addBookToList(book);

    Store.addBook(book);

    ui.showAlert('Book Added', 'green');
  }

  // Clear input field
  ui.clearField();

  e.preventDefault();
});

// Event Listener to remove book
document.getElementById('book-table').addEventListener('click', function(e) {
  const ui = new UI(); 
  ui.removeBook(e.target);

  // Remove book from Local Storage
  Store.clearBook(e.target.parentElement.previousElementSibling.textContent);

  ui.showAlert('Book removed', 'green');
});

