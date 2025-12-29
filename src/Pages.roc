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
                            H1 "Patrick's /recycle bin",
                            P "Welcome, and happy browsing!",
                            P "If you see something you want, I'll accept ≥ shipping costs in exchange.",
                            P "I'm based out of the San Francisco bay area, use that info for what you will&hellip;",
                            P "You can email me at:",
                            A { href: "mailto:pscale01+recycle@gmail.com?subject=\'RE: Something in your recycle bin'" } "pscale01@gmail.com",
                            P "Got junk?",
                            A { href: "https://taylor.town/junk-guide" } "Put it online where it belongs!",
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
                                P "posted ${item.date_posted}",
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

