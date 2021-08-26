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

//Used mainly in viewing/editing/deleting of books.

let editForm = document.querySelector('#edit-form');
let viewForm = document.querySelector('#view-form');
let authorArea = document.querySelector('#author-area');
let titleArea = document.querySelector('#title-area');
let dateArea = document.querySelector('#date-area');
let statusRadios = document.querySelectorAll('input[name="status-preview-radio"]');
let idArea = document.querySelector('#id-edit');
let previewElements = document.querySelectorAll('.book-preview');

const exitBook = document.querySelector('#exit-action');
exitBook.addEventListener('click', (e) => {
    e.preventDefault();
    switchMode(0)
});
const editBook = document.querySelector('#edit-action');
editBook.addEventListener('click', (e) => {
    e.preventDefault();
    switchMode(2)
});
const cancelEdit = document.querySelector('#cancel-edit');
cancelEdit.addEventListener('click', (e) => {
    e.preventDefault();
    returnViewMode();
    
});

const saveEdit = document.querySelector('#save-edit');
saveEdit.addEventListener('click', (e) =>{
    e.preventDefault();
    saveChanges();
});

const deleteBtn = document.querySelector('#delete-action');
deleteBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    let bookToDelete = yourLibrary.filter(book => book.id == previewElements[4].textContent.toLowerCase())[0];
    deleteThisBook(bookToDelete);
})


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
        if((bookShelf.childElementCount == 0 || bookShelf.childElementCount < 7) && hasNoAdd(bookShelf)){
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
function getFirstDisplayFormBtnFrom(shelf){
    return shelf.querySelector('.display-form-btn');
}

function localDataExists(){
    return (localStorage.getItem('save-data-viveyd')) ? true: false; 
}

// Adding book functions
function addBook(e){
    e.preventDefault();
    if(targetShelf.childElementCount == 0 || targetShelf.childElementCount <= 7){
        let formResults = getFormResults();
        let resultsArr = [];
        for(let result in formResults){
            resultsArr.push(formResults[result]);
        }
        addBookToShelf(resultsArr[0], targetShelf);
        addBookToLibrary(resultsArr[0], resultsArr[1], resultsArr[2], resultsArr[3], resultsArr[4]);
        removeExistingDisplayBtn(targetShelf);
        if(targetShelf.childElementCount<7)appendDisplayFormBtnTo(targetShelf);
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
    newBook.addEventListener('click', (e)=>{
    switchMode(1);
    previewBook(e);
    })
    newBook.addEventListener('mouseenter', previewBook);
    newBook.addEventListener('mouseleave', previewDefault);
    targetShelf.appendChild(newBook);
}

function addBookToLibrary(id, title, author, date, status){
    let newBook = Book.create().init(id, title, author, date, status)
    yourLibrary.push(newBook);
}

function removeExistingDisplayBtn(targetShelf){
    [... targetShelf.children].filter(child => child.classList.contains('display-form-btn')).map(button => targetShelf.removeChild(button));
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
        title: title.value.trim(),
        author: author.value.trim(),
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


// Delete function:


function deleteThisBook(bookObj){
    deleteFromLibraryArray(bookObj) ;
    refreshAllShelves();
    exportToLocal();
    alert('Successful delete!');
    switchMode(0);
}

function refreshAllShelves(){
    let allShelves = [... document.querySelector('#bookshelves-con').querySelectorAll('.book-shelf')]
    allShelves.forEach(shelf=>{
        while(shelf.firstElementChild) shelf.removeChild(shelf.firstElementChild);
    })
    let importCounter = 0;
    let anImport = true;
    yourLibrary.map(book => {
        let idPrefix = book.id.slice(0,1);
        let targetShelf = getShelfByPrefix(idPrefix);
        let idSuffix = [... targetShelf.children].filter(child => child.classList.contains('books')).length
        let id = `${idPrefix}${idSuffix}`;
        book.id = id;
        addBookToShelf(id, targetShelf, anImport, importCounter);
        importCounter++;
    });
    anImport = false;
    allShelves.forEach(shelf=>{
        if([... shelf.children].filter(child => child.classList.contains('books')).length <7)appendDisplayFormBtnTo(shelf);
    })
}

function deleteFromLibraryArray(book){
   let bookArrayIndex = yourLibrary.indexOf(book);
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
    // reset display first to make sure those that matched before will not stick if they do not match new search
    let allDisplayFormBtns = document.querySelectorAll('.display-form-btn');
    allDisplayFormBtns.forEach(btn => {
        btn.style.display = 'flex';
    })
    let shelfedBooks = [... document.querySelectorAll('.books')];
    shelfedBooks.map(book => book.style.visibility = 'visible');
    //get user input and chosen filter to
    let searchQuery = searchBar.value.trim().toLowerCase();
    let searchFilter = [... searchFilters].filter(filter => filter.checked == true)[0].value;
    if(searchQuery === '') return 0;

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
                        addBookToLibrary(sortedObj.id, sortedObj.title, sortedObj.author, sortedObj.date, sortedObj.status);
                    });
        let importCounter = 0;
        let anImport = true;
        yourLibrary.forEach(book =>{
            let targetShelf = getShelfByPrefix(book.id.slice(0,1));
            addBookToShelf(book.id, targetShelf, anImport, importCounter);
            importCounter++;
            if([... targetShelf.children].filter(child => child.classList.contains('books')).length <7) appendDisplayFormBtnTo(targetShelf);
            targetShelf.removeChild(getFirstDisplayFormBtnFrom(targetShelf));
        })
        anImport=false;
        exportToLocal();
    }
    else console.log('No data available.')          
}


// For preview/view/edit of book
function switchMode(mode){
    let allDisplayFormBtns = document.querySelectorAll('.display-form-btn');
    let actionBar = document.querySelector('#action-bar-1');
    let books = [... document.querySelectorAll('.books')];
    // Preview mode
    if(mode == 0){
        previewElements[1].style.flexBasis = '45%';
        previewElements[2].style.flexBasis = '12.5%';
        previewElements[3].style.flexBasis = '12.5%';
        previewElements[4].style.flexBasis = '15%';
        actionBar.style.display = 'none';
        books.forEach(book => {
            book.addEventListener('mouseenter', previewBook);
            book.addEventListener('mouseleave', previewDefault);
        })
        
        allDisplayFormBtns.forEach(btn => {
        btn.style.display = 'flex';
        })
    }
    // View mode
    else if(mode == 1){
        allDisplayFormBtns.forEach(btn => {
            btn.style.display = 'none';
        })
        previewElements[1].style.flexBasis = '42.5%';
        previewElements[2].style.flexBasis = '10%';
        previewElements[3].style.flexBasis = '10%';
        previewElements[4].style.flexBasis = '12.5%';
        previewElements[4].style.marginBottom = '0%';
        actionBar.style.display = 'flex';
        books.forEach(book => {
            book.removeEventListener('mouseenter', previewBook);
            book.removeEventListener('mouseleave', previewDefault);
        })
    }
    // Edit mode
    else{
        authorArea.value = previewElements[0].textContent;
        titleArea.value = previewElements[1].textContent;
        dateArea.value = previewElements[2].textContent;
        (previewElements[3].textContent == 'Finished') ? statusRadios[0].checked = true: statusRadios[1].checked = true;
        idArea.textContent = previewElements[4].textContent;
        viewForm.style.display = 'none';
        editForm.style.display = 'flex';
    }
}

function saveChanges(){
    yourLibrary.some(book => {
        if(book.id == idArea.textContent){
            book.author = authorArea.value.trim();
            book.title = titleArea.value.trim();
            book.date = dateArea.value;
            book.status = (statusRadios[0].checked == true) ? 'Finished': 'Unfinished';
            return true;
        }
    })
    
    exportToLocal();
    let shelf = getShelfByPrefix(idArea.textContent.slice(0,1));
    refreshShelf(shelf);
    updateViewMode();
    returnViewMode();
    alert('Changes saved!');
}

function refreshShelf(shelf){
    let shelfPrefix = shelf.getAttribute('id').slice(11);
    let shelfBooks = yourLibrary.filter(book => book.id.slice(0,1) == shelfPrefix);
    while(shelf.firstElementChild.classList.contains('books')) shelf.removeChild(shelf.firstElementChild);
    let importCounter = 0;
    let anImport = true;
    shelfBooks.forEach(book => {
        addBookToShelf(book.id, shelf, anImport, importCounter);
        [... shelf.children].filter(child => child.classList.contains('books'))[importCounter].setAttribute('data-library-index', `${yourLibrary.indexOf(book)}`);
        importCounter++;
    })
    anImport = false;
    appendDisplayFormBtnTo(shelf);
    shelf.removeChild(getFirstDisplayFormBtnFrom(shelf));
}

function updateViewMode(){
    previewElements[0].textContent = authorArea.value
    previewElements[1].textContent = titleArea.value;
    previewElements[2].textContent = dateArea.value;
    previewElements[3].textContent == (statusRadios[0].checked == true) ? 'Finished': 'Unfinished';
}

function returnViewMode(){
    let allDisplayFormBtns = document.querySelectorAll('.display-form-btn');
    switchMode(1);
    viewForm.style.display = 'flex';
    editForm.style.display = 'none';
    allDisplayFormBtns.forEach(btn => {
        btn.style.display = 'flex';
    })
}
