"""Tests for Inventory app."""

from unittest import TestCase
import os
from server import app
from model import connect_to_db, db, example_data


class FlaskTestsBasic(TestCase):
    """Flask tests."""

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config["TESTING"] = True

    def test_index(self):
        """Test homepage page."""

        result = self.client.get("/")
        self.assertIn(b"Shopify Backend", result.data)


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

        # test successful create
        result = self.client.post("/api/create_inventory",
                                  json={"warehouseId": "1",\
                                        "productName": "TEST",\
                                        "sku": "12345",\
                                        "quantity": "10",\
                                        "description": ""})
        self.assertIn(b'"status":200', result.data)
        self.assertIn(b'"product_name":"TEST"', result.data)
        self.assertIn(b'"deleted":false', result.data)

        # test invalid input: not str(warehouse_id).isnumeric()
        result2 = self.client.post("/api/create_inventory",
                                  json={"warehouseId": "A",\
                                        "productName": "TEST",\
                                        "sku": "12345",\
                                        "quantity": "10",\
                                        "description": ""})
        self.assertIn(b'{"data":"invalid input","status":400}', result2.data)

        # test invalid input: not str(sku).isalnum()
        result3 = self.client.post("/api/create_inventory",
                                  json={"warehouseId": "1",\
                                        "productName": "TEST",\
                                        "sku": "1!324",\
                                        "quantity": "10",\
                                        "description": ""})
        self.assertIn(b'{"data":"invalid input","status":400}', result3.data)

        # test invalid input: not str(quantity).isnumeric()
        result4 = self.client.post("/api/create_inventory",
                                  json={"warehouseId": "1",\
                                        "productName": "TEST",\
                                        "sku": "12324",\
                                        "quantity": "A",\
                                        "description": ""})
        self.assertIn(b'{"data":"invalid input","status":400}', result4.data)

        # test invalid input: warehouseId == ""
        result5 = self.client.post("/api/create_inventory",
                                  json={"warehouseId": "",\
                                        "productName": "TEST",\
                                        "sku": "12345",\
                                        "quantity": "10",\
                                        "description": ""})
        self.assertIn(b'{"data":"invalid input","status":400}', result5.data)

        # test invalid input: productName == ""
        result6 = self.client.post("/api/create_inventory",
                                  json={"warehouseId": "1",\
                                        "productName": "",\
                                        "sku": "12345",\
                                        "quantity": "10",\
                                        "description": ""})
        self.assertIn(b'{"data":"invalid input","status":400}', result6.data)

        # test invalid input: sku == ""
        result7 = self.client.post("/api/create_inventory",
                                  json={"warehouseId": "1",\
                                        "productName": "TEST",\
                                        "sku": "",\
                                        "quantity": "10",\
                                        "description": ""})
        self.assertIn(b'{"data":"invalid input","status":400}', result7.data)

        # test invalid input: quantity == ""
        result8 = self.client.post("/api/create_inventory",
                                  json={"warehouseId": "1",\
                                        "productName": "TEST",\
                                        "sku": "12345",\
                                        "quantity": "",\
                                        "description": ""})
        self.assertIn(b'{"data":"invalid input","status":400}', result8.data)

        # test invalid input: int(quantity) < 0
        result9 = self.client.post("/api/create_inventory",
                                  json={"warehouseId": "1",\
                                        "productName": "TEST",\
                                        "sku": "12345",\
                                        "quantity": "-1",\
                                        "description": ""})
        self.assertIn(b'{"data":"invalid input","status":400}', result9.data)

    def test_read_inventory(self):
        """Test read inventory route."""

        result = self.client.get("/api/inventory")
        print(result.data)
        self.assertIn(b'"deleted":false', result.data)
        self.assertNotIn(b'"deleted":true', result.data)

    def test_read_deleted_inventory(self):
        """Test read deleted inventory route."""

        result = self.client.get("/api/deleted_inventory")
        self.assertIn(b'"deleted":true', result.data)
        self.assertNotIn(b'"deleted":false', result.data)

    def test_update_inventory(self):
        """Test update inventory route."""

        # test successful update
        result = self.client.post("/api/update_inventory/id:1",
                                  json={"warehouseId": "2",\
                                        "productName": "Orange Chocolate",\
                                        "sku": "0000005",\
                                        "quantity": "100",\
                                        "description": ""})
        self.assertIn(b'"status":200', result.data)
        self.assertIn(b'"product_name":"Orange Chocolate"', result.data)
        self.assertNotIn(b'"product_name":"Milk Chocolate"', result.data)

        # test update non-existing item
        result2 = self.client.post("/api/update_inventory/id:100",
                                  json={"warehouseId": "2",\
                                        "productName": "Orange Chocolate",\
                                        "sku": "0000005",\
                                        "quantity": "0",\
                                        "description": ""})
        self.assertIn(b'{"data":"item does not exist","status":400}', result2.data)

    def test_delete_inventory(self):
        """Test delete inventory route."""

        # test successful delete
        result = self.client.post("/api/delete_inventory/id:1",
                                  json={"comments": ""})
        self.assertIn(b'"inventory_id":1', result.data)
        self.assertNotIn(b'"inventory_id":2', result.data)
        self.assertIn(b'"deleted":true', result.data)
        self.assertNotIn(b'"deleted":false', result.data)

        # test delete already deleted item
        result2 = self.client.post("/api/delete_inventory/id:1")
        self.assertIn(b'{"data":"item is already deleted","status":400}', result2.data)

        # test delete non-existing item
        result3 = self.client.post("/api/restore_inventory/id:100")
        self.assertIn(b'{"data":"item does not exist","status":400}', result3.data)

    def test_restore_inventory(self):
        """Test restore inventory route."""

        # test successful restore
        result = self.client.post("/api/restore_inventory/id:5")
        self.assertIn(b'"inventory_id":5', result.data)
        self.assertNotIn(b'"inventory_id":1', result.data)
        self.assertIn(b'"deleted":false', result.data)
        self.assertNotIn(b'"deleted":true', result.data)

        # test restore not deleted item
        result2 = self.client.post("/api/restore_inventory/id:1")
        self.assertIn(b'{"data":"item is already active","status":400}', result2.data)

        # test restore non-existing item
        result3 = self.client.post("/api/restore_inventory/id:100")
        self.assertIn(b'{"data":"item does not exist","status":400}', result3.data)


if __name__ == "__main__":
    import unittest

    unittest.main()
