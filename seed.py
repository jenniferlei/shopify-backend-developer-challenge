"""Script to seed database."""

import os
import json

from model import connect_to_db, db, Inventory
import server

# Run dropdb and createdb to re-create database
os.system("dropdb inventory --if-exists")
os.system("createdb inventory")

# Connect to the database and call db.create_all
connect_to_db(server.app)
db.create_all()

inventory1 = Inventory.create_inventory(1, "Milk Chocolate", "0000001", 50)
inventory2 = Inventory.create_inventory(1, "Dark Chocolate", "0000002", 50)
inventory3 = Inventory.create_inventory(1, "White Chocolate", "0000003", 50)
inventory4 = Inventory.create_inventory(1, "Strawberry Chocolate", "0000004", 75)

inventory5 = Inventory.create_inventory(1, "Strawberry Chocolate", "0000005", 10, deleted=True, comments="This batch went bad")

db.session.add_all([inventory1, inventory2, inventory3, inventory4, inventory5])
db.session.commit()
