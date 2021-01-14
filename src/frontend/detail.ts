/// <reference lib="dom" />

import { Product } from "../common/types.ts";

export async function loadDetail() {
    const id = new URLSearchParams(window.location.search).get("productId");
    console.log(id);
    const response = await fetch(`/api/products/${id}`);
    const product: Product = await response.json();

    console.log(product.productName);

    document.getElementById("productName").textContent = product.productName;
    document.getElementById("productImage").setAttribute("src", product.imageName);
    document.getElementById("productDescription").textContent = product.description;
    document.getElementById("productPrice").textContent = "Kostet: " + product.normalPrice + " CHF";
}

export async function addToCart() {
    const urlParams = new URLSearchParams(window.location.search).get("productId");
    console.log(urlParams);
    await fetch(`/api/cart/${urlParams}`, {
        method: "post"
    });

    await loadMiniCart();
}

export async function loadMiniCart(){
    const response = await fetch("/api/cart");
    const totalPrice = (await response.json()).price;
    const miniCart = document.getElementById("totalPrice");
    miniCart.innerText = totalPrice;
}