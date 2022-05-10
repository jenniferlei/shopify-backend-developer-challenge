"""Server for pup journey app."""

from flask import Flask, render_template, jsonify, request, flash, session, redirect
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime

from model import connect_to_db, db, Inventory

from jinja2 import StrictUndefined

app = Flask(__name__)

app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


def validate_fields(warehouse_id, product_name, sku, quantity):
    """Form fields error handling"""
    # make sure warehouse id != ""

@app.route("/")
def homepage():
    """View homepage."""

    return render_template("index.html")


# create inventory
@app.route("/api/create_inventory", methods=["POST"])
def create_inventory():
    """Create an inventory row and return a JSON response of inventories"""

    # ADD ERROR HANDLING

    warehouse_id = request.get_json().get("warehouseId")
    product_name = request.get_json().get("productName")
    sku = request.get_json().get("sku")
    quantity = request.get_json().get("quantity")
    description = request.get_json().get("description")

    inventory = Inventory.create_inventory(int(warehouse_id), product_name, sku, int(quantity), description)
    db.session.add(inventory)
    db.session.commit()
    
    inventory_json = inventory.to_dict()

    return jsonify({"inventory": inventory_json})


# read inventory
@app.route("/api/inventory", methods=["GET"])
def view_inventory():
    """Return a JSON response of inventory rows"""

    inventory_rows = Inventory.retrieve_inventory()
    inventory_json = [i.to_dict() for i in inventory_rows]
    
    return jsonify({"inventory": inventory_json})


# read inventory
@app.route("/api/deleted_inventory", methods=["GET"])
def view_deleted_inventory():
    """Return a JSON response of deleted inventory rows"""

    inventory_rows = Inventory.retrieve_deleted_inventory()
    inventory_json = [i.to_dict() for i in inventory_rows]
    
    return jsonify({"inventory": inventory_json})


# update inventory
@app.route("/api/update_inventory/id:<inventory_id>", methods=["POST"])
def update_inventory(inventory_id):
    """Update and return a JSON response of inventories"""

    warehouse_id = request.get_json().get("warehouseId")
    product_name = request.get_json().get("productName")
    quantity = request.get_json().get("quantity")
    description = request.get_json().get("description")
    
    return jsonify({"inventory": inventory_json})


# delete inventory
@app.route("/api/delete_inventory/id:<inventory_id>", methods=["POST"])
def delete_inventory(inventory_id):
    """Delete an inventory row"""

    # add comment
    # change deleted to true
    
    return "Success"

# restore inventory
@app.route("/api/restore_inventory/id:<inventory_id>", methods=["POST"])
def restore_inventory(inventory_id):
    """Restore a deleted inventory row"""

    # add comment
    # change deleted to true
    
    return "Success"


if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
