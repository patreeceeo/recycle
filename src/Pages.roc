module [
    dict,
]

import Html

dict = Dict.single("/", page_index)

layout : { main : List Html.Tag } -> Html.Tag
layout = |{ main }|
    Root [
        Head [
            MetaCharset "utf-8",
            Meta { name: "viewport", content: "width=device-width, initial-scale=1" },
            Title "/recycle",
        ],
        Body [
            Nav [
                Ul [
                    Li [A { href: "/recycle" } "/recycle"],
                ],
            ],
            Main main,
        ],
    ]

page_index = layout({ main: [H1 "hello!"] })

