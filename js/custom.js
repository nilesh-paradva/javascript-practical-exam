let inputId = document.getElementById("id");
let name = document.getElementById("title");
let price = document.getElementById("price");
let category = document.getElementById("category");
let dataView = document.getElementById("data-view");
let selectView = document.getElementById("Select-view");
let dataCount = document.getElementById("count");
let findInput = document.getElementById("search");

const getStorageData = (storagedata) => JSON.parse(localStorage.getItem(storagedata)) || [];
let storage = getStorageData("dataView");
let selectStorage = getStorageData("selectView");

const submitProduct = () => {
    event.preventDefault();
    const id = inputId.value || Math.floor(Math.random() * 10000);
    let obj = { Id: id, Titel: name.value, Price: price.value, Category: category.value };
    storage = inputId.value ? storage.map((data) => data.Id == id ? obj : data) : [...storage, obj];
    localStorage.setItem("dataView", JSON.stringify(storage));

    dataShow();
    inputId.value = name.value = price.value = category.value = "";
}

const dataShow = () => {
    dataView.innerHTML = storage.map((data) => `<tr>
            <td><img src="images/1.jpg" alt="" width="100px" class="img-fluid rounded-4"></td>
            <td>${data.Titel}</td>
            <td>${data.Price}</td>
            <td>${data.Category}</td>
            <td><a href="javascript:void(0)" class="btn btn-primary me-2" onclick="return dataSelect(${data.Id})">Select</a><a href="javascript:void(0)" class="btn btn-info me-2" onclick="return dataEdit(${data.Id})">Edit</a><a href="javascript:void(0)" class="btn btn-danger me-2" onclick="return dataDelet(${data.Id})">Delete</a></td>
        </tr>
    `).join("");
}

const dataDelet = (id) => {
    localStorage.setItem("dataView", JSON.stringify(storage = storage.filter(({ Id }) => Id != id))), dataShow();
}

const dataEdit = (id) => {
    let editId = storage.find(({ Id }) => Id == id);
    if (editId) {
        ({ Id: inputId.value, Titel: name.value, Price: price.value, Category: category.value } = editId);
    } else {
        alert("data not edit");
    }
}

const chengQunti = (id, change) => {
    selectStorage = selectStorage.map((data) => {
        if (data.Id == id) {
            return { ...data, Quntity: Math.max((data.Quntity || 1) + change, 1) };
        } else {
            return data;
        }
    });
    localStorage.setItem("selectView", JSON.stringify(selectStorage));
    seleShow();
}

const count = () => dataCount.innerHTML = selectStorage.length;
const tPrice = () => (selectStorage.reduce((total, item) => total + (item.Price || 0) * (item.Quntity || 1), 0));

const dataSelect = (id) => {
    let selectId = storage.find(({ Id }) => Id == id);
    if (selectId && !selectStorage.some(({ Id }) => Id == id)) {
        (selectStorage = [...selectStorage, { ...selectId }], localStorage.setItem("selectView", JSON.stringify(selectStorage)));
    } else {
        alert("data already exists...");
    }
    seleShow();
    count();
}

const seleShow = (filteredData = selectStorage) => {
    selectView.innerHTML = filteredData.map((data) => `<tr>
            <td><img src="images/1.jpg" alt="" width="100px" class="img-fluid rounded-4"></td>
            <td>${data.Titel}</td>
            <td>${data.Category}</td>
            <td>${data.Price}</td>
            <td><a href="#" class="btn btn-warning me-2" onclick="return chengQunti(${data.Id}, 1)">+</a>${data.Quntity || 1}<a href="#" class="btn btn-success ms-2" onclick="return chengQunti(${data.Id}, -1)">-</a></td>
            <td><a href="#" class="btn btn-danger me-2" onclick="return selectDelet(${data.Id})">Delete</a></td>
        </tr>
    `).join("");
    const totalprice = tPrice();
    document.getElementById("total-price").innerHTML = `Total Price :- ₹ ${totalprice.toFixed(2)}`;
}

const selectDelet = (id) => {
    localStorage.setItem("selectView", JSON.stringify(selectStorage = selectStorage.filter(({ Id }) => Id != id))), seleShow(), count();
}

const findAlldata = () => {
    const inputValue = findInput.value.toLowerCase();
    const filterData = selectStorage.filter(({ Titel, Category }) => {
        return Titel.toLowerCase().includes(inputValue) || Category.toLowerCase().includes(inputValue);
    });
    seleShow(filterData);
}

findInput.addEventListener("input", findAlldata);

dataShow();
seleShow();
count();