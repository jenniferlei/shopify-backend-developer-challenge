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


def validate_fields(warehouse_id=1, product_name="test", sku="1", quantity=1):
    """Form fields error handling"""
    if not str(warehouse_id).isnumeric() or \
       not str(sku).isalnum() or \
       not str(quantity).isnumeric() or \
       warehouse_id == "" or \
       product_name == "" or \
       sku == "" or \
       quantity == "" or \
       int(quantity) < 0:
        return False
    return True


@app.route("/")
def homepage():
    """View homepage."""

    return render_template("index.html")


@app.route("/api/create_inventory", methods=["POST"])
def create_inventory():
    """Create an inventory row and return a JSON response of inventories"""

    warehouse_id = request.get_json().get("warehouseId")
    product_name = request.get_json().get("productName")
    sku = request.get_json().get("sku")
    quantity = request.get_json().get("quantity")
    description = request.get_json().get("description")

    if not validate_fields(warehouse_id, product_name, sku, quantity):
        return jsonify(data="invalid input", status=400)

    inventory_row = Inventory.create_inventory(int(warehouse_id), product_name, sku, int(quantity), description)
    db.session.add(inventory_row)
    db.session.commit()
    
    inventory_json = inventory_row.to_dict()

    return jsonify(data=inventory_json, status=200)


@app.route("/api/inventory", methods=["GET"])
def view_inventory():
    """Return a JSON response of inventory rows"""

    inventory_rows = Inventory.retrieve_inventory()
    inventory_json = [i.to_dict() for i in inventory_rows]
    
    return jsonify(data=inventory_json)


@app.route("/api/deleted_inventory", methods=["GET"])
def view_deleted_inventory():
    """Return a JSON response of deleted inventory rows"""

    inventory_rows = Inventory.retrieve_deleted_inventory()
    inventory_json = [i.to_dict() for i in inventory_rows]
    
    return jsonify(data=inventory_json)


# update inventory
@app.route("/api/update_inventory/id:<inventory_id>", methods=["POST"])
def update_inventory(inventory_id):
    """Update and return a JSON response of inventories"""

    warehouse_id = request.get_json().get("warehouseId")
    product_name = request.get_json().get("productName")
    sku = request.get_json().get("sku")
    quantity = request.get_json().get("quantity")
    description = request.get_json().get("description")

    if not validate_fields(warehouse_id, product_name, sku, quantity):
        return jsonify(data="invalid input", status=400)

    inventory_row = Inventory.retrieve_inventory_by_inventory_id(inventory_id)

    if not inventory_row:
        return jsonify(data="row does not exist", status=400)

    inventory_row.warehouse_id = int(warehouse_id)
    inventory_row.product_name = product_name
    inventory_row.sku = sku
    inventory_row.quantity = int(quantity)
    inventory_row.description = description
    inventory_row.updated = datetime.now()
    db.session.commit()
    
    inventory_json = inventory_row.to_dict()

    return jsonify(data=inventory_json, status=200)


# delete inventory
@app.route("/api/delete_inventory/id:<inventory_id>", methods=["POST"])
def delete_inventory(inventory_id):
    """Delete an inventory row"""

    inventory_row = Inventory.retrieve_inventory_by_inventory_id(inventory_id)
    inventory_row.comments = request.get_json().get("comments")
    inventory_row.deleted = True
    inventory_row.updated = datetime.now()
    
    db.session.commit()
    
    inventory_json = inventory_row.to_dict()

    return jsonify(data=inventory_json, status=200)

# restore inventory
@app.route("/api/restore_inventory/id:<inventory_id>", methods=["POST"])
def restore_inventory(inventory_id):
    """Restore a deleted inventory row"""

    inventory_row = Inventory.retrieve_inventory_by_inventory_id(inventory_id)
    inventory_row.deleted = False
    inventory_row.updated = datetime.now()

    db.session.commit()
    
    inventory_json = inventory_row.to_dict()
    
    return jsonify(data=inventory_json, status=200)


if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)