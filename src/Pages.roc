module [
    routes,
]

import Html
import Data

routes = Dict.from_list(
    [
        ("/", page_index),
    ]
    |> List.concat
        get_details_routes,
)

get_details_routes : List (Str, Html.Tag)
get_details_routes =
    Data.available_items
    |> Dict.to_list
    |> List.map |(href, item)|
        (href, page_item_detail item)

layout : { main : List Html.Tag } -> Html.Tag
layout = |{ main }|
    Root [
        Head [
            MetaCharset "utf-8",
            Meta { name: "viewport", content: "width=device-width, initial-scale=1" },
            Link { rel: "icon", href: "/static/me-duck.png" },
            Link { rel: "stylesheet", href: "/static/Html.css" },
            Title "recycle bin",
        ],
        Body [
            Nav [
                Ul [
                    Li [A { href: "/" } "dive back in"],
                ],
            ],
            Main main,
        ],
    ]

page_index = layout(
    {
        main: [
            Grid(
                [
                    Article [
                        H1 "Welcome to my Internet Recycle Bin",
                        P "Everything I &ldquo;own&rdquo; is actually just borrowed, and in a way, it actually owns me. In that spirit, I'm giving away posessions that don't serve me.",
                        P "Everything you see here is free and available. If you want it, let me know. Drop me a line at pscale01 at gmail dot com.",
                        P "If you want me to mail it to you, I just ask that you cover the shipping costs.",
                    ],
                ]
                |> List.concat (Data.available_items |> Dict.to_list |> List.map render_item),
            ),
        ],
    },
)

page_item_detail : Data.Item -> Html.Tag
page_item_detail = |item|
    layout(
        {
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
    Card { href } [
        H2 item.name,
        when List.get(item.images, 0) is
            Ok image ->
                render_image(image)

            Err _ ->
                render_image(
                    {
                        src: "https://placehold.co/600x400?text=No+images",
                        caption: ":P",
                    },
                ),
    ]

render_image : Data.Image -> Html.Tag
render_image = |{ src, caption }|
    Figure [
        Img { src, alt: caption },
        FigCaption caption,
    ]

