from app.handlers import companies, offers, streams


def register(app):
    app.add_api_route("/offers", offers.index, methods=["GET"], status_code=200)

    app.add_api_route("/companies", companies.index, methods=["GET"], status_code=200)
    app.add_api_route("/companies", companies.create, methods=["POST"], status_code=201)
    app.add_api_route("/companies/{company_id}", companies.find, methods=["GET"])
    app.add_api_route("/companies/{company_id}", companies.update, methods=["PUT"])
    app.add_api_route("/companies/{company_id}", companies.delete, methods=["DELETE"], status_code=204)

    app.add_api_route("/companies/{company_id}/streams", streams.index, methods=["GET"], status_code=200)
    app.add_api_route("/companies/{company_id}/streams", streams.create, methods=["POST"], status_code=201)

    app.add_api_route("/streams/{stream_id}", streams.find, methods=["GET"], status_code=200)
    app.add_api_route("/streams/{stream_id}", streams.update, methods=["PUT"])
    app.add_api_route("/streams/{stream_id}/offers", streams.update_offers, methods=["PUT"])
    app.add_api_route("/streams/{stream_id}", streams.delete, methods=["DELETE"], status_code=204)
