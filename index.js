let myLibrary = [{title: 'Bookoto', author: 'Roboto', numOfPages: 9, readStatus: 'Finished'}, {title: 'Bookoto', author: 'Roboto', numOfPages: 9, readStatus: 'Finished'}, {title: 'Bookoto', author: 'Roboto', numOfPages: 9, readStatus: 'Finished'}];
let main = document.querySelector('main');
let addBtn = document.querySelector('#add-btn')
buildLibrary();

let Book = {
    init: function(author, title, numOfPages, readStatus){
        this.author = author;
        this.title = title;
        this.numOfPages = numOfPages;
        this.readStatus = readStatus;
        return this;
    },
    create: function(){
        let newBook = Object.create(this);
        return newBook;
    }
}

function buildLibrary(){
    // Create a table
    let table = document.createElement('table');
    // Create thead to contain first row
    let thead = document.createElement('thead');
    

    // Create first row; Make a th element for every book property
    let headingRow = document.createElement('tr');
    for(let prop in myLibrary[0]){
        let th = document.createElement('th');
        th.classList.add('table-cell');
        th.appendChild(document.createTextNode(prop));
        headingRow.appendChild(th);
    }
    let delBtn = document.createElement('button');
    //delBtn.
    thead.appendChild(headingRow);
    table.appendChild(thead);

    //Create tbody to contain remaining rows
    let tbody = document.createElement('tbody');

    // Create next rows; Add a tr for each book of mylibrary
    for(let book of myLibrary){
        let tr = document.createElement('tr');
        //Add a td for each key in object(book)
        for(let prop in book){
            let td = document.createElement('td');
            td.classList.add('table-cell');
            let bookPropVal = book[prop];
            if(book.hasOwnProperty(prop))td.textContent = bookPropVal;
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    main.appendChild(table);
}



function addBookToLibrary(author,title,numOfPages,readStatus){
    let newBook = Book.create().init('Sample','Mr. Sample',5, 'Hiatus');
    myLibrary.push(newBook);
    updateLibrary();
}

function updateLibrary(){
    main.removeChild(main.firstElementChild);
    buildLibrary();
}

function changeRead(){

}