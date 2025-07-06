export interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    widgetType: "switch" | "radio";
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}

// Example of a Category object
// const exampleCategory: Category = {
//     name: "Electronics",
//     priceConfiguration: {
//         warranty: {
//             priceType: "aditional",
//             availableOptions: ["1 year", "2 years", "3 years"]
//         },
//         delivery: {
//             priceType: "base",
//             availableOptions: ["standard", "express"]
//         }
//     },
//     attributes: [
//         {
//             name: "Color",
//             widgetType: "radio",
//             defaultValue: "Black",
//             availableOptions: ["Black", "White", "Silver"]
//         },
//         {
//             name: "Power Saving Mode",
//             widgetType: "switch",
//             defaultValue: "Off",
//             availableOptions: ["On", "Off"]
//         }
//     ]
// };
