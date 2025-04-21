export class HomeModel {
    inventoryList = null;

    constructor() {
        this.inventoryList = [];
    }

    addNewInventory(item) {
        this.inventoryList.push(item);
        this.inventoryList.sort((a, b) => a.name.localeCompare(b.name));
    }
    
}