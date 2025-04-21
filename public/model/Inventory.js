export class Inventory {
    email = null;
    name = null;
    qty = 1; // default quantity
    timestamp = null;
    docId = null;

    constructor(email, name, qty, timestamp) {
        this.email = email;
        this.name = name;
        this.qty = qty;
        this.timestamp = timestamp;
    }

    set_docId(docId) {
        this.docId = docId;
    }

    toFirestore() {
        return {
            email: this.email,
            name: this.name,
            qty: this.qty,
            timestamp: this.timestamp,
        };
    }
}