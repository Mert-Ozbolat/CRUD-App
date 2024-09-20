// ! HTML ELEMANLAARINI ÇAĞIRMA
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

let editMode = false;
let editItem;
let editItemId;

// * ADD ITEM
const addItem = (e) => {
    e.preventDefault(); // Formun varsayılan davranışını durdurur
    const value = input.value;
    if (value !== '' && !editMode) {
        const id = new Date().getTime().toString();
        createElement(id, value);
        setToDefault();
        showAlert("Element Added", "success");
        addToLocalStore(id, value); // Veriyi LocalStorage'a ekle
    } else if (value !== '' && editMode) {
        editItem.innerHTML = value;
        showAlert("Updated", "success");

        // LocalStorage'da güncelle
        let items = getFromLocalStorage();
        items = items.map(item => {
            if (item.id === editItemId) {
                item.value = value;
            }
            return item;
        });
        localStorage.setItem('items', JSON.stringify(items)); // Güncellenmiş veriyi LocalStorage'a kaydet

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

    // LocalStorage'dan sil
    let items = getFromLocalStorage();
    items = items.filter(item => item.id !== id); // Silinen elemanı LocalStorage'dan çıkar
    localStorage.setItem('items', JSON.stringify(items));

    showAlert("Element Deleted", "danger");


    if (!itemList.children.length) {
        clearBtn.style.display = "none";
    }
};




// * Clear All
const clearAll = () => {
    itemList.innerHTML = ''; // Tüm listeyi temizle
    showAlert("All Deleted", "danger");
    localStorage.removeItem('items'); // LocalStorage'daki tüm öğeleri kaldır
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

// * Render Items (LocalStorage'daki verileri ekrana döker)
const renderItems = () => {
    let items = getFromLocalStorage(); // LocalStorage'dan verileri al
    if (items.length > 0) {
        items.forEach((item) => createElement(item.id, item.value)); // Her bir item'i ekrana yaz
    }
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
};

// * Localstorage'a veri ekleme
const addToLocalStore = (id, value) => {
    const item = { id, value }; // Yeni item
    let items = getFromLocalStorage(); // Mevcut veriyi al
    items.push(item); // Yeni item'i ekle
    localStorage.setItem('items', JSON.stringify(items)); // LocalStorage'a geri kaydet
};


//* Local Update
const updateLocalStorage = (id, newValue) => {
    let items = getFromLocalStorage();
    items = items.map((item) => {
        if (item.id === id) {
            return { ...item, value: newValue };
        }
        return item;
    });
    localStorage.setItem("items", JSON.stringify(items));
};




// * Verileri LocalStorage'dan al
const getFromLocalStorage = () => {
    return localStorage.getItem("items")
        ? JSON.parse(localStorage.getItem("items")) // LocalStorage'da veri varsa parse et
        : []; // Yoksa boş bir dizi döndür
};

// ? Olay izleyicisi
form.addEventListener("submit", addItem);

// Sayfa yüklendiğinde render ve clear all butonunu bağlama
window.addEventListener("DOMContentLoaded", () => {
    renderItems(); // LocalStorage'daki verileri ekrana yazdır
    const clearBtn = document.querySelector(".clear-btn");
    clearBtn.addEventListener("click", clearAll); // Tüm verileri sil
});
