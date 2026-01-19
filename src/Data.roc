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
            "SamsungFlatscreenTV.html",
            {
                date_posted: "Jan 18, 2026",
                name: "Samsung Flatscreen TV",
                description: "A wall-mountable 40-inch Samsung flatscreen TV in good condition. Can of La Croix for scale. Cables, remote control and anything not pictured is not included&hellip; We can throw in the can of La Croix, if you want. Price? Just get it out of our house!",
                images: [
                    {
                        src: "static/IMG_4992.jpg",
                        caption: "It works!",
                    },
                    {
                        src: "static/IMG_4993.jpg",
                        caption: "Back panel ports",
                    },
                    {
                        src: "static/IMG_4994.jpg",
                        caption: "Closer look at ports and info sticker",
                    },
                    {
                        src: "static/IMG_4996.jpg",
                        caption: "More ports",
                    },
                    {
                        src: "static/IMG_4997.jpg",
                        caption: "The power input",
                    },
                ],
            },
        ),
    ],
)
