app [Model, init!, respond!] { web: platform "https://github.com/roc-lang/basic-webserver/releases/download/0.13.0/fSNqJj3-twTrb0jJKHreMimVWD7mebDOj0mnslMm2GM.tar.br" }

import web.Stdout
import web.Http exposing [Request, Response]
import web.Utc
import web.Url
import web.File
import web.Path

import Pages
import Html

# Model is produced by `init`.
Model : {}

init! = |{}| Ok {}

respond! : Request, Model => Result Response [ServerErr Str]_
respond! = |req, _|
    # Log request datetime, method and url
    datetime = Utc.to_iso_8601 (Utc.now! {})

    try Stdout.line! "${datetime} ${Inspect.to_str req.method} ${req.uri}"

    req_path =
        req.uri
        |> Url.from_str
        |> Url.path

    when page_response req_path is
        Ok response -> Ok response
        Err _ -> file_response! req_path

page_response : Str -> Result Response [ServerErr Str]
page_response = |path|
    when Dict.get(Pages.dict, path) is
        Ok content ->
            Ok {
                status: 200,
                headers: [],
                body: Html.render(content) |> Str.to_utf8,
            }

        Err _ ->
            Err ServerErr("Not found: ${path}")

file_response! : Str => Result Response [ServerErr Str]
file_response! = |path|
    rel_path = Str.drop_prefix(path, "/")
    when File.read_bytes!(rel_path) is
        Ok content ->
            Ok {
                status: 200,
                headers: [],
                body: content
            }

        Err FileReadErr(err_path, file_err) ->
            Err ServerErr("${Path.display(err_path)}:\n\t${Inspect.to_str(file_err)}")

        Err FileReadUtf8Err(err_path, _) ->
            Err ServerErr("Failed to read file ${Path.display(err_path)} as utf8.")




