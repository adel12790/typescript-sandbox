namespace MappedContact {
    // Introduce mapped type definition
    type QueryType<TProp> = {
        sort?: 'asc' | 'desc'
        matches(value: TProp): boolean
    }
    type MappedContactQuery = {
        [P in keyof Contact]?: QueryType<Contact[P]>
    }

    function searchContacts(
        contacts: Contact[],
        query: MappedContactQuery
    ): Contact[] {
        return contacts.filter((contact) => {
            for (const property of Object.keys(query)) {
                // get the query object for this property
                const q = query[property] as QueryType<Contact[keyof Contact]>

                // check to see if it matches
                if (q && q.matches(contact[property])) {
                    return true
                }
            }

            return false
        })
    }

    const filteredContacts = searchContacts([], {
        id: { matches: (value) => value === 12345 },
    })
}
