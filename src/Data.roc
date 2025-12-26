module [
    Item,
    Image,
    available_items,
]

Attributes : [
    PhysicalAttributes { condition : Str, height : Str, width : Str, depth : Str, weight : Str },
    IntellectualAttributes {},
]

Image : { src : Str, caption : Str }

Item : { name : Str, description : Str, images : List Image, attributes : Attributes }

available_items : List Item
available_items = [
    {
        name: "Example",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        images: [
            {
                src: "/static/me-duck.png",
                caption: "Front",
            },
        ],
        attributes: IntellectualAttributes {},
    },
]
