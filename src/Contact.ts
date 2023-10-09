type ContactName = string;
type ContactBirthdate = Date | number | string;

// Defineing enum adds more code to the compiled JavaScript
enum ContactStatus {
    Active = "active",
    Inactive = "inactive",
    New = "new"
}

// we can use the enum as a type
type ContactStatusType = "active" | "inactive" | "new";

interface Contact {
    id: number;
    name: ContactName;
    birthDate?: ContactBirthdate;
    status?: ContactStatusType;
    email: string;
}

interface Address {
    line1: string;
    line2: string;
    province: string;
    region: string;
    postalCode: string;
}

// Combine two types to create a new type
type AddressableContact = Contact & Address;

function getBirthDate(contact: Contact) {
    if (typeof contact.birthDate === "number") {
        return new Date(contact.birthDate);
    }
    else if (typeof contact.birthDate === "string") {
        return Date.parse(contact.birthDate)
    }
    else {
        return contact.birthDate
    }
}

let primaryContact: Contact = {
    id: 12345,
    name: "Jamie Johnson",
    status: "active",
    email: ""
}

// Introduce keyof operator
type ContectFields = keyof Contact;

function getValue<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

const value = getValue({min: 0, max: 100}, "max");

// Introduce typeof operator
function toContact(nameOrContact: string | Contact): Contact {
    if (typeof nameOrContact === "string") {
        return {id: 0, name: nameOrContact, email: ""}
    }
    else {
        return nameOrContact;
    }
}

const mytype = {min: 0, max: 100};

function save(obj: typeof mytype) {
    // save obj to database
    return obj;
}


// Record operator in action with a search contact function
interface Query{
    sort?: 'asc' | 'desc';
    matches(value): boolean;
}

// Introducing Partial, Omit, Pick and Required operators
type ContactQuery = Omit<Partial<Record<keyof Contact, Query>>, 'birthDate' | 'status'>;
type PickContactQuery = Partial<Pick<ContactQuery, 'id' | 'name' >>;
type RequiredContactQuery = Required<ContactQuery>;



function searchContacts(contacts: Contact[], query: ContactQuery): Contact[] {
    return contacts.filter(contact => {
        for (const property of Object.keys(query) as (keyof Contact)[]) {
            // get the query object for this property
            const q = query[property];

            // check to see if it matches
            if (q && q.matches(contact[property])) {
                return true;
            }
        }

        return false;
    });
}

const filteredContacts = searchContacts([], {
    id: { matches: (value) => value === 12345 },
});

type FString = string & { __compileTimeOnly: any };

let s: FString = "Hello" as FString;