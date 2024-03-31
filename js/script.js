const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'bookshelf-apps';
const SAVED_EVET = 'saved-bbok';



document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

  function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser anda tidak mendukung local storage');
      return false;
    }
    return true;
  }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVET));
    }
  }

  function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    const uncompleteList = document.getElementById('incompleteBookshelfList');
    const completeList = document.getElementById('completeBookshelfList');
    


    const generatedID = generatedId();
    const bookObject = generatedBookObject(generatedID, bookTitle, bookAuthor, bookYear, isComplete )
    const book = makeBook (bookObject);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    if (!isComplete) {
      uncompleteList.append(book);
    } else {
      completeList.append(book);
    }
    saveData();
  }

  function generatedId() {
    return +new Date();
  }

  function generatedBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year : parseInt(year),
        isComplete
    }
  }


  function makeBook (bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis: " + bookObject.author;
    const textYear = document.createElement('p');
    textYear.innerText = "Tahun: " + bookObject.year;

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.append(textTitle, textAuthor, textYear);
    

    const container = document.createElement('div');
    container.classList.add('action')
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete) {
      const undoButton = document.createElement("button");
      undoButton.innerText = "baca ulang";
      undoButton.classList.add("green");

      undoButton.addEventListener ("click", function() {
        undoBookFromCompleted(bookObject.id)
      });

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "hapus buku";
      deleteButton.classList.add("red");

      deleteButton.addEventListener("click", function () {
        if (confirm("Anda Yakin Menghapus Buku Dari Bookshelf?")) {
          removeBookFromCompleted(bookObject.id);
          alert("Buku Dihapus Dari Bookshelf");
        } else {
        }

      });

      container.append(undoButton, deleteButton);
    } else {
      const doneButton = document.createElement("button");
      doneButton.innerText = "selesai baca buku";
      doneButton.classList.add("green");
      
      doneButton.addEventListener("click", function (){
        addBookCompleted(bookObject.id);
      });
      
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "hapus buku";
      deleteButton.classList.add("red");

      deleteButton.addEventListener("click", function () {
        if (confirm("Anda Yakin Menghapus Buku Dari Bookshelf?")) {
          removeBookFromCompleted(bookObject.id);
          alert("Buku Dihapus Dari Bookshelf");
        } else {
        }
      });

      container.append(doneButton, deleteButton);
    }
    return container;
  }


  function addBookCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
  
    if (bookTarget === -1) return;
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }


  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id == bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
   
    return -1;
  }


  document.getElementById('searchSubmit').addEventListener("keyup", function(event) {
    event.preventDefault();
    const cariBuku = document.getElementById('searchBookTitle').value.toLowerCase();
    const listBuku= document.querySelectorAll('.book_item > h3');

    for (let buku of listBuku) {
      if (cariBuku !== buku.innerText.toLowerCase()) {
        buku.parentElement.style.display = "none";
      } else {
        buku.parentElement.style.display = "block";
      }
    }   
});

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
          uncompletedBookList.append(bookElement);
        } else {
          completedBookList.append(bookElement);
        }
    }

console.log(books); 
  });