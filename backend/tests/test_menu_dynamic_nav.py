"""
Tests for Dynamic CMS-driven Navigation
- GET /api/menus returns tree structure with children nested properly
- GET /api/menus?visible_only=true only returns visible items
- Admin CRUD operations for menu items
- Menu hierarchy validation
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL')

class TestMenuAPI:
    """Tests for Menu API endpoints"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip("Authentication failed - skipping authenticated tests")
    
    @pytest.fixture(scope="class")
    def auth_headers(self, auth_token):
        """Headers with auth token"""
        return {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }
    
    def test_seed_data(self):
        """Ensure seed data is loaded"""
        response = requests.post(f"{BASE_URL}/api/seed")
        assert response.status_code == 200
        print(f"Seed response: {response.json()}")
    
    def test_get_menus_tree_structure(self):
        """GET /api/menus returns tree structure with children nested"""
        response = requests.get(f"{BASE_URL}/api/menus")
        assert response.status_code == 200
        
        menus = response.json()
        assert isinstance(menus, list)
        assert len(menus) > 0, "Expected at least one menu item"
        
        # Check structure of first menu item
        first_item = menus[0]
        assert "id" in first_item
        assert "label" in first_item
        assert "children" in first_item, "Menu items should have 'children' field"
        
        print(f"Found {len(menus)} top-level menu items")
        for item in menus:
            print(f"  - {item['label']}: {len(item.get('children', []))} children")
    
    def test_get_menus_has_4_top_level_items(self):
        """Verify 4 top-level nav items: Corporate Identity, Operational/Compliance, Employee Services, Communication"""
        response = requests.get(f"{BASE_URL}/api/menus")
        assert response.status_code == 200
        
        menus = response.json()
        labels = [m['label'] for m in menus]
        
        expected = ["Corporate Identity", "Operational/Compliance", "Employee Services", "Communication"]
        for label in expected:
            assert label in labels, f"Expected '{label}' in top-level menus, got: {labels}"
        
        print(f"All 4 expected top-level items found: {expected}")
    
    def test_corporate_identity_has_correct_children(self):
        """Corporate Identity should have: Corporate Overview, Corporate Philosophy, Corporate History & Group Structure"""
        response = requests.get(f"{BASE_URL}/api/menus")
        assert response.status_code == 200
        
        menus = response.json()
        corp_identity = next((m for m in menus if m['label'] == 'Corporate Identity'), None)
        assert corp_identity is not None, "Corporate Identity not found"
        
        children = corp_identity.get('children', [])
        child_labels = [c['label'] for c in children]
        
        expected = ["Corporate Overview", "Corporate Philosophy", "Corporate History & Group Structure"]
        for label in expected:
            assert label in child_labels, f"Expected '{label}' in Corporate Identity children, got: {child_labels}"
        
        print(f"Corporate Identity children: {child_labels}")
    
    def test_communication_has_correct_children(self):
        """Communication should have: News & Announcements, Events Calendar, Photo Gallery"""
        response = requests.get(f"{BASE_URL}/api/menus")
        assert response.status_code == 200
        
        menus = response.json()
        communication = next((m for m in menus if m['label'] == 'Communication'), None)
        assert communication is not None, "Communication not found"
        
        children = communication.get('children', [])
        child_labels = [c['label'] for c in children]
        
        expected = ["News & Announcements", "Events Calendar", "Photo Gallery"]
        for label in expected:
            assert label in child_labels, f"Expected '{label}' in Communication children, got: {child_labels}"
        
        print(f"Communication children: {child_labels}")
    
    def test_get_menus_visible_only(self):
        """GET /api/menus?visible_only=true only returns visible items"""
        response = requests.get(f"{BASE_URL}/api/menus", params={"visible_only": True})
        assert response.status_code == 200
        
        menus = response.json()
        # All items should be visible
        for item in menus:
            assert item.get('is_visible', True) == True, f"Item {item['label']} should be visible"
            for child in item.get('children', []):
                assert child.get('is_visible', True) == True, f"Child {child['label']} should be visible"
        
        print(f"All {len(menus)} menu items are visible")
    
    def test_get_menus_flat(self, auth_headers):
        """GET /api/menus/flat returns flat list for admin"""
        response = requests.get(f"{BASE_URL}/api/menus/flat", headers=auth_headers)
        assert response.status_code == 200
        
        menus = response.json()
        assert isinstance(menus, list)
        print(f"Flat menu list has {len(menus)} items")
    
    def test_create_top_level_menu_item(self, auth_headers):
        """Admin can add a new top-level menu item"""
        new_item = {
            "label": "TEST_TopLevel",
            "path": "/test-path",
            "icon": "building",
            "parent_id": None,
            "is_visible": True,
            "order": 99
        }
        
        response = requests.post(f"{BASE_URL}/api/menus", json=new_item, headers=auth_headers)
        assert response.status_code == 200, f"Failed to create menu item: {response.text}"
        
        data = response.json()
        assert data['label'] == "TEST_TopLevel"
        assert data['path'] == "/test-path"
        assert 'id' in data
        
        # Store ID for cleanup
        TestMenuAPI.test_toplevel_id = data['id']
        print(f"Created top-level menu item: {data['id']}")
    
    def test_create_submenu_item(self, auth_headers):
        """Admin can add a submenu item under an existing parent"""
        # First get a parent menu (Corporate Identity)
        response = requests.get(f"{BASE_URL}/api/menus")
        menus = response.json()
        corp_identity = next((m for m in menus if m['label'] == 'Corporate Identity'), None)
        assert corp_identity is not None
        
        new_submenu = {
            "label": "TEST_Submenu",
            "path": "/test-submenu-path",
            "parent_id": corp_identity['id'],
            "is_visible": True,
            "order": 99
        }
        
        response = requests.post(f"{BASE_URL}/api/menus", json=new_submenu, headers=auth_headers)
        assert response.status_code == 200, f"Failed to create submenu: {response.text}"
        
        data = response.json()
        assert data['label'] == "TEST_Submenu"
        assert data['parent_id'] == corp_identity['id']
        
        TestMenuAPI.test_submenu_id = data['id']
        print(f"Created submenu item under Corporate Identity: {data['id']}")
    
    def test_toggle_visibility(self, auth_headers):
        """Admin can toggle visibility of a menu item"""
        # Get our test submenu
        menu_id = getattr(TestMenuAPI, 'test_submenu_id', None)
        if not menu_id:
            pytest.skip("Test submenu not created")
        
        # Toggle to hidden
        response = requests.put(
            f"{BASE_URL}/api/menus/{menu_id}", 
            json={"is_visible": False},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data['is_visible'] == False
        print(f"Menu item {menu_id} hidden")
        
        # Verify it doesn't appear in visible_only query
        response = requests.get(f"{BASE_URL}/api/menus", params={"visible_only": True})
        menus = response.json()
        all_ids = []
        for item in menus:
            all_ids.append(item['id'])
            for child in item.get('children', []):
                all_ids.append(child['id'])
        
        assert menu_id not in all_ids, "Hidden item should not appear in visible_only query"
        print("Hidden item correctly excluded from visible_only query")
        
        # Toggle back to visible
        response = requests.put(
            f"{BASE_URL}/api/menus/{menu_id}",
            json={"is_visible": True},
            headers=auth_headers
        )
        assert response.status_code == 200
    
    def test_update_menu_item(self, auth_headers):
        """Admin can update a menu item"""
        menu_id = getattr(TestMenuAPI, 'test_submenu_id', None)
        if not menu_id:
            pytest.skip("Test submenu not created")
        
        response = requests.put(
            f"{BASE_URL}/api/menus/{menu_id}",
            json={"label": "TEST_Submenu_Updated", "path": "/updated-path"},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data['label'] == "TEST_Submenu_Updated"
        assert data['path'] == "/updated-path"
        print(f"Menu item updated: {data['label']}")
    
    def test_delete_submenu_item(self, auth_headers):
        """Admin can delete a menu item"""
        menu_id = getattr(TestMenuAPI, 'test_submenu_id', None)
        if not menu_id:
            pytest.skip("Test submenu not created")
        
        response = requests.delete(f"{BASE_URL}/api/menus/{menu_id}", headers=auth_headers)
        assert response.status_code == 200
        print(f"Deleted submenu item: {menu_id}")
        
        # Verify deletion
        response = requests.get(f"{BASE_URL}/api/menus/flat", headers=auth_headers)
        menus = response.json()
        ids = [m['id'] for m in menus]
        assert menu_id not in ids, "Deleted item should not exist"
    
    def test_delete_toplevel_item(self, auth_headers):
        """Cleanup: Delete test top-level item"""
        menu_id = getattr(TestMenuAPI, 'test_toplevel_id', None)
        if not menu_id:
            pytest.skip("Test top-level item not created")
        
        response = requests.delete(f"{BASE_URL}/api/menus/{menu_id}", headers=auth_headers)
        assert response.status_code == 200
        print(f"Deleted top-level item: {menu_id}")


class TestMenuHierarchy:
    """Tests for menu hierarchy and nesting"""
    
    def test_children_are_properly_nested(self):
        """Children items should be nested under their parents"""
        response = requests.get(f"{BASE_URL}/api/menus")
        assert response.status_code == 200
        
        menus = response.json()
        
        # For each parent, check children have correct parent_id
        for parent in menus:
            for child in parent.get('children', []):
                assert child.get('parent_id') == parent['id'], \
                    f"Child {child['label']} should have parent_id={parent['id']}"
        
        print("All children properly nested under their parents")
    
    def test_menu_items_ordered_correctly(self):
        """Menu items should be ordered by 'order' field"""
        response = requests.get(f"{BASE_URL}/api/menus")
        assert response.status_code == 200
        
        menus = response.json()
        
        # Check root level ordering
        orders = [m.get('order', 0) for m in menus]
        assert orders == sorted(orders), f"Root items not ordered: {orders}"
        
        # Check children ordering
        for parent in menus:
            children = parent.get('children', [])
            if children:
                child_orders = [c.get('order', 0) for c in children]
                assert child_orders == sorted(child_orders), \
                    f"Children of {parent['label']} not ordered: {child_orders}"
        
        print("All menu items are correctly ordered")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
