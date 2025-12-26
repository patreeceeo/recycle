module [
    render,
    Tag,
]

# Describe HTML structure, at least as far as we're concerned, with a "tag union".
# Don't get confused by the two meanings of the word "tag" here.
# Could be more specific here, e.g. only allowing certain tags inside other tags via more tag unions, but this seems fine for now
Tag : [
    Root (List Tag),
    Head (List Tag),
    MetaCharset Str,
    Meta { name : Str, content : Str },
    Title Str,
    Body (List Tag),
    Div (List Tag),
    Ul (List Tag),
    Li (List Tag),
    Nav (List Tag),
    A { href : Str } Str,
    Main (List Tag),
    Table (List Tag),
    Th (List Tag),
    Tr (List Tag),
    Td (List Tag),
    Form { action : Str, method : Str } (List Tag),
    Label (List Tag),
    DecInput { name : Str, value : Dec, min : Dec, max : Dec, step : Dec },
    StrInput { name : Str, value : Str },
    Select { name : Str },
    Option { value : Str },
    H1 Str,
    Dt Str,
    Dd Str,
]

render : Tag -> Str
render = |tag|
    when tag is
        Root children ->
            "<!doctype html>${render_generic("html", [], children)}"

        Head children ->
            render_generic("head", [], children)

        Body children ->
            render_generic("body", [], children)

        Div children ->
            render_generic("div", [], children)

        Ul children ->
            render_generic("ul", [], children)

        Li children ->
            render_generic("li", [], children)

        Nav children ->
            render_generic("nav", [], children)

        Main children ->
            render_generic("main", [], children)

        Table children ->
            render_generic("table", [], children)

        Th children ->
            render_generic("th", [], children)

        Tr children ->
            render_generic("tr", [], children)

        Td children ->
            render_generic("td", [], children)

        Label children ->
            render_generic("label", [], children)

        Title content ->
            render_generic_simple("title", [], content)

        H1 content ->
            render_generic_simple("h1", [], content)

        Dt content ->
            render_generic_simple("dt", [], content)

        Dd content ->
            render_generic_simple("title", [], content)

        MetaCharset charset ->
            render_generic_simple("meta", [("charset", StringAttribute charset)], "")

        Meta { name, content } ->
            render_generic_simple("meta", [("name", StringAttribute name), ("content", StringAttribute content)], "")

        A { href } content -> render_generic_simple("a", [("href", StringAttribute href)], content)
        Form { action, method } children -> render_generic("form", [("action", StringAttribute action), ("method", StringAttribute method)], children)
        DecInput { name, value, min, max, step } -> render_generic_simple("input", [("name", StringAttribute name), ("type", StringAttribute "number"), ("value", NumberAttribute value), ("min", NumberAttribute min), ("max", NumberAttribute max), ("step", NumberAttribute step)], "")
        StrInput { name, value } -> render_generic_simple("input", [("name", StringAttribute name), ("type", StringAttribute "text"), ("value", StringAttribute value)], "")
        Select { name } -> render_generic_simple("select", [("name", StringAttribute name)], "")
        Option { value } -> render_generic_simple("option", [("value", StringAttribute value)], "")

render_generic : Str, List GenericAttribute, List Tag -> Str
render_generic = |tag_name, attributes, children|
    render_generic_simple(tag_name, attributes, render_children(children))

render_generic_simple : Str, List GenericAttribute, Str -> Str
render_generic_simple = |tag_name, attributes, content|
    attr_str =
        if List.len(attributes) > 0 then
            " ${render_attributes(attributes)}"
        else
            ""
    join_tag("${tag_name}${attr_str}", content, tag_name)

join_tag : Str, Str, Str -> Str
join_tag = |open, content, close|
    "<${open}>${content}</${close}>"

GenericAttribute : (Str, AttributeValue)
AttributeValue : [
    BooleanAttribute Bool,
    StringAttribute Str,
    NumberAttribute Dec,
]

render_attributes : List GenericAttribute -> Str
render_attributes = |attributes|
    List.map(attributes, render_attribute)
    |> Str.join_with(" ")

render_attribute : GenericAttribute -> Str
render_attribute = |(name, value)|
    when value is
        StringAttribute str ->
            "${name}=\"${str}\""

        BooleanAttribute bool ->
            if bool then
                name
            else
                ""

        NumberAttribute num -> "${name}=\"${Num.to_str(num)}\""

render_children : List Tag -> Str
render_children = |list|
    List.map(list, render)
    |> Str.join_with("")
