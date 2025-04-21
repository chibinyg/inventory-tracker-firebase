import { AbstractView } from "./AbstractView.js";
import { currentUser } from "../controller/firebase_auth.js";
import { getInventoryList } from "../controller/firestore_controller.js";
import { startSpinner, stopSpinner } from "./util.js";

export class HomeView extends AbstractView {
    //instance variables
    controller = null;

    constructor(controller) {
        super();
        this.controller = controller;
    }

    async onMount() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1>Access denied</h1>';
            return;
        }
        console.log('HomeView.onMount() called');

        startSpinner();
        try {
            this.controller.model.inventoryList = await getInventoryList();
            stopSpinner();
        } catch (error) {
            stopSpinner();
            this.controller.model.inventoryList = null;
            console.error('Error getting inventory list: ', error);
            alert('Error getting inventory list: ' + error);
        }
        console.log('inventory list', this.controller.model.inventoryList);
    }

    async updateView() {
        console.log('HomeView.updateView() called');
        const viewWrapper = document.createElement('div');
        try {
            const response = await fetch('/view/templates/home.html', { cache: 'no-store' });
            viewWrapper.innerHTML = await response.text();

            const container = viewWrapper.querySelector('.d-flex.flex-wrap.gap-1');
            const inventoryList = this.controller.model.inventoryList;
            if (inventoryList === null) {
                const div = document.createElement('div');
                div.innerHTML = '<h1>Error loading inventory list from Firestore</h1>';
                container.appendChild(div);
            } else if (inventoryList.length === 0) {
                const div = document.createElement('div');
                div.innerHTML = '<h1>No inventory has been added!</h1>';
                container.appendChild(div);
            } else {
                inventoryList.forEach(item => {
                    const card = this.#buildItem(item);
                    container.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Error loading home.html: ', error);
            alert('Error loading home.html: ' + error);
            viewWrapper.innerHTML = '<h1>Error loading/fetching home.html</h1>';
        }

        return viewWrapper;
    }

    #buildItem(item) {
        const card = document.createElement('div');
        card.className = 'card bg-light';
        card.style.minWidth = '18rem';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title mt-2';
        title.textContent = item.name;

        const controlRow = document.createElement('div');
        controlRow.className = 'd-flex align-items-center flex-nowrap mt-2';

        const btnMinus = document.createElement('button');
        btnMinus.type = 'button';
        btnMinus.className = 'btn btn-outline-danger me-2 minus-button';
        btnMinus.textContent = '-';
        btnMinus.dataset.name = item.name; 

        const quantity = document.createElement('h5');
        quantity.className = 'me-2 mb-0';
        quantity.textContent = item.qty;

        const btnPlus = document.createElement('button');
        btnPlus.type = 'button';
        btnPlus.className = 'btn btn-outline-primary me-2 plus-button';
        btnPlus.textContent = '+';
        btnPlus.dataset.name = item.name;

        const btnUpdate = document.createElement('button');
        btnUpdate.type = 'button';
        btnUpdate.className = 'btn btn-outline-primary me-2';
        btnUpdate.textContent = 'Update';

        const btnCancel = document.createElement('button');
        btnCancel.type = 'button';
        btnCancel.className = 'btn btn-outline-secondary ms-auto';
        btnCancel.textContent = 'Cancel';

        // Append buttons and quantity to control row
        controlRow.appendChild(btnMinus);
        controlRow.appendChild(quantity);
        controlRow.appendChild(btnPlus);
        controlRow.appendChild(btnUpdate);
        controlRow.appendChild(btnCancel);

        // Append title and control row to card body
        cardBody.appendChild(title);
        cardBody.appendChild(controlRow);

        // Append card body to card
        card.appendChild(cardBody);

        return card;
    }


    attachEvents() {
        const formCreateItem = document.forms.formCreateItem;
        formCreateItem.onsubmit = this.controller.onSubmitCreateItem;

        const btnMinus = document.querySelectorAll('.minus-button');
        for (const button of btnMinus) {
            button.onclick = this.controller.onClickMinusButton;
        }

        const btnPlus = document.querySelectorAll('.plus-button');
        for (const button of btnPlus) {
            button.onclick = this.controller.onClickPlusButton;
        }


    }

    async onLeave() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1>Access denied</h1>';
            return;
        }
        console.log('HomeView.onLeave() called');
    }
}