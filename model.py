"""Models for Shopify Inventory app."""

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

from datetime import datetime

db = SQLAlchemy()


class Inventory(db.Model):
    """A product inventory."""

    __tablename__ = "inventories"

    inventory_id = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    warehouse_id = db.Column(db.Integer, default=1) # Can add a table for warehouse storage info and change this to a foreign key
    product_name = db.Column(db.String, nullable=False) # Can add a table for product and change this to product_id & foreign key
    sku = db.Column(db.String, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String)
    created = db.Column(db.DateTime, nullable=False)
    updated = db.Column(db.DateTime, nullable=False)
    deleted = db.Column(db.Boolean, nullable=False, default=False)
    comments = db.Column(db.Text, default=None)

    def __repr__(self):
        return f"<Inventory id={self.inventory_id} name={self.product_name} sku={self.sku} qty={self.quantity}>"

    def to_dict(self):
        return {
            "inventory_id": self.inventory_id,
            "warehouse_id": self.warehouse_id,
            "product_name": self.product_name,
            "sku": self.sku,
            "quantity": self.quantity,
            "description": self.description,
            "created": self.created.strftime("%m/%d/%Y, %H:%M:%S"),
            "updated": self.updated.strftime("%m/%d/%Y, %H:%M:%S"),
            "deleted": self.deleted,
            "comments": self.comments,
        }

    @classmethod
    def create_inventory(cls, warehouse_id, product_name, sku, quantity, description=None,
        created=datetime.now(), updated=datetime.now(), deleted=False, comments=None):
        """Create inventory"""

        inventory = cls(warehouse_id=warehouse_id, product_name=product_name, sku=sku, quantity=quantity,
            description=description, created=created, updated=updated, deleted=deleted, comments=comments)

        return inventory

    @classmethod
    def retrieve_inventory(cls):
        """Retrieve active inventory rows"""

        return (db.session.query(cls)
                          .filter_by(deleted=False)
                          .order_by(cls.inventory_id.asc())
                          .all())

    @classmethod
    def retrieve_deleted_inventory(cls):
        """Retrieve deleted inventory rows"""

        return (db.session.query(cls)
                          .filter_by(deleted=True)
                          .order_by(cls.inventory_id.asc())
                          .all())

    @classmethod
    def retrieve_inventory_by_inventory_id(cls, inventory_id):
        """Retrieve inventory row by inventory_id"""

        return db.session.query(cls).get(inventory_id)


def connect_to_db(flask_app, db_uri="postgresql:///inventory", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


def example_data():
    """Create example data for the test database."""
    
    inventory1 = Inventory.create_inventory(1, "Milk Chocolate", 50)
    inventory2 = Inventory.create_inventory(1, "Dark Chocolate", 50)
    inventory3 = Inventory.create_inventory(1, "White Chocolate", 50)
    inventory4 = Inventory.create_inventory(1, "Strawberry Chocolate", 75)
    
    db.session.add_all([inventory1, inventory2, inventory3, inventory4])
    db.session.commit()


if __name__ == "__main__":

    from server import app

    connect_to_db(app)