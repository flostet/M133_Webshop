/// <reference lib="dom" />

import { Product } from "../common/types.ts";

export async function loadProducts() {
    const response = await fetch("/api/products");
    const products: Product[] = await response.json();

    const productView = document.getElementById("productView");

    products.forEach(product => {
        productView.appendChild(createCard(product));
    })
}

function createCard(product: Product): Node{
    const div = document.createElement("div");
    const a = document.createElement("a");
    const img = document.createElement("img");
    const price = document.createElement("s");
    const specialOffer = document.createElement("a");
    div.appendChild(img);
    const textDiv = document.createElement("div");
    div.appendChild(textDiv);
    const text = document.createElement("p");
    textDiv.appendChild(text);
    a.appendChild(div);
    img.src = product.imageName;
    textDiv.appendChild(price);
    const priceBreak = document.createElement("br");
    textDiv.appendChild(priceBreak);
    textDiv.appendChild(specialOffer);

    price.id = "productPrice";
    div.id = "productDiv";
    a.href = `detail.html?productId=${product.id}`
    a.id = "link";

    text.innerText = product.productName;
    price.innerText = product.normalPrice.toFixed(2);
    specialOffer.innerText = product.specialOffer.toFixed(2);

    return a;
}