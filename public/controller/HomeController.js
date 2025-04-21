import { HomeModel } from "../model/HomeModel.js";
import { currentUser } from "./firebase_auth.js";
import { Inventory } from "../model/Inventory.js";
import { addInventory } from "./firestore_controller.js";
import { startSpinner, stopSpinner } from "../view/util.js";

export class HomeController {
    model = null;
    view = null;

    constructor() {
        this.model = new HomeModel();
        this.onSubmitCreateItem = this.onSubmitCreateItem.bind(this);
        this.onClickMinusButton = this.onClickMinusButton.bind(this);
        this.onClickPlusButton = this.onClickPlusButton.bind(this);
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
        const item = this.model.inventoryList.find(i => i.name === itemName);

        if (!item) {
            alert(`Item "${itemName}" not found.`);
            return;
        }

        if (item.qty > 0) {
            item.qty--;
            this.view.render(); // re-render the UI
        } else {
            alert('Could not reduce item count below 0!');
        }
    }

    onClickPlusButton(e) {
        const itemName = e.target.dataset.name;
        const item = this.model.inventoryList.find(i => i.name === itemName);

        if (!item) {
            alert(`Item "${itemName}" not found.`);
            return;
        }


        item.qty++;
        this.view.render(); 
    }


}