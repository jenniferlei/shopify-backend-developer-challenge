"""Tests for Shopify Inventory app."""

from unittest import TestCase
import os
from flask import session
from server import app
from model import (connect_to_db, db, example_data)


class FlaskTestsBasic(TestCase):
    """Flask tests."""

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config["TESTING"] = True

    def test_index(self):
        """Test homepage page."""

        result = self.client.get("/")
        self.assertIn(b"", result.data)


class FlaskTestsDatabase(TestCase):
    """Flask tests that use the database."""

    def setUp(self):
        """Stuff to do before every test."""

        app.config["TESTING"] = True
        app.config["SECRET_KEY"] = "key"
        os.system("dropdb testdb --if-exists")
        os.system("createdb testdb")
        connect_to_db(app, "postgresql:///testdb")
        db.create_all()
        example_data()
        self.client = app.test_client()

    def tearDown(self):
        """Do at end of every test."""

        db.session.remove()
        db.drop_all()
        db.engine.dispose()

    def test_create_inventory(self):
        """Test create inventory route."""

        result = self.client.post("/api/create_inventory",
                                  json={})
        self.assertIn(b'', result.data)

    def test_read_inventory(self):
        """Test read inventory route."""

        result = self.client.get("/api/inventory")
        self.assertIn(b'', result.data)

    def test_update_inventory(self):
        """Test update inventory route."""

        result = self.client.post("/api/update_inventory/id:1",
                                  json={})
        self.assertIn(b'{}', result.data)

    def test_delete_inventory(self):
        """Test delete inventory route."""

        result = self.client.post("/api/delete_inventory/id:1",
                                  json={})
        self.assertIn(b'{}', result.data)

    def test_create_shipment(self):
        """Test create shipment route."""

        result = self.client.post("/api/create_shipment",
                                  json={})
        self.assertIn(b'', result.data)

    def test_read_shipment(self):
        """Test read shipment route."""

        result = self.client.get("/api/shipment")
        self.assertIn(b'', result.data)

    def test_update_shipment(self):
        """Test update shipment route."""

        result = self.client.post("/api/update_shipment/id:1",
                                  json={})
        self.assertIn(b'{}', result.data)

    def test_delete_shipment(self):
        """Test delete shipment route."""

        result = self.client.post("/api/delete_shipment/id:1",
                                  json={})
        self.assertIn(b'{}', result.data)



if __name__ == "__main__":
    import unittest

    unittest.main()
