module [
    dict,
]

import Html
import Data

dict = Dict.single("/", page_index)

layout : { main : List Html.Tag } -> Html.Tag
layout = |{ main }|
    Root [
        Head [
            MetaCharset "utf-8",
            Meta { name: "viewport", content: "width=device-width, initial-scale=1" },
            Link { rel: "icon", href: "/static/me-duck.png" },
            Title "/recycle",
        ],
        Body [
            Nav [
                Ul [
                    Li [A { href: "/" } "/recycle"],
                ],
            ],
            Main main,
        ],
    ]

page_index = layout({ main: [Ul(Data.available_items |> List.map render_item)] })

render_item : Data.Item -> Html.Tag
render_item = |item|
    Li [
        H2 item.name,
        P item.description,
        when List.get(item.images, 0) is
            Ok image ->
                render_image(image)

            Err _ ->
                P "No images",
    ]

render_image : Data.Image -> Html.Tag
render_image = |{ src, caption }|
    Figure [
        Img { src, alt: caption },
        FigCaption caption,
    ]
