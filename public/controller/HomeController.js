import { HomeModel } from "../model/HomeModel.js";
import { currentUser } from "./firebase_auth.js";
import { Inventory } from "../model/Inventory.js";
import {
    addInventory,
    updateInventoryById,
    deleteInventoryById,
    getInventoryQtyById,
    inventoryItemExists,
} from "./firestore_controller.js";
import { startSpinner, stopSpinner } from "../view/util.js";

export class HomeController {
    model = null;
    view = null;

    constructor() {
        this.model = new HomeModel();
        this.onSubmitCreateItem = this.onSubmitCreateItem.bind(this);
        this.onClickMinusButton = this.onClickMinusButton.bind(this);
        this.onClickPlusButton = this.onClickPlusButton.bind(this);
        this.onClickUpdateButton = this.onClickUpdateButton.bind(this);
        this.onClickCancelButton = this.onClickCancelButton.bind(this);
    }

    setView(view) {
        this.view = view;
    }

    async onSubmitCreateItem(e) {
        e.preventDefault();
        const email = currentUser.email;
        const name = e.target.itemName.value.toLowerCase();
        const qty = 1;
        const timestamp = Date.now();

        // Check for duplicate
        const exists = await inventoryItemExists(email, name);
        if (exists) {
            alert(`${name} already exists! Update quantity instead.`);
            return;
        }

        const item = new Inventory(email, name, qty, timestamp);

        startSpinner();
        // disable btnCreate and change button text to Wait...
        const btn = document.getElementById('btnCreate');
        btn.disabled = true;
        btn.textContent = "Wait...";
        try {
            const docId = await addInventory(item.toFirestore());
            stopSpinner();
            // enable btnCreate and change button text back to Create
            btn.disabled = false;
            btn.textContent = "Create";
            item.set_docId(docId);
            this.model.addNewInventory(item);
            this.view.render();
        } catch (error) {
            stopSpinner();
            console.error('Error adding inventory: ', error);
            alert('Error adding inventory' + error);
        }

    }

    onClickMinusButton(e) {
        const itemName = e.target.dataset.name;
        const item = this.model.getInventoryByName(itemName);

        if (item.qty > 0) {
            item.qty--;
            const qtyElement = document.getElementById(`qty-${item.name}`);
            qtyElement.textContent = item.qty;

        } else {
            alert('Could not reduce item count below 0!');
        }
    }

    onClickPlusButton(e) {
        const itemName = e.target.dataset.name;
        const item = this.model.getInventoryByName(itemName);

        item.qty++;
        const qtyElement = document.getElementById(`qty-${item.name}`);
        qtyElement.textContent = item.qty;
    }

    async onClickUpdateButton(e) {
        const itemName = e.target.dataset.name;
        const item = this.model.getInventoryByName(itemName);

        if (item.qty != 0) {
            const update = {
                qty: item.qty,
                timestamp: Date.now(),
            };

            try {
                await updateInventoryById(item.docId, update);
                alert('Item quantity updated!')
                this.model.updateInventoryQty(item, update);
            } catch (error) {
                console.error('Error updating inventory: ', error);
                alert('Error updating inventory: ' + error);
            }
        } else {
            if (!confirm('Are you sure to delete permanently?')) {
                return;
            }
            startSpinner();
            try {
                await deleteInventoryById(item.docId);
                stopSpinner();
                this.model.deleteInventoryById(item.docId);
                this.view.render();
            } catch (error) {
                stopSpinner();
                console.log('Error deleting inventory: ', error);
                alert('Error deleting inventory: ' + error);
            }
        }
    }

    async onClickCancelButton(e) {
        const itemName = e.target.dataset.name;
        const item = this.model.getInventoryByName(itemName);

        try {
            item.qty = await getInventoryQtyById(item.docId);
        } catch (error) {
            console.log('Error getting inventory quantity: ', error);
            alert('Error getting inventory quantity: ' + error);
        }

        const qtyElement = document.getElementById(`qty-${item.name}`);
        qtyElement.textContent = item.qty;
    }
}