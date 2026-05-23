const addButton = document.querySelector(".add-button");
const inputField = document.querySelector(".add-input");
const leftContainer = document.querySelector(".list");
const rightContainer = document.querySelector(".right-part");

let ids = 3;
const savedData = localStorage.getItem("data");
let allProducts;
if(savedData !== null){
    allProducts = JSON.parse(savedData);
}else{
    allProducts =[
        {id:0, name:"Помідори", quantity:2, isBought: false},
        {id:1, name:"Печиво", quantity:2, isBought: false},
        {id:2, name:"Сир", quantity:1, isBought: false}

    ];
}


function redrawApp( ){
    leftContainer.innerHTML = "";   //clean current list

    allProducts.forEach( product =>{
        let nameStyle;
        let productStatus;
        let quantityControls;

        if(product.isBought === true){
            nameStyle = "done";
            quantityControls = `<span class=\"quantity-label\">${product.quantity}</span>`;
            productStatus = `<button class="button-bought inactive" data-tooltip="товар ще не купили" data-id="${product.id}">Не куплено</button>`;
        }else{
            let minusColor = (product.quantity===1) ? "disabled" : "";
            nameStyle = " ";
            quantityControls = `
            <button class="button-minus ${minusColor}" ${minusColor} aria-label="Зменшити" data-tooltip="зменшити кількість" data-id="${product.id}">-</button>
            <span class=\"quantity-label\">${product.quantity}</span>
            <button class="button-plus" aria-label="Збільшити" data-tooltip="збільшити кількість" data-id="${product.id}">+</button>`;

            productStatus = `
            <button class="button-bought" data-tooltip="товар вже купили" data-id="${product.id}">Куплено</button>
            <button class="button-delete" aria-label="Видалити" data-tooltip="видалити товар зі списку" data-id="${product.id}">×</button>`;
        }
        let formProduct = `
        <hr/>
    <div class="products">
        <div class="product-name ${nameStyle}" data-id="${product.id}">${product.name}</div>
        <div class="product-controlers">
            ${quantityControls}
        </div>
        <div class="product-status">
            ${productStatus}
        </div>
    </div>
        `;
        leftContainer.insertAdjacentHTML("beforeend", formProduct);
    });
    redrawStatistics();
    saveData();
}


addButton.addEventListener("click",  (e) => {
    const name = inputField.value;
    if(name.trim().length > 0){
        const productInArray = {id:ids, name:name, quantity:1, isBought: false};
        ids++;
        allProducts.push(productInArray);

        redrawApp();

        inputField.value = "";
        inputField.focus();
    }else{
        alert("продукт не може мати порожню назву!");
        inputField.focus();
    }

});

leftContainer.addEventListener("click",  function(e) {
    const clickOn = e.target;
    if(clickOn.classList.contains("button-delete")){
        const id = parseInt(clickOn.dataset.id);
        allProducts = allProducts.filter( product => product.id !== id);
        redrawApp();
    }
    if(clickOn.classList.contains("button-plus")){
        const id = parseInt(clickOn.dataset.id);
        const index = allProducts.findIndex(product => product.id === id);
        allProducts[index].quantity ++;
        redrawApp();
    }
    if(clickOn.classList.contains("button-minus")){
        const id = parseInt(clickOn.dataset.id);
        const index = allProducts.findIndex(product => product.id === id);
        allProducts[index].quantity --;
        redrawApp();
    }
    if(clickOn.classList.contains("button-bought")){
        const id = parseInt(clickOn.dataset.id);
        const index = allProducts.findIndex(product => product.id === id);
        allProducts[index].isBought = !allProducts[index].isBought;
        redrawApp();
    }
    if(clickOn.classList.contains("product-name")){
        const id = parseInt(clickOn.dataset.id);
        const index = allProducts.findIndex(product => product.id === id);
     const currentName = clickOn.textContent;
     clickOn.innerHTML = `<input type="text" class="edit-input" value="${currentName}">`;
     const edit = clickOn.querySelector(".edit-input");
     edit.focus();
     edit.addEventListener("blur", function (e){
         const newName = edit.value;
         if(newName.trim().length > 0){
             allProducts[index].name = newName;
         }
         redrawApp();
     });
    }
});

function redrawStatistics(){
    let need = "";
    let had = "";
    allProducts.filter(product => product.isBought === false).forEach(product => {
        need += `
            <span class="product-item">${product.name}
                <span class="amount">${product.quantity}</span>
            </span>`;
    });

    allProducts.filter(product => product.isBought === true).forEach(product => {
        had += `
            <div class="badge-container">
                <span class="product-item done">${product.name}
                    <span class="amount done">${product.quantity}</span>
                </span>
            </div>`;
    });

    let formNeedAndHadList =`
        <div class="summary">
            <h2>Залишилося</h2>
            <hr/>
            ${need}
            <hr/>
            <h2>Куплено</h2>
            <hr/>
            ${had}
        </div>`;
    rightContainer.innerHTML = "";
    rightContainer.insertAdjacentHTML("beforeend", formNeedAndHadList);
}
function saveData(){
    localStorage.setItem("data", JSON.stringify(allProducts));

}
redrawApp(); // for first initialization to show statistics одразу





