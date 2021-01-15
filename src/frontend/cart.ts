/// <reference lib="dom" />

import { Product, Cart, Item } from "../common/types.ts";

export async function loadCart() {
    const resp = await fetch("/api/cart");
    const cart: Cart = await resp.json()
    const cartItems: Item[] = cart.items;

    const cartTable = document.getElementById("cartTable");
    cartTable.innerHTML = `
    <tr>
        <th>Item</th>
        <th>Unit price</th>
        <th>Amount</th>
        <th>Total</th>
    </tr>`

    cartItems.forEach(async function (cartItem) {
        const resp = await fetch(`/api/products/${cartItem.id}`);
        const item: Product = await resp.json();

        const tr: Node = createRow(cartItem, item);
        cartTable.appendChild(tr);
    });

    const totalPrice  = document.getElementById("footer");
    totalPrice.innerText = cart.price.toString();

    const miniCart = document.getElementById('totalPrice');
    miniCart.innerText = cart.price.toString();
}

function createRow(item: Item, product: Product): Node{
    const tr = document.createElement("tr");

    const name = document.createElement("td");
    name.innerText = product.productName;

    const amount = document.createElement("td");
    const p = document.createElement("p");
    const btnMinus = document.createElement("button");
    const btnPlus = document.createElement("button");
    p.innerText = item.amount.toString();
    btnMinus.innerText = "-";
    btnMinus.id = product.id.toString();
    btnMinus.addEventListener("click", async (e) => {
        e.preventDefault()
        await minusProduct(parseInt(btnMinus.id))
    });

    btnPlus.innerText = "+";
    btnPlus.id = product.id.toString();
    btnPlus.addEventListener("click", async (e) => {
        e.preventDefault()
        await plusProduct(parseInt(btnPlus.id))
    });
    amount.appendChild(btnMinus);
    amount.appendChild(p);
    amount.appendChild(btnPlus);

    const price = document.createElement("td");
    price.innerText = (product.specialOffer.toFixed(2)).toString();

    const totalPrice = document.createElement("td");
    totalPrice.innerText = "CHF " + ((item.amount * product.specialOffer).toFixed(2)).toString();

    tr.appendChild(name);
    tr.appendChild(amount);
    tr.appendChild(price);
    tr.appendChild(totalPrice);

    return tr;
}

async function minusProduct(id: number){
    await fetch(`/api/cart/${id}`, { 
        method: "delete" 
    });
    await loadCart();
}

async function plusProduct(id: number){
    await fetch(`/api/cart/${id}`, { 
        method: "post" 
    });
    await loadCart();
}