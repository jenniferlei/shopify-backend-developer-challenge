"""Server for pup journey app."""

from flask import Flask, render_template, jsonify, request, flash, session, redirect
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime

from model import (connect_to_db, db, Inventory, Shipment, ShipmentItem)

from jinja2 import StrictUndefined

app = Flask(__name__)

app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route("/")
def homepage():
    """View homepage."""

    return render_template("index.html")


# create inventory
@app.route("/api/create_inventory", methods=["POST"])
def create_inventory():
    """Create an inventory row and return a JSON response of inventories"""


    
    return jsonify({"inventory": inventory_json})


# read inventory
@app.route("/api/inventory", methods=["GET"])
def view_inventory():
    """Return a JSON response of inventories"""


    
    return jsonify({"inventory": inventory_json})


# update inventory
@app.route("/api/update_inventory/id:<inventory_id>", methods=["POST"])
def update_inventory(inventory_id):
    """Update and return a JSON response of inventories"""


    
    return jsonify({"inventory": inventory_json})


# delete inventory
@app.route("/api/delete_inventory/id:<inventory_id>", methods=["POST"])
def delete_inventory(inventory_id):
    """Delete an inventory row"""


    
    return "Success"


# create shipment
@app.route("/api/create_shipment", methods=["POST"])
def create_shipment():
    """Create an shipment row and return a JSON response of shipments"""


    
    return jsonify({"shipment": shipment_json})


# read shipment
@app.route("/api/shipments", methods=["GET"])
def view_shipment():
    """Return a JSON response of shipments"""


    
    return jsonify({"shipment": shipment_json})


# update shipment
@app.route("/api/update_shipment/id:<shipment_id>", methods=["POST"])
def update_shipment(shipment_id):
    """Update and return a JSON response of shipments"""


    
    return jsonify({"shipment": shipment_json})


# delete shipment
@app.route("/api/delete_shipment/id:<shipment_id>", methods=["POST"])
def delete_shipment(shipment_id):
    """Delete an shipment row"""


    
    return "Success"


if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
