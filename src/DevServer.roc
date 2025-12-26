app [Model, init!, respond!] { web: platform "https://github.com/roc-lang/basic-webserver/releases/download/0.13.0/fSNqJj3-twTrb0jJKHreMimVWD7mebDOj0mnslMm2GM.tar.br" }

import web.Stdout
import web.Http exposing [Request, Response]
import web.Utc
import web.Url
import web.File

import Pages
import Html

# Model is produced by `init`.
Model : {}

init! = |{}| Ok {}

join_path : List Str -> Str
join_path = |parts|
    if List.is_empty(parts) then
        "/"
    else
        Str.join_with(parts, "/")

respond! : Request, Model => Result Response [ServerErr Str]_
respond! = |req, _|
    # Log request datetime, method and url
    datetime = Utc.to_iso_8601 (Utc.now! {})

    try Stdout.line! "${datetime} ${Inspect.to_str req.method} ${req.uri}"

    req_path_parts =
        req.uri
        |> Url.from_str
        |> Url.path
        |> Str.split_on("/")

    req_path = join_path(req_path_parts)

    when req_path_parts is
        ["static", ..] ->
            file_response! req_path
        _ ->
            page_response req_path

page_response : Str -> Result Response [ServerErr Str]
page_response = |path|
    when Dict.get(Pages.dict, path) is
        Ok content ->
            Ok {
                status: 200,
                headers: [],
                body: Html.render(content) |> Str.to_utf8
            }
        Err _ ->
            Err ServerErr("404")

file_response! = |path|
    when File.read_utf8!(path) is
        Ok content -> Ok {
            status: 200,
            headers: [],
            body: Str.to_utf8(content)
            }
        Err _ -> Err ServerErr("Error when reading ${path}")


