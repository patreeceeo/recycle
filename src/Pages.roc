module [
    routes,
]

import Html
import Data

routes : { base_url : Str } -> Dict Str Html.Tag
routes = |{ base_url }|
    Dict.from_list(
        [
            ("", page_index({ base_url })),
        ]
        |> List.concat
            get_details_routes({ base_url }),
    )

get_details_routes : { base_url : Str } -> List (Str, Html.Tag)
get_details_routes = |{ base_url }|
    Data.available_items
    |> Dict.to_list
    |> List.map |(href, item)|
        (href, page_item_detail { item, base_url })

layout : { main : List Html.Tag, base_url : Str } -> Html.Tag
layout = |{ main, base_url }|
    Root [
        Head [
            MetaCharset "utf-8",
            Meta { name: "viewport", content: "width=device-width, initial-scale=1" },
            Link { rel: "icon", href: "static/me-duck.png" },
            Link { rel: "stylesheet", href: "static/Html.css" },
            Title "recycle bin",
            BaseUrl base_url,
            Script { src: "static/main.js" },
        ],
        Body [
            Nav [
                Ul [
                    Li [A { href: "https://zzt64.com" } "home"],
                    Li [Text "/"],
                    Li [A { href: "" } "recycle"],
                ],
            ],
            Main main,
            Footer [
                Text "Made",
                A { href: "https://www.todepond.com/wikiblogarden/tadi-web/entry-points/#slippy-mindset" } "slippily",
                Text "with",
                A { href: "https://github.com/patreeceeo/recycle" } "roc and wget",
            ],
        ],
    ]

page_index = |{ base_url }|
    layout(
        {
            base_url,
            main: [
                Grid(
                    [
                        Article [
                            H1 "Patrick's Internet Recycle Bin",
                            P "Everything I &ldquo;own&rdquo; is actually just borrowed, and in a way, it actually owns me. In that spirit, I'm giving away posessions that don't serve me.",
                            P "I don't want to deal with craigslist, ebay, fartbook marketplace. Thinking too much about money lowers the vibes. A lot of things are more important than material goods.",
                            P "That said, if you want me to mail something to you, I might ask that you cover the shipping costs.",
                            P "Alternatively, I'm in the San Francisco Bay area most of the time. Use that info for what you will.",
                        ],
                    ]
                    |> List.concat (Data.available_items |> Dict.to_list |> List.map render_item),
                ),
            ],
        },
    )

page_item_detail : { item : Data.Item, base_url : Str } -> Html.Tag
page_item_detail = |{ item, base_url }|
    layout(
        {
            base_url,
            main: [
                Grid
                    (
                        [
                            Article [
                                H1 item.name,
                                P item.description,
                            ],
                        ]
                        |> List.concat(item.images |> List.map render_image)
                    ),
            ],
        },
    )

render_item : (Str, Data.Item) -> Html.Tag
render_item = |(href, item)|
    FigureRotator [Card { href } ([H2 item.name] |> List.concat render_image_list(item.images))]

render_image_list : List Data.Image -> List Html.Tag
render_image_list = |images|
    if List.is_empty(images) then
        [
            render_image(
                {
                    src: "https://placehold.co/600x400?text=No+images",
                    caption: ":P",
                },
            ),
        ]
    else
        List.map(images, render_image)

render_image : Data.Image -> Html.Tag
render_image = |{ src, caption }|
    Figure [
        Img { src, alt: caption },
        FigCaption caption,
    ]

