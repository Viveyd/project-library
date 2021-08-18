const yourLibrary = []
const bookShelves = document.querySelectorAll('.book-shelf');
const Book = {
    init: function(){
        this.title = title;
        this.author = author;
        this.date = date;
        return this;
    },
    create: function(){
        let newBook = Object.create(this);
        return newBook;
    },
}
const addBookForm = document.querySelector('#add-book-form');
let title = document.querySelector('#title-input');
let author = document.querySelector('#author-input');
let num = document.querySelector('#num-input');
let read = document.querySelectorAll('input[name="read-status"]');


initLibrary();

function initLibrary(){
    initForm();
    for(let bookShelf of bookShelves){
        //If a bookshelf is empty or isn't full, put add book button
        if((bookShelf.childElementCount == 0 || bookShelf.childElementCount < 8) && hasNoAdd(bookShelf)){
            appendDisplayFormBtnTo(bookShelf);
        }
    }
}

function initForm(){
    const exitBtn = document.querySelector('#exit-btn');
    const addBtn = document.querySelector('#add-btn');
    exitBtn.addEventListener('click', (e)=> exitForm(e))
    addBtn.addEventListener('click', (e)=> addBook(e))
} 

function hasNoAdd(node){
    for(let child of node.children){
        if(child.classList.contains('add-book')) return false;
    }
    return true;
}

function addBookToLibrary(){

}

function addBook(bookShelf){
    e.preventDefault();
    
    
    
    if(bookShelf.childElementCount == 0 || bookShelf.childElementCount < 9){
        let books = [... bookShelf.children];
        let nextBookIndex = books.length;
        // addBookToShelf(bookShelf, nextBookIndex);
        // addBookToLibrary(0, nextBookIndex);
        addBookToShelf(getFormResults);
        addBookToLibrary(getFormResults);
        appendDisplayFormBtnTo(bookShelf);
        alert('Added book successfully!');  
        resetForm();
        exitForm();
    }
    else console.log('Add book fail!'); 
 
}

function getFormResults(){
    let readVal;
    for(let radio of read){
        if(radio.checked == true){
            readVal = radio.value;
            break;
        }
    }
    return author.value,title.value, num.value, readVal;
}

function resetForm(){
    title.value='';
    title.focus();
    author.value='';
    num.value='';
    read.value='';
}

function addBookToShelf(bookShelf, nextBookIndex){
    let newBook = document.createElement('div');
    newBook.classList.add('books');
    newBook.appendChild(document.createTextNode(`0${nextBookIndex}`));
    newBook.addEventListener('mouseover', previewBook);
    bookShelf.appendChild(newBook);

}

function appendDisplayFormBtnTo(bookShelf){
    let displayFormBtn = document.createElement('button');
    displayFormBtn.appendChild(document.createTextNode('+'));
    displayFormBtn.classList.add('display-form-btn');
    displayFormBtn.addEventListener('click', ()=> {
        displayForm();
        //displayFormBtn.parentNode.removeChild(displayFormBtn);
    });
    bookShelf.appendChild(displayFormBtn);
}

function deleteThisBook(book){
    let bookShelf = book.parentNode;
    bookShelf.removeChild(book);
    adjustIndexOf(bookShelf);
}

function adjustIndexOf(bookShelf){
    let index = 1;
    for(let child of bookShelf.children){
        if(child.classList.contains('books')){
            let newIndex = `0${index}`;
            child.textContent = newIndex;
            index++;
        }
    }
}

function previewBook(){
  console.log('hovered');
}

function displayForm(){
    addBookForm.style.display = 'flex';
}
function exitForm(e){
    e.preventDefault();
    addBookForm.style.display='none';
}



