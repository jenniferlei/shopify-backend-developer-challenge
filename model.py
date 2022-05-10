"""Models for Shopify Inventory app."""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

import datetime

db = SQLAlchemy()


class Inventory(db.Model):
    """A product inventory."""

    __tablename__ = "inventories"

    inventory_id = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    warehouse_id = db.Column(db.Integer, default=1) # Can add a table for storage info and change this to a foreign key
    product_name = db.Column(db.String, nullable=False) # Can add a table for product info and change this to a foreign key
    description = db.Column(db.String, default=None)
    quantity = db.Column(db.Integer, nullable=False)
    created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    deleted = db.Column(db.Boolean, nullable=False, default=False)
    comments = db.Column(db.Text, default=None)

    shipment_items = db.relationship("ShipmentItem", back_populates="inventory")

    def __repr__(self):
        return f"<Inventory id={self.inventory_id} name={self.product_name} qty={self.quantity}>"


class Shipment(db.Model):
    """A shipment."""

    __tablename__ = "shipments"

    shipment_id = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    order_id = db.Column(db.Integer) # Can add a table for order info and change this to a foreign key
    customer_id = db.Column(db.String, default="") # Can add a table for customer info and change this to a foreign key
    order_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    ship_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    shipping_instructions = db.Column(db.Text, default=None)
    shipping_address = db.Column(db.String)

    shipment_items = db.relationship("ShipmentItem", back_populates="shipment")

    def __repr__(self):
        return f"<Shipment id={self.shipment_id} items={self.shipment_items}>"


class ShipmentItem(db.Model):
    """A shipment item."""

    __tablename__ = "shipment_items"

    shipment_item_id = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    shipment_id = db.Column(db.Integer, db.ForeignKey("shipments.shipment_id"), nullable=False)
    inventory_id = db.Column(db.Integer, db.ForeignKey("inventories.inventory_id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    shipment = db.relationship("Shipment",back_populates="shipment_items")
    inventory = db.relationship("Inventory",back_populates="shipment_items")

    def __repr__(self):
        return f"<Shipment Item shipment_id={self.shipment_id} inventory_id={self.inventory_id} qty={self.quantity}>"


def connect_to_db(flask_app, db_uri="postgresql:///inventory", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


def example_data():
    """Create example data for the test database."""
    
    test_inventory = Inventory(product_name="Dark Chocolate", description="", quantity="")
    test_shipment = Shipment()
    test_shipment = Shipment()
    test_shipment = Shipment()
    
    db.session.add_all([test_inventory, test_shipment])
    db.session.commit()


if __name__ == "__main__":

    from server import app

    connect_to_db(app)
