namespace Challenge {
    // this would get the query object type {name: (val: string | number) => boolean, age: (val: string | number) => boolean}
    // the val can't be typed to the correct type
    type Query<T> = Record<keyof T, (val: T[keyof T]) => boolean>

    // this would solve the val type issue of having to be string | number
    // it would pull the type from the object indexed by the key
    type MappedQuery<T> = {
        [P in keyof T]?: (val: T[P]) => boolean
    }

    function query<T>(
        items: T[],
        query: MappedQuery<T> // <--- replace this!
    ) {
        return items.filter((item) => {
            // iterate through each of the item's properties
            for (const property of Object.keys(item) as (keyof T)[]) {
                // get the query for this property name
                const propertyQuery = query[property]

                // see if this property value matches the query
                if (propertyQuery && propertyQuery(item[property])) {
                    return true
                }
            }

            // nothing matched so return false
            return false
        })
    }

    const matches = query(
        [
            { name: 'Ted', age: 12 },
            { name: 'Angie', age: 31 },
        ],
        {
            name: (name) => name === 'Angie',
            age: (age) => age > 30,
        }
    )
}
