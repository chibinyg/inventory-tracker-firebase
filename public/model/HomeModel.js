export class HomeModel {
    inventoryList = null;

    constructor() {
        this.inventoryList = [];
    }

    addNewInventory(item) {
        this.inventoryList.push(item);
        this.inventoryList.sort((a, b) => a.name.localeCompare(b.name));
    }

    getInventoryByName(itemName) {
        return this.inventoryList.find( inventory => inventory.name === itemName);
    }

    updateInventoryQty(item, update) {
        item.qty = update.qty;
        item.timestamp = update.timestamp;
    }

    deleteInventoryById(itemDocId) {
        const index = this.inventoryList.findIndex(item => item.docId === itemDocId);
        if (index >= 0) {
            this.inventoryList.splice(index, 1);
        }
    }
}