import { Router } from "https://deno.land/x/oak@v6.4.0/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
import { Product, Cart, Item } from "../common/types.ts";

// Session konfigurieren und starten
const session = new Session({ framework: "oak" });
await session.init();
export const usableSession = session.use()(session);

async function loadProducts(): Promise<Product[]> {
    const jsonFile = await Deno.readTextFile(`${Deno.cwd()}/src/backend/data/products.json`);
    return JSON.parse(jsonFile);
}

async function getCartTotal(cart: Cart): Promise<number> {
    let total = 0;
    cart.items.forEach(async item => {
        const index = products.findIndex(p => p.id == item.id);
        const price = products[index].specialOffer;
        total += price * item.amount;
    });
    total = +total.toFixed(2);
    return total;
}

const products: Product[] = await loadProducts();

const router = new Router();
router
    .get("/api/products", async context => {
        context.response.body = products;
    })
    .get("/api/products/:id", async context => {
        const index = products.findIndex(p => p.id.toString() == context.params.id);
        if (index >= 0){
            context.response.body = products[index];
        } else {
            context.response.status = 404;
            context.response.body = `Product with ID: ${context.params.id} not found`;
        }
    })
    .get("/api/images/:image", async context => {
        const image = await Deno.readFile(`${Deno.cwd()}/src/backend/data/images/${context.params.image}`);
        context.response.body = image;
        context.response.headers.set('Content-Type', 'image/png');
    })
    .get("/api/cart", async context => {
        if (await context.state.session.get("cart") == undefined) {
            let cart: Cart = {
                price: 0,
                items: []
            };
            await context.state.session.set("cart", cart);
        }
        const cart = await context.state.session.get("cart");
        context.response.body = cart;
    })
    .post("/api/cart/:id", async context => {
        const id:Number = Number(context.params.id);
        if (id != undefined && products.findIndex(p  => p.id == id) >= 0) {
            var cart = await context.state.session.get("cart");
            if (cart == undefined) { 
                cart = {
                    price: 0,
                    items: []
                };
                await context.state.session.set("cart", cart);
            }
            const index = cart.items.findIndex((item: Item) => item.id == id);
            if (cart.items[index] == undefined) {
                cart.items.push({ amount:1, id:id });
            } else {
                cart.items[index].amount += 1;
            }
            cart.price = await getCartTotal(cart);
            context.state.session.set("cart", cart);
            context.response.status = 200;
            context.response.body = cart;
        } else {
            context.response.status = 404;
        }
    })
    .delete("/api/cart/:id", async context => {
        const id = Number(context.params.id);
        const cart = await context.state.session.get("cart");
        const index = cart.items.findIndex((item: Item) => item.id == id);
        if (id != undefined && index >= 0) {
            if (cart.items[index].amount == 1) {
                cart.items = cart.items.filter((item: Item) => item.id !== id);
            } else {
                cart.items[index].amount -= 1;
            }
            cart.price = await getCartTotal(cart);
            context.state.session.set("cart", cart);
            context.response.status = 200;
            context.response.body = cart;
        } else {
            context.response.status = 404;
        }
    })
    .delete("/api/cart", async context => {
        const cart: Cart = await context.state.session.get("cart");
        if (cart.price == 0) {
            context.response.status = 400;
            context.response.body = "Warenkorb leer";
        } else if (cart.price != 0) {
            context.state.session.set("cart", {
                price: 0,
                items: []
            });
            context.response.status = 200;
            context.response.body = context.state.session.get("cart");
        } else {
            context.response.status = 400;
            context.response.body = 'Bestellung konnte nicht abgeschlossen werden'
        }
    });


export const api = router.routes();