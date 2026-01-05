module [
    Item,
    Image,
    available_items,
]

Image : { src : Str, caption : Str }

Item : { name : Str, description : Str, images : List Image, date_posted : Str }

available_items : Dict Str Item
available_items = Dict.from_list(
    [
        (
            "WineFridge.html",
            {
                date_posted: "Jan 3, 2026",
                name: "Wine Fridge",
                description: "UPDATE: No longer available! Keep your bevvies cool with this sleek wine fridge! Featuring adjustable shelves and a compact design, it's perfect for any home bar or kitchen. Make: Summit. Model: SCR600BGLBIADA. Condition: Like New. See photos for more details.",
                images: [
                    {
                        src: "static/wine-fridge2.webp",
                        caption: "Front Left",
                    },
                    {
                        src: "static/wine-fridge1.webp",
                        caption: "Front Right",
                    },
                    {
                        src: "static/wine-fridge3.webp",
                        caption: "Specs + Features",
                    },
                ],
            },
        ),
    ],
)
