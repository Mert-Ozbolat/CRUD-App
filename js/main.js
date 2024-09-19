// ! HTML ELEMANLAARINI ÇAĞIRMA
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");



let editMode = false;
let editItem;
let editItemId;


// * ADD ITEM
const addItem = (e) => {
    e.preventDefault(); // Form yazısını tutar
    const value = input.value;
    if (value !== '' && !editMode) {
        const id = new Date().getTime().toString();
        createElement(id, value);
        setToDefault();
        showAlert("Element Added", "success");
        addToLocalStore(id, value);
    } else if (value !== '' && editMode) {
        editItem.innerHTML = value;
        showAlert("Updated", "success");
        setToDefault();
    }
};


// * Show Alert
const showAlert = (text, action) => {
    alert.textContent = `${text}`;
    alert.classList.add(`alert-${action}`);
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
};

// * Remove Element
const deleteItem = (e) => {
    // Silmek istenen elemana eriş
    const element = e.target.parentElement.parentElement.parentElement;
    const id = element.dataset.id;
    // Bu elemanı kaldır
    itemList.removeChild(element);
    showAlert("Element Deleted", "danger");
};


// * Clear All
const clearAll = (e) => {
    itemList.innerHTML = '';
    showAlert("All Deleted", "danger");
    localStorage.removeItem('items');
    setToDefault();
};



// * Elemanları Güncelle
const editItems = (e) => {
    const element = e.target.parentElement.parentElement.parentElement;
    editItem = e.target.parentElement.parentElement.previousElementSibling;
    input.value = editItem.innerText;
    editMode = true;
    editItemId = element.dataset.id;
    addButton.textContent = "Edit";
};


// * Default Settings
const setToDefault = () => {
    input.value = '';
    editMode = false;
    editItemId = "";
    addButton.textContent = "Add";
};


// * Eleman Oluşturma
const createElement = (id, value) => {
    // yeni bir div oluşturuldu
    const newDiv = document.createElement("div");
    newDiv.setAttribute("data-id", id); // attribibute eklendi
    newDiv.classList.add("item-list-item");
    newDiv.innerHTML = `
            <p class="item-name">${value}</p>
                <div class="btn-container">
                <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                </div>
    `;
    const deleteBtn = newDiv.querySelector(".delete-btn"); // Delete
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = newDiv.querySelector(".edit-btn"); // Edit Button
    editBtn.addEventListener('click', editItems);

    itemList.appendChild(newDiv); // İçine ekler
    showAlert("Element Added", "success");

    const clearBtn = document.querySelector(".clear-btn");
    clearBtn.addEventListener("click", clearAll);
};


// * Localstorage 
const addToLocalStore = (id, value) => {
    const item = { id, value };
    localStorage.setItem('items', JSON.stringify(item));
};

// ? Olay izleyicisi
form.addEventListener("submit", addItem);
