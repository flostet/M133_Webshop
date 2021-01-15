/// <reference lib="dom" />

export async function deleteCart() {
    const response = await fetch("/api/cart", {
        method: "delete"
    });

    if (response.status == 200) {
        location.href = "/page1.html";
        alert("Bestellung abgesendet.");
    } else {
        alert(await response.text());
    }
}