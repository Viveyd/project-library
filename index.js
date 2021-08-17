let myLibrary = [];
let main = document.querySelector('main');
const addBtn = document.querySelector('#add-btn')
const newBtn = document.querySelector(`#newBook-btn`);
const newForm = document.querySelector('#newForm');

newBtn.addEventListener('click', () =>{
    if(newForm.getAttribute('data-hidden') == 'true'){
        newForm.style.display = 'flex';
        newForm.setAttribute('data-hidden', 'false');
    }
    else{
        newForm.style.display = 'none';
        newForm.setAttribute('data-hidden', 'true');
    }
    
});

addBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    let title = document.querySelector('#title-input');
    let author = document.querySelector('#author-input');
    let num = document.querySelector('#num-input');
    let read = document.querySelectorAll('input[name="read-status"]');
    let readVal;
    for(let radio of read){
        if(radio.checked == true){
            readVal = radio.value;
            break;
        }
    }
    addBookToLibrary(author.value,title.value, num.value, readVal);
    title.value='';
    title.focus();
    author.value='';
    num.value='';
    read.value='';
});

let Book = {
    init: function(author, title, numOfPages, readStatus){
        this.Author = author;
        this.Title = title;
        this['Number of Pages'] = numOfPages;
        this['Read Status'] = readStatus;
        return this;
    },
    create: function(){
        let newBook = Object.create(this);
        return newBook;
    }
}

//Initialize library.
fetchLibrary();

function fetchLibrary(){
    let locallyStoredBookCount = Object.keys(localStorage).length;
    for(let i = 0; i < locallyStoredBookCount; i++){
        let array = localStorage[`book${i}`].split(`.`);
        addBookToLibrary(array[0],array[1],array[2],array[3]);
    }
}

function addBookToLibrary(author,title,numOfPages,readStatus){
    let newBook = Book.create().init(author,title,numOfPages, readStatus);
    myLibrary.push(newBook);
    updateLibrary();
}

function updateLibrary(){
    if(document.querySelector('table'))main.removeChild(main.firstElementChild);
    buildLibrary();
}

function buildLibrary(){
    // Create a table
    let table = document.createElement('table');
    // Create thead to contain first row
    let thead = document.createElement('thead');
    // Create first row; Make a th element for every book property
    let headingRow = document.createElement('tr');
    for(let prop in myLibrary[0]){
        if(myLibrary[0].hasOwnProperty(prop)){
            let th = document.createElement('th');
            th.classList.add('table-cell');
            th.appendChild(document.createTextNode(prop));
            headingRow.appendChild(th);
        }   
    }
    //Adds the Actions heading.
    let deleteCol = document.createElement('th');
    deleteCol.appendChild(document.createTextNode('Actions'));
    headingRow.appendChild(deleteCol);
    thead.appendChild(headingRow);
    table.appendChild(thead);
    //Create tbody to contain remaining rows
    let tbody = document.createElement('tbody');
    //To be used as reference point when deleting rows and myLibrary objects(book)
    let index = 0;
    // Create next rows; Add a tr for each book of mylibrary
    for(let book of myLibrary){
        let tr = document.createElement('tr');
        //Add a td for each key in object(book)
        for(let prop in book){
            if(book.hasOwnProperty(prop)){
                let td = document.createElement('td');
                td.classList.add('table-cell');
                let bookPropVal = book[prop];
                td.textContent = bookPropVal;
                tr.appendChild(td);
            }
        }
        let actionsTd = document.createElement('td');
        //Attach delete button at the end of each row under actions column (x)
        let deleteBtn = document.createElement('button');
        deleteBtn.appendChild(document.createTextNode('Delete'));
        deleteBtn.addEventListener('click', ()=>{
            let rowIndex = Number(deleteBtn.parentElement.parentElement.getAttribute('data-index'));
            myLibrary.splice(rowIndex, 1);
            deleteBtn.parentElement.parentElement.removeChild(deleteBtn.parentElement);
            localStorage.clear();
            updateLibrary();
            if(myLibrary.length == 0) main.removeChild(main.firstElementChild);
        })
        actionsTd.appendChild(deleteBtn);
        //Attach read toggle under actions column
        let readBtn = document.createElement('button');
        readBtn.appendChild(document.createTextNode('Update'));
        readBtn.addEventListener('click', ()=>{
            //update the readstatus on the array index item corresponding to this row's index
            let rowIndex = Number(readBtn.parentElement.parentElement.getAttribute('data-index'));
            if(myLibrary[rowIndex].readStatus == 'finished') myLibrary[rowIndex].readStatus = 'unfinished'; 
            else  myLibrary[rowIndex].readStatus = 'finished'; 
            localStorage.clear();
            updateLibrary();
            
        })
        actionsTd.appendChild(readBtn);
        tr.appendChild(actionsTd);
        tr.setAttribute('data-index', `${index}`)
        tbody.appendChild(tr);
        index++;
    }
    table.appendChild(tbody);
    main.appendChild(table);
    saveLibrary();
}

function saveLibrary(){
    // Turn each object into a string and its properties into separated values
    let libLength = myLibrary.length;
    for(let i = 0; i < libLength; i++){
        let book = '';
        let lastProp = Object.keys(myLibrary[i])[Object.keys(myLibrary[i]).length-1];
        //Concatenate key values to the string
        for(let prop of Object.keys(myLibrary[i])){
            //if the current prop is the last prop then concatenate without the separator
            if(prop == lastProp) book+=`${myLibrary[i][prop]}`;
            else book+=`${myLibrary[i][prop]}.`;
        }
        //Store each book(string) to localStorage 
        console.log(book);
        localStorage.setItem(`book${i}`, book);
    }
}