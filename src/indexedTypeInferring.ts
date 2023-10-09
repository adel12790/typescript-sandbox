namespace IndexInferTypes{
type ContactStatus = "active" | "inactive" | "new";

interface Address {
    street: string;
    province: string;
    postalCode: string;
}

interface Contact {
    id: number;
    name: string;
    status: ContactStatus;
    address: Address;
}

interface ContactEvent {
    contactId: number;
}

interface ContactDeletedEvent extends ContactEvent { 
}

interface ContactStatusChangedEvent extends ContactEvent { 
    oldStatus: ContactStatus;
    newStatus: ContactStatus;
}

interface ContactEvents {
    deleted: ContactDeletedEvent;
    statusChanged: ContactStatusChangedEvent;
    // ... and so on
}

function getValue<T, U extends keyof T>(source: T, propertyName: U) {
    return source[propertyName];
}

function handleEvent<K extends keyof ContactEvents, L extends ContactEvents[K]>(eventName: K, handler: (evt: L) => void) {
    // ...
    if (eventName === "deleted") {
        // handler is of type ContactDeletedEvent
        handler({contactId: 12345} as L);
    }
}
}