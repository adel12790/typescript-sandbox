interface Contact {
    id: number
}

const currentUser = {
    id: 1234,
    roles: ['ContactEditor'],
    isAuthenticated(): boolean {
        return true
    },
    isInRole(role: string): boolean {
        return this.roles.contains(role)
    },
}

function authorize(role: string) {
    return function authorizeDecorator(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value

        descriptor.value = function (...args: any[]) {
            if (!currentUser.isAuthenticated()) {
                throw Error('User not authenticated')
            }
            if (!currentUser.isInRole(role)) {
                throw Error('User not authorized to execute this action')
            }

            try {
                return originalMethod.apply(this, args)
            } catch (e) {
                throw e
            }
        }
    }
}

// Singlton class decorator
function singlton<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class Singlton extends constructor {
        private static instance: Singlton

        constructor(...args: any[]) {
            super(...args)
            if (Singlton.instance) {
                throw new Error(
                    'Cannot create multiple instances of a singlton class'
                )
            }

            Singlton.instance = this
        }

        static getInstance(...args: any[]) {
            if (!Singlton.instance) {
                Singlton.instance = new Singlton(...args)
            }

            return Singlton.instance
        }
    }
}

// Property Decorator
function auditable(target: object, key: string | symbol) {
    let value = target[key]

    const getter = () => {
        return value
    }

    const setter = (next) => {
        console.log(`Set: ${key.toString()} => ${next}`)
        value = next
    }

    if (delete target[key]) {
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        })
    }
}

@singlton
class ContactRepository {
    @auditable
    private contacts: Contact[] = []

    @authorize('ContactViewer')
    getContactById(id: number): Contact | null {
        console.trace(`ContactRepository.getContactById: BEGIN`)

        const contact = this.contacts.find((x) => x.id === id)

        console.debug(`ContactRepository.getContactById: END`)

        return contact
    }

    @authorize('ContactEditor')
    save(contact: Contact): void {
        console.trace(`ContactRepository.save: BEGIN`)

        const existing = this.getContactById(contact.id)

        if (existing) {
            Object.assign(existing, contact)
        } else {
            this.contacts.push(contact)
        }

        console.debug(`ContactRepository.save: END`)
    }
}
