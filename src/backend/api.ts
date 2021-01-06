import { Router } from "https://deno.land/x/oak@v6.4.0/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
import { Product } from "../common/types.ts";

// Session konfigurieren und starten
const session = new Session({ framework: "oak" });
await session.init();
export const usableSession = session.use()(session);

async function loadProducts(): Promise<Product[]> {
    const jsonFile = await Deno.readTextFile(`${Deno.cwd()}/src/backend/data/products.json`);
    return JSON.parse(jsonFile);
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
    });


export const api = router.routes();