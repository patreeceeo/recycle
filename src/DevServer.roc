app [Model, init!, respond!] {
    web: platform "https://github.com/roc-lang/basic-webserver/releases/download/0.13.0/fSNqJj3-twTrb0jJKHreMimVWD7mebDOj0mnslMm2GM.tar.br",
}

import web.Stdout
import web.Http exposing [Request, Response]
import web.Utc
import web.Url
import web.File
import web.Path
import web.Env

import Pages
import Html

# Model is produced by `init`.
Model : {}

init! = |{}| Ok {}

split_path_parts: Str -> List Str
split_path_parts = |path|
    path |> Str.split_on("/")
    |> List.drop_if |part| Str.is_empty(part)

respond! : Request, Model => Result Response [ServerErr Str]_
respond! = |req, _|
    # Log request datetime, method and url
    datetime = Utc.to_iso_8601 (Utc.now! {})

    try Stdout.line! "${datetime} ${Inspect.to_str req.method} ${req.uri}"

    req_path_parts =
        req.uri
        |> Url.from_str
        |> Url.path
        |> split_path_parts

    base_path = Env.var!("BASE_URL") ?? "/"
    base_path_parts = split_path_parts base_path
    rel_req_path_parts =
        if List.starts_with(req_path_parts, base_path_parts) then
            List.drop_first(req_path_parts, List.len(base_path_parts))
        else
            req_path_parts
    dbg rel_req_path_parts

    rel_req_path = Str.join_with(rel_req_path_parts, "/")

    when page_response! rel_req_path base_path is
        Ok response -> Ok response
        Err _ -> file_response! rel_req_path

page_response! : Str, Str => Result Response [ServerErr Str]
page_response! = |path, base_url|
    when Dict.get(Pages.routes({ base_url }), path) is
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
                body: content,
            }

        Err FileReadErr(err_path, file_err) ->
            Err ServerErr("${Path.display(err_path)}:\n\t${Inspect.to_str(file_err)}")

        Err FileReadUtf8Err(err_path, _) ->
            Err ServerErr("Failed to read file ${Path.display(err_path)} as utf8.")

