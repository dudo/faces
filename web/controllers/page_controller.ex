defmodule Faces.PageController do
  use Faces.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
