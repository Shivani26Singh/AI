import { faker } from '@faker-js/faker';

/**
 * Test data generators using Faker for realistic test data.
 */

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

export interface ShippingData {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
}

export interface PaymentData {
    cardNumber: string;
    expiry: string;
    cvc: string;
    cardName: string;
}

export interface ProductData {
    name: string;
    price: number;
    description: string;
    category: string;
}

/** Generate a random user */
export function generateUser(overrides?: Partial<UserData>): UserData {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: 'Test@' + faker.internet.password({ length: 12, memorable: false }),
        phone: faker.phone.number(),
        ...overrides,
    };
}

/** Generate random shipping info */
export function generateShippingInfo(overrides?: Partial<ShippingData>): ShippingData {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zip: faker.location.zipCode(),
        country: 'US',
        phone: faker.phone.number(),
        ...overrides,
    };
}

/** Generate valid test payment info */
export function generatePaymentInfo(overrides?: Partial<PaymentData>): PaymentData {
    return {
        cardNumber: '4111111111111111',
        expiry: '12/28',
        cvc: '123',
        cardName: faker.person.fullName(),
        ...overrides,
    };
}

/** Generate a random product */
export function generateProduct(overrides?: Partial<ProductData>): ProductData {
    return {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 1, max: 999 })),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        ...overrides,
    };
}

/** Static test data for predictable tests */
export const STATIC_USERS = {
    standard: {
        email: 'standard_user@example.com',
        password: 'StandardPass123!',
    },
    admin: {
        email: 'admin@example.com',
        password: 'AdminPass123!',
    },
    locked: {
        email: 'locked_user@example.com',
        password: 'LockedPass123!',
    },
} as const;

export const STATIC_PRODUCTS = {
    cheap: { name: 'Budget Item', price: 9.99 },
    mid: { name: 'Standard Item', price: 49.99 },
    expensive: { name: 'Premium Item', price: 999.99 },
} as const;

export const STATIC_SHIPPING = {
    domestic: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
        phone: '555-0100',
    },
    international: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        address: '456 Oxford St',
        city: 'London',
        state: 'Greater London',
        zip: 'SW1A 1AA',
        country: 'GB',
        phone: '+44 20 7946 0958',
    },
} as const;