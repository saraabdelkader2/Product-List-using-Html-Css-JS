//أول حاجه عايزه ألوب عشان اما أضغط علي زرار اد أعرف أنا ضعطت لأنهي عنصر بالضبط
const menuItem = document.querySelectorAll('.menu-item');
let cart = [];
loadCart();
const confirmButton = document.querySelector('.confirm');
const confirmInterface = document.querySelector('.order-confirmation');
const checkContainer = document.querySelector('.order');
const startButton = document.querySelector('.startButton');
menuItem.forEach(mItem => {

    //apply border to the selected  menu item
    hovering(mItem);
    const addButton = mItem.querySelector('.add-to-cart .add-item');
    const countControl = mItem.querySelector('.add-to-cart .add-count');
    const incrementButton = mItem.querySelector('.add');
    const decrementButton = mItem.querySelector('.subtract');
    let numberElement = mItem.querySelector('.number');
    const dessertId = mItem.querySelector('.product-info p').innerHTML.trim();
    const cartContainer = document.querySelector('.cart-items'); // المكان اللي هتحط فيه العناصر
    const totalItem = cartContainer.querySelector('.cart-item.total, .cart-item.iconed');

    const totalCount = cartContainer.querySelector('.totalReciept');

    //لما أعدي ع زرار الأد يخليني أكنترول
    addToggle(addButton, countControl);


    //determine the matched item
    countControl.addEventListener('click', () => {
        let cartItem = null;
        let matchingItem = null;
        //get full info of clicked item from data
        Desserts.forEach(dessert => {
            if (dessert.DessertId === dessertId) {
                matchingItem = dessert;
            }
        });

        // check if item already in cart

        cart.forEach(item => {
            if (item.itemId === matchingItem.DessertId) {
                cartItem = item;
            }
        });
        // if not in cart, push it
        if (!cartItem) {
            cartItem = {
                itemId: matchingItem.DessertId,
                itemName: matchingItem.DessertName,
                itemPrice: matchingItem.DessertPrice,
                itemImage: matchingItem.Dessert,
                itemCount: 1
            };
            cart.push(cartItem);
            saveCart();
        }

        // update numberElement once
        numberElement.innerHTML = cartItem.itemCount;

        // add increment/decrement listeners only once// امسحي أي event listeners قديمة
        incrementButton.onclick = null;
        decrementButton.onclick = null;
        incrementButton.onclick = () => {
            cartItem.itemCount++;

            numberElement.innerHTML = cartItem.itemCount;
            saveCart();
        };

        decrementButton.onclick = () => {
            if (cartItem.itemCount > 0) {
                cartItem.itemCount--;
                numberElement.innerHTML = cartItem.itemCount;
                saveCart();

            }
        };

        // نفرغ كل العناصر القديمة اللي مش total أو iconed
        cartContainer.querySelectorAll('.cart-item:not(.total):not(.iconed)').forEach(el => el.remove());

        // نضيف كل العناصر من الكارت
        cart.forEach((cartItem, index) => {

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                    <div class="cart-left">
                        <h4>${cartItem.itemName}</h4>
                         <div class="item-check">
                            <p class="danger">${cartItem.itemCount}x</p>
                             <p class="text-muted">@ $${cartItem.itemPrice}</p>
                            <p class="item-total">@ $${parseFloat(cartItem.itemCount) * parseFloat(cartItem.itemPrice)}</p>
                        </div>
                    </div>
                <div class="cart-right">
                    <span class="material-symbols-rounded close">close</span>
                 </div>
    `;
            updateTotal(cart, totalCount);
            // نضيفه قبل عناصر total و iconed
            cartContainer.insertBefore(itemDiv, totalItem);

            const itemremoved = itemDiv.querySelector('.close');
            itemremoved.addEventListener('click', () => {
                cart.splice(index, 1); // شيل العنصر من الكارت
                itemDiv.remove(); // شيل العنصر من الـ DOM
                updateCartNumber(cart);
                resetMenuCounts(cart)
                updateTotal(cart, totalCount);
                saveCart();

            });

            updateCartNumber(cart);
            rightInterface();

        });

    });



});
//when clicking confirm my order
confirmButton.addEventListener('click', () => {
    const totalConfirm = checkContainer.querySelector('.totall');

    confirmInterface.style.display = 'block';
    confirmButton.style.backgroundColor = ' #FAF5F0';
    confirmButton.style.border = '2px solid #C44F1C';
    confirmButton.style.color = '#C44F1C';
    let checkTotal = checkContainer.querySelector('.total');
    checkContainer.querySelectorAll('.order-item:not(.total)').forEach(el => el.remove()); // نضيف كل العناصر من الكارت
    cart.forEach((cartItem, index) => {

        const itemdiv = document.createElement('div');
        itemdiv.classList.add('order-item');
        itemdiv.innerHTML = `
                    <div class="left">
                    <img src="images/${cartItem.itemId}.jpg" alt="">
                    <div class="middle">
                        <p>${cartItem.itemName}
                        </p>
                        <div class="check">
                            <p class="danger">${cartItem.itemCount}x</p>
                            <p class="text-muted">@ $${cartItem.itemPrice}</p>
                        </div>
                    </div>
                </div>
                <div class="item-total right">$${parseFloat(cartItem.itemCount) * parseFloat(cartItem.itemPrice)}</div>
    `;
        updateTotal(cart, totalConfirm);
        // نضيفه قبل عناصر total و iconed
        checkContainer.insertBefore(itemdiv, checkTotal);



        updateCartNumber(cart);
        rightInterface();

    });

});
startButton.addEventListener("click", () => {

    // اقفل واجهة الـ confirm
    confirmInterface.style.display = 'none';

    // صفري الكارت
    cart = [];
    saveCart();

    // امسحي العناصر من cart UI
    document.querySelectorAll('.cart-item:not(.total):not(.iconed)')
        .forEach(el => el.remove());

    // صَفّري العداد فوق
    document.querySelector('.count').innerHTML = 0;

    // صَفّري التوتال
    document.querySelector('.totalReciept').innerHTML = 0;

    // رجّعي واجهة start
    rightInterfaceZ();

    // رجّعي كل menu items لحالتها الأصلية
    menuItem.forEach(item => {
        const number = item.querySelector('.number');
        const addBtn = item.querySelector('.add-item');
        const countControl = item.querySelector('.add-count');

        number.innerHTML = 0;
        countControl.style.display = "none";
        addBtn.style.display = "flex";
    });
});


//determine which right interface
function rightInterface() {
    let cartRecieptOld = document.querySelector('.start');
    let cartRecieptNew = document.querySelector('.end');
    cartRecieptOld.style.display = 'none';
    cartRecieptNew.style.display = 'block';
}
//update yourcart (quantity)
function updateCartNumber(cart) {
    let itemsNumber = document.querySelector('.count');

    let itemsTotalNumber = 0;
    cart.forEach(element => {
        itemsTotalNumber += element.itemCount;

    });
    itemsNumber.innerHTML = itemsTotalNumber;
}
//لما أضغط ع زرار الأد شكلها هيختفي ويبنلي الكنترول
function addToggle(addButton, countControl) {
    addButton.addEventListener('mouseover', () => {
        addButton.style.display = 'none';
        countControl.style.display = 'flex';

    });
}

//menu item hovering
function hovering(mItem) {
    mItem.addEventListener('mouseover', () => {

        mItem.classList.add('active');
    });
    mItem.addEventListener('mouseout', () => {

        mItem.classList.remove('active');
    });
}

//total counting
function updateTotal(cart, totalCount) {
    let sum = 0;
    cart.forEach(item => {
        sum += parseFloat(item.itemCount) * parseFloat(item.itemPrice);
    });
    totalCount.innerHTML = `$${ sum.toFixed(2) }`;
}

function resetMenuCounts(cart) {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(menu => {
        const id = menu.querySelector('.product-info p').textContent.trim();
        let exists = false;

        cart.forEach(item => {
            if (item.itemId === id) {
                exists = true;
            }
        });

        const number = menu.querySelector('.number');
        const addBtn = menu.querySelector('.add-item');
        const countControl = menu.querySelector('.add-count');

        // لو العنصر مش موجود في الكارت صفره
        if (!exists) {
            number.innerHTML = 0;
            countControl.style.display = "none";
            addBtn.style.display = "flex";
        }
    });
}

function rightInterfaceZ() {
    let cartRecieptOld = document.querySelector('.start');
    let cartRecieptNew = document.querySelector('.end');
    cartRecieptOld.style.display = 'block';
    cartRecieptNew.style.display = 'none';
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem("cart");
    if (saved) {
        cart = JSON.parse(saved);
    }
}

function clearCart() {
    localStorage.removeItem("cart");
    cart = [];

}
