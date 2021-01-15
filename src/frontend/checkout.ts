/// <reference lib="dom" />

export async function deleteCart() {

const inputVorname = document.getElementById('vorname');
const inputNachname = document.getElementById('nachname');
const inputEmail = document.getElementById('email');

if(inputVorname.value == '' || inputNachname.value == '' || inputEmail.value == ''){
    alert('Bitte Formular ausfüller!');
} else {
    const response = await fetch("/api/cart", {
        method: "delete",
      });
    
      if (response.status == 200) {
        location.href = "/page1.html";
        alert("Bestellung abgesendet.");
      } else {
        alert(await response.text());
      }
}
}
