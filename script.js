const navbar = document.querySelector(".navbar");
const btnOpenMenu = document.getElementById("btn-openMenu");
const btnCloseMenu = document.getElementById("btn-closeMenu");

const defaultCarousel = document.querySelector(".product-images");
const carouselImg = document.querySelector(".carousel__current-img");

const lightBox = document.querySelector(".lightbox");
const btnCloseLightBox = document.querySelector(".close-lightbox-button");

const productQuantity = document.querySelector(".order__quantity");
const increaseBtn = document.getElementById("increase-btn");
const decreaseBtn = document.getElementById("decrease-btn");
const addBtn = document.querySelector(".btn-add");
const cartBtn = document.querySelector(".cart__button");

let thumbnails;
let currentIndex = 0;

btnOpenMenu.addEventListener("click", () => navbar.classList.add("navbar--show"));
btnCloseMenu.addEventListener("click", () => navbar.classList.remove("navbar--show"));

carouselImg.addEventListener("click", () => lightBox.classList.add("lightbox--show"));

btnCloseLightBox.addEventListener("click", () => lightBox.classList.remove("lightbox--show"));

window.addEventListener("resize", () => {
    if(window.innerWidth >= 769)
        navbar.classList.remove("navbar--show");
    else if (window.innerWidth < 445)
        lightBox.classList.remove("lightbox--show");

    if(window.innerHeight < 640)
        lightBox.classList.remove("lightbox--show");
});

function updateCarousel(carousel){
    const carouselCurrentImg = carousel.querySelector(".carousel__current-img");
    thumbnails = Array.from(carousel.querySelectorAll(".thumbnail-img"));

    thumbnails.forEach(thumbnail => {
        if(thumbnails.indexOf(thumbnail) == currentIndex){
            thumbnail.classList.add("thumbnail-img--selected");
            carouselCurrentImg.src = `images/image-product-${currentIndex + 1}.jpg`;
        }
        else{
            thumbnail.classList.remove("thumbnail-img--selected");
        }
    });
}

document.addEventListener("click", (e) => {
    if(e.target.classList.contains("thumbnail-img")){
        const imagesContainer = e.target.parentElement.parentElement;
        thumbnails = Array.from(imagesContainer.querySelectorAll(".thumbnail-img"));

        currentIndex = thumbnails.indexOf(e.target);

        updateCarousel(defaultCarousel);
        updateCarousel(lightBox);
    }
    else if(e.target.classList.contains("carousel__button")){
        const imagesContainer = e.target.parentElement.parentElement;
        thumbnails = Array.from(imagesContainer.querySelectorAll(".thumbnail-img"));

        (e.target.classList.contains("carousel__button--previous")) ? currentIndex-- : currentIndex++;

        if((currentIndex) < 0)
            currentIndex = thumbnails.length - 1;
        
        if((currentIndex) >= thumbnails.length)
            currentIndex = 0;

        updateCarousel(defaultCarousel);
        updateCarousel(lightBox);
    }
    else if(e.target.classList.contains("btn-quantity")){
        let quantity = parseInt(productQuantity.textContent);

       (e.target.id == "increase-btn") ? quantity++ : quantity--;

        if(quantity < 0)
            quantity = 0;

        addBtn.disabled = (quantity <= 0); 
        productQuantity.textContent = quantity;
    }
});

addBtn.addEventListener("click", (e) => {
    const order = {
        name: document.querySelector(".product__name").textContent,
        price: parseFloat(document.querySelector(".price__total span").textContent), 
        quantity: parseInt(productQuantity.textContent),
        imgSrc: document.querySelector(".thumbnail-img img:first-child").src
    }

    if(order.quantity > 0){
        localStorage.setItem("cart", JSON.stringify(order));
        cartHTML();
    }
});

function cartHTML(){
    const cartProducts = document.querySelector(".cart__products");
    clearHTML(cartProducts);

    const product = JSON.parse(localStorage.getItem("cart"));

    if(!product){
        const emptyCartParagraph = document.createElement("p");
        emptyCartParagraph.textContent = "Your cart is empty.";
        cartProducts.appendChild(emptyCartParagraph);
        return;
    }

    const { name, price, quantity, imgSrc } = product;

    let numberSpan = document.querySelector(".cart__products-number");

    if(!numberSpan){
        numberSpan = document.createElement("span");
        numberSpan.classList.add("cart__products-number");
        cartBtn.appendChild(numberSpan);
    }
    
    numberSpan.textContent = quantity;
    
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    const productInfoDiv = document.createElement("div");
    productInfoDiv.classList.add("product__info");

    const productImg = document.createElement("img");
    productImg.classList.add("product__img");
    productImg.src = imgSrc;
    productImg.alt = name;

    const productName = document.createElement("p");
    productName.textContent = name;

    const productPrice = document.createElement("p");
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const productTotalPrice = document.createElement("span");
    productTotalPrice.classList.add("product__total");
    productTotalPrice.textContent = USDollar.format(price * quantity);
     
    productPrice.textContent = `${USDollar.format(price)} x ${quantity} `;
    productPrice.appendChild(productTotalPrice);

    productInfoDiv.append(productName, productPrice);

    const deleteProductBtn = document.createElement("button");
    deleteProductBtn.innerHTML = '<img src="images/icon-delete.svg" alt="Delete icon">';
    deleteProductBtn.onclick = deleteProduct;

    productDiv.append(productImg, productInfoDiv, deleteProductBtn);

    const checkoutButton = document.createElement("button");
    checkoutButton.classList.add("button-primary", "cart__checkout");
    checkoutButton.textContent = "Checkout";

    cartProducts.append(productDiv, checkoutButton);
}

cartBtn.addEventListener("click", () => {
    const cartContent = document.querySelector(".cart__content");
    cartContent.classList.toggle("cart__content--show");
});

function deleteProduct(){
    localStorage.removeItem("cart");
    document.querySelector(".cart__products-number").remove();
    cartHTML();
}

function clearHTML(container){
    while(container.firstChild) 
        container.removeChild(container.firstChild);
}

cartHTML();