const yourLibrary = []
const bookShelves = document.querySelectorAll('.book-shelf');
const addBookForm = document.querySelector('#add-book-form');
//Used in add book form
let title = document.querySelector('#title-input');
let author = document.querySelector('#author-input');
let date = document.querySelector('#date-input');
let read = document.querySelectorAll('input[name="read-status"]');
//Used for displaying in preview panel
let titlePreview = document.querySelector('#title-preview');
let authorPreview = document.querySelector('#author-preview');
let datePreview = document.querySelector('#date-preview');
let idPreview = document.querySelector('#id-preview');
let statusPreview = document.querySelector('#status-preview');
//Used when adding books
let targetShelf;
let trigger;
//Mainly used for search function
let searchFilters = document.querySelectorAll('input[name="search-filters"]');
for(let filter of [... searchFilters]){
    filter.addEventListener('click', searchLibrary);
}
let searchBar = document.querySelector('#search-bar');
searchBar.addEventListener('keyup', searchLibrary);
const highlightedBookColor = 'gold';
const defaultBookColor = 'brown';
//Mainly used for import and exporting in localStorage
let objSeparator = '~#/#-';
let objSeparatorLen = objSeparator.length;
let propSeparator = '(*)';
let propSeparatorLen = propSeparator.length;
let keyValueSeparator = '(:)';

//Book object constructor
const Book = {
    init: function(id, title, author, date, status){
        this.id = id;
        this.title = title;
        this.author = author;
        this.date = date;
        this.status = status;
        return this;
    },
    create: function(){
        let newBook = Object.create(this);
        return newBook;
    },
}

//Initialize library.
initLibrary();
if(localDataExists()) importFromLocal();

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
    exitBtn.addEventListener('click', (e)=> exitForm(e))
    const addBtn = document.querySelector('#add-btn');
    addBtn.addEventListener('click', (e)=> addBook(e))
} 
// Auxilliary Functions
function hasNoAdd(node){
    for(let child of node.children){
        if(child.classList.contains('add-book')) return false;
    }
    return true;
}

function getNextLibIndex(){
    return yourLibrary.length;
}
function getArrCounterpartFromFilter(filter, input){
    for(let book of yourLibrary){
        if(book[filter] == input) return book;
    }
    return false;
}
function getShelfByPrefix(prefix){
    let shelf;
    if(prefix == 'a') shelf = document.querySelector('#book-shelf-a');
    else if(prefix == 'b') shelf = document.querySelector('#book-shelf-b');
    else if(prefix == 'c') shelf = document.querySelector('#book-shelf-c');
    else if(prefix == 'd') shelf = document.querySelector('#book-shelf-d');
    else if(prefix == 'e') shelf = document.querySelector('#book-shelf-e');
    else shelf = document.querySelector('#book-shelf-f');
    return shelf;
}
// Adding book functions
function addBook(e){
    e.preventDefault();
    if(targetShelf.childElementCount == 0 || targetShelf.childElementCount < 9){
        let formResults = getFormResults();
        let resultsArr = [];
        for(let result in formResults){
            resultsArr.push(formResults[result]);
        }
        console.log(resultsArr);
        addBookToShelf(resultsArr[0], targetShelf);
        addBookToLibrary(resultsArr[0], resultsArr[1], resultsArr[2], resultsArr[3], resultsArr[4]);
        appendDisplayFormBtnTo(targetShelf);
        targetShelf.removeChild(trigger);
        alert('Added book successfully!');  
        exportToLocal();
        resetForm();
        exitForm(e);
    }
    else console.log('Add book fail!'); 
 
}

function addBookToShelf(id, targetShelf, anImport, importCounter){
    let newBook = document.createElement('div');
    newBook.classList.add('books');
    if(anImport)newBook.setAttribute('data-library-index', importCounter)
    else newBook.setAttribute('data-library-index', getNextLibIndex())
    id = id.toUpperCase();
    newBook.appendChild(document.createTextNode(`${id}`));
    newBook.addEventListener('mouseenter', previewBook);
    newBook.addEventListener('mouseleave', previewDefault);
    targetShelf.appendChild(newBook);
}

function addBookToLibrary(id, title, author, date, status){
    let newBook = Book.create().init(id, title, author, date, status)
    yourLibrary.push(newBook);
}

// Add book form functions
function displayForm(){
    addBookForm.style.display = 'flex';
}
function exitForm(e){
    e.preventDefault();
    addBookForm.style.display='none';
}
function getFormResults(){
    let idPrefix = targetShelf.getAttribute('id').slice(this.length-1);
    let idSuffix = [... targetShelf.children].filter((child)=> (child.classList.contains('books')) ? true: false).length;
    let idVal = idPrefix + idSuffix;
    let readVal;
    for(let radio of read){
        if(radio.checked == true){
            readVal = radio.value;
            break;
        }
    }
    let formResults = {
        id: idVal,
        title: title.value,
        author: author.value,
        date: date.value,
        status: readVal,
    }
    return formResults;
}
function resetForm(){
    title.value='';
    title.focus();
    author.value='';
    date.value='';
    read.value='';
}
function appendDisplayFormBtnTo(bookShelf){
    let displayFormBtn = document.createElement('button');
    displayFormBtn.appendChild(document.createTextNode('+'));
    displayFormBtn.classList.add('display-form-btn');
    displayFormBtn.addEventListener('click', (e)=> {
        trigger = e.target;
        targetShelf = e.target.parentNode;
        displayForm();
    });
    bookShelf.appendChild(displayFormBtn);
}


// Delete function must:
// 1.) Remove target book element
// 2.) yourLibrary deletes the array book object that the target book element represented
// 3.) The above, should be done without messing the array's index to leave no gap
// 4.) Adjust former book siblings' text content index 
// 5.) data-library-id (which represents the element's index in yourLibrary array) must be updated to match
// 4 and 5 could be done simply clearing that shelf's book, create and append books based on copies of old book

function deleteThisBook(book){
    let bookShelf = book.parentNode;
    bookShelf.removeChild(book); // 1
    deleteFromLibraryArray(book) // 2 & 3
    adjustIndices(bookShelf, book);
    appendDisplayFormBtnTo(bookShelf);
    exportToLocal();
    alert('Successful delete!')
}

function adjustIndices(bookShelf){
    while(bookShelf.firstElementChild) bookShelf.removeChild(bookShelf.firstElementChild);
    let shelfPrefix = bookShelf.getAttribute('id').slice(11);
    let adjustedBooks = yourLibrary.filter(book => book.id.slice(0,1) == shelfPrefix);
    let importCounter = 0;
    let anImport = true;

    adjustedBooks.forEach(book => {
        book.id = `${shelfPrefix}${importCounter}`;
        addBookToShelf(book.id, bookShelf, anImport, importCounter);
        importCounter++;
    })
}

function deleteFromLibraryArray(book){
   let bookArrayIndex = book.getAttribute('data-library-index');
   yourLibrary.splice(bookArrayIndex, 1);
}

//Book preview functions

function previewBook(e){
    let sourceBook = yourLibrary[Number(e.target.getAttribute('data-library-index'))];
    authorPreview.textContent = `${sourceBook.author}`;
    titlePreview.textContent = `${sourceBook.title}`;
    datePreview.textContent = `${sourceBook.date}`;
    idPreview.textContent = `${sourceBook.id}`;
    statusPreview.textContent = `${sourceBook.status}`;
}
function previewDefault(){
    authorPreview.textContent = 'Author';
    titlePreview.textContent = 'Title';
    datePreview.textContent = 'Date';
    idPreview.textContent = 'ID';
    statusPreview.textContent = 'Reading Status';
}


// Search function

function searchLibrary(){
    // reset colors first after every type
    let allDisplayFormBtns = document.querySelectorAll('.display-form-btn');
    allDisplayFormBtns.forEach(btn => {
        btn.style.display = 'flex';
    })
    let shelfedBooks = [... document.querySelectorAll('.books')];
    shelfedBooks.map(book => book.style.visibility = 'visible');
    //get user input and chosen filter
    let searchQuery = searchBar.value.trim().toLowerCase();
    let searchFilter = [... searchFilters].filter(filter => filter.checked == true)[0].value;
    if(searchQuery === '') return 0;
    //
    //both cases below use id to access the matching books on shelves
    if(searchFilter == 'id'){
        shelfedBooks.filter(book => !book.textContent.toLowerCase().includes(searchQuery))
                    .map(book=> book.style.visibility = 'hidden');
    }
    else if(searchFilter == 'title' || searchFilter == 'author'){
        let definiteMatches = yourLibrary.filter(book => !book[`${searchFilter}`].toLowerCase().includes(searchQuery));
        definiteMatches.forEach(match => {
            shelfedBooks.filter(book => book.textContent.toLowerCase() == match.id)
                        .map(book => book.style.visibility = 'hidden');
        })
    }
    allDisplayFormBtns.forEach(btn => {
        btn.style.display = 'none';
    })
}

// Local storage functions (import, export)

function exportToLocal(){
    // So everytime an operation(adding, editing, deleting) finishes, exportToLocal.
    // All book objects in yourLibrary and their specific order  are reduced into a single string.
    // It will then be stored as a string property in the localStorage
    // object insertion should include to 
    let finalString = '';
    yourLibrary.map((book)=>{
        let string = objSeparator;
        let i = 0;
        let bookPropLen = Object.keys(book).length;
        for(let prop in book){
            if(book.hasOwnProperty(prop)){
                if (i == bookPropLen-1)  string+= prop + keyValueSeparator +book[prop];
                else string+= prop + keyValueSeparator + book[prop]+propSeparator;
            }
            i++;
        }
        finalString += string;
    })
    let length = finalString.length;
    finalString = finalString.slice(objSeparatorLen, length);
    localStorage.setItem('save-data-viveyd', finalString);
} 

function importFromLocal(){
    let importData = localStorage.getItem('save-data-viveyd');
    if(importData != 0){
        importData.split(objSeparator)
                  .map(stringObject => {
                        let propArr = stringObject.split(propSeparator);
                        let sortedObj = {};
                        propArr.forEach(prop =>{
                            let splitProp = prop.split(keyValueSeparator);
                            sortedObj[`${splitProp[0]}`] = splitProp[1];
                        })
                        console.log(sortedObj);
                        addBookToLibrary(sortedObj.id, sortedObj.title, sortedObj.author, sortedObj.date, sortedObj.status);
                    });
        let importCounter = 0;
        let anImport = true;
        yourLibrary.forEach(book =>{
            let targetShelf = getShelfByPrefix(book.id.slice(0,1));
            addBookToShelf(book.id, targetShelf, anImport, importCounter);
            importCounter++;
            appendDisplayFormBtnTo(targetShelf);
            targetShelf.removeChild(getFirstDisplayFormBtnFrom(targetShelf));
        })
        anImport=false;
        exportToLocal();
    }
    else console.log('No data available.')          
}

function getFirstDisplayFormBtnFrom(shelf){
    return shelf.querySelector('.display-form-btn');
}

function localDataExists(){
    return (localStorage.getItem('save-data-viveyd')) ? true: false; 
}

function focusBook(){
    
}