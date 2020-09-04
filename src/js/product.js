// variables 
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');

// cart
let cart = [];

//buttons
let buttonsDOM = [];

// getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch('http://localhost:3000/api/teddies');
            // result in json format
            let products = await result.json(); 
            // destructuring json 
            products = products.map(item =>{
                const name = item.name;
                const description = item.description;
                const price = item.price;
                const image = item.imageUrl;
                const id = item._id;
                // return clean objet
                return {name, description, price, image, id};
            });           
            return products;            
        } catch (error) {
            console.log(error);
        }        
    }
}

// display products
class UI { 
    displayProducts() {        
        
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);

            const image = urlParams.get('image');
            const name = urlParams.get('name');
            const description = urlParams.get('description');
            const price = urlParams.get('price');
            const id = urlParams.get('id');

            const productDOM = document.querySelector('.row');
            productDOM.innerHTML += `  
        <img class="col-md-8" src=${image} alt="teddy bear ${name}" />           
        
        <section class="col-md-4">
            <h1>
                ${name}
            </h1>            
            <p>
                ${description}
            </p>                    
            <p>
                ${price / 100} €
            </p>
            <button type="button" class="bag-btn btn-block btn-dark py-2" data-id=${id}>
                <svg class="text-light bi bi-basket2" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M1.111 7.186A.5.5 0 0 1 1.5 7h13a.5.5 0 0 1 .489.605l-1.5 7A.5.5 0 0 1 13 15H3a.5.5 0 0 1-.489-.395l-1.5-7a.5.5 0 0 1 .1-.42zM2.118 8l1.286 6h9.192l1.286-6H2.118z"/>
                        <path fill-rule="evenodd" d="M11.314 1.036a.5.5 0 0 1 .65.278l2 5a.5.5 0 1 1-.928.372l-2-5a.5.5 0 0 1 .278-.65zm-6.628 0a.5.5 0 0 0-.65.278l-2 5a.5.5 0 1 0 .928.372l2-5a.5.5 0 0 0-.278-.65z"/>
                        <path d="M4 10a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0v-2zm3 0a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0v-2zm3 0a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0v-2zM0 6.5A.5.5 0 0 1 .5 6h15a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-1z"/>
                </svg>                
                        ADD                
            </button>
        </section> 
    </article>`;
               
    }
    getBagButtons() {
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = buttons;
        buttons.forEach(button =>{
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart) {
                //button.innerText = "In Cart";                
                button.disabled = true;
            }
            button.addEventListener('click',(event)=>{
                event.target.innerText = "In Cart";                
                // allow just one of each product in cart
                event.target.disabled = true;
                // get product from products
                let cartItem = {...Storage.getProduct(id),amount:1};                
                // add product to the cart
                cart = [...cart,cartItem];                
                // save cart in local storage
                Storage.saveCart(cart);                
                // set cart values
                this.setCartValues(cart);                                           
                });            
        });
    } 
    setCartValues(cart){        
        let itemsTotal = 0;
        cart.map(item =>{            
            itemsTotal += item.amount;
        });        
        cartItems.innerText = itemsTotal;        
    }        
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart); 
        this.populateCart(cart);          
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
      }
}

// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart() {
        // check if items exist, if not nothing change
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}

document.addEventListener("DOMContentLoaded", ()=> {
    const ui = new UI();
    const products = new Products();
    // setup app
    ui.setupAPP();

    // get all products
    products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
    });
});