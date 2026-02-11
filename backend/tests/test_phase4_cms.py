"""
Phase 4 CMS Tests - Page and Menu Management
Tests for:
- Page CRUD operations
- Page publish/unpublish toggle
- Page duplicate functionality
- Menu item CRUD
- Menu item visibility toggle
- Menu reordering
- Dynamic page rendering by slug
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL')

class TestPageManagement:
    """Page Management API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Login and get auth token"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login as admin
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        self.token = login_response.json()["token"]
        self.session.headers.update({"Authorization": f"Bearer {self.token}"})
    
    def test_get_templates(self):
        """Test GET /api/templates - returns available page templates"""
        response = self.session.get(f"{BASE_URL}/api/templates")
        assert response.status_code == 200
        
        templates = response.json()
        assert isinstance(templates, list)
        assert len(templates) >= 1
        
        # Check template structure
        template_ids = [t["id"] for t in templates]
        assert "blank" in template_ids
        
        for template in templates:
            assert "id" in template
            assert "name" in template
            assert "description" in template
            assert "blocks" in template
        print(f"PASS: GET /api/templates returns {len(templates)} templates")
    
    def test_get_pages_list(self):
        """Test GET /api/pages - returns list of pages"""
        response = self.session.get(f"{BASE_URL}/api/pages")
        assert response.status_code == 200
        
        pages = response.json()
        assert isinstance(pages, list)
        print(f"PASS: GET /api/pages returns {len(pages)} pages")
    
    def test_get_published_pages_only(self):
        """Test GET /api/pages?published_only=true - filters published pages"""
        response = self.session.get(f"{BASE_URL}/api/pages", params={"published_only": True})
        assert response.status_code == 200
        
        pages = response.json()
        for page in pages:
            assert page["is_published"] == True
        print(f"PASS: GET /api/pages?published_only=true returns only published pages")
    
    def test_create_page_with_blank_template(self):
        """Test POST /api/pages - create page with blank template"""
        import time
        timestamp = int(time.time())
        
        page_data = {
            "title": f"TEST_Page_{timestamp}",
            "slug": f"test-page-{timestamp}",
            "template": "blank",
            "blocks": [],
            "is_published": False
        }
        
        response = self.session.post(f"{BASE_URL}/api/pages", json=page_data)
        assert response.status_code == 200, f"Create page failed: {response.text}"
        
        created_page = response.json()
        assert created_page["title"] == page_data["title"]
        assert created_page["slug"] == page_data["slug"]
        assert created_page["is_published"] == False
        assert "id" in created_page
        
        # Store for cleanup
        self.created_page_id = created_page["id"]
        print(f"PASS: POST /api/pages created page with id {created_page['id']}")
        
        return created_page
    
    def test_create_page_with_content_template(self):
        """Test POST /api/pages - create page with content template"""
        import time
        timestamp = int(time.time())
        
        page_data = {
            "title": f"TEST_Content_Page_{timestamp}",
            "slug": f"test-content-{timestamp}",
            "template": "content",
            "blocks": [
                {"type": "hero_simple", "content": {"title": "Test Hero", "subtitle": "Test subtitle"}, "order": 0},
                {"type": "text", "content": {"heading": "Test Heading", "body": "Test body content"}, "order": 1}
            ],
            "is_published": True
        }
        
        response = self.session.post(f"{BASE_URL}/api/pages", json=page_data)
        assert response.status_code == 200, f"Create page failed: {response.text}"
        
        created_page = response.json()
        assert len(created_page["blocks"]) == 2
        assert created_page["is_published"] == True
        
        # Store for cleanup
        self.content_page_id = created_page["id"]
        print(f"PASS: POST /api/pages created content page with {len(created_page['blocks'])} blocks")
        
        return created_page
    
    def test_get_page_by_id(self):
        """Test GET /api/pages/:id - get single page"""
        # First create a page
        import time
        timestamp = int(time.time())
        
        page_data = {
            "title": f"TEST_GetById_{timestamp}",
            "slug": f"test-getbyid-{timestamp}",
            "template": "blank",
            "blocks": [],
            "is_published": True
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/pages", json=page_data)
        assert create_response.status_code == 200
        page_id = create_response.json()["id"]
        
        # Now get the page by ID
        get_response = self.session.get(f"{BASE_URL}/api/pages/{page_id}")
        assert get_response.status_code == 200
        
        page = get_response.json()
        assert page["id"] == page_id
        assert page["title"] == page_data["title"]
        print(f"PASS: GET /api/pages/{page_id} returns correct page")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/pages/{page_id}")
    
    def test_update_page(self):
        """Test PUT /api/pages/:id - update page"""
        import time
        timestamp = int(time.time())
        
        # Create a page
        page_data = {
            "title": f"TEST_Update_{timestamp}",
            "slug": f"test-update-{timestamp}",
            "template": "blank",
            "blocks": [],
            "is_published": False
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/pages", json=page_data)
        assert create_response.status_code == 200
        page_id = create_response.json()["id"]
        
        # Update the page
        update_data = {
            "title": f"TEST_Updated_{timestamp}",
            "blocks": [{"type": "text", "content": {"heading": "Updated", "body": "Updated content"}, "order": 0}],
            "is_published": True
        }
        
        update_response = self.session.put(f"{BASE_URL}/api/pages/{page_id}", json=update_data)
        assert update_response.status_code == 200
        
        updated_page = update_response.json()
        assert updated_page["title"] == update_data["title"]
        assert updated_page["is_published"] == True
        assert len(updated_page["blocks"]) == 1
        print(f"PASS: PUT /api/pages/{page_id} updated page successfully")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/pages/{page_id}")
    
    def test_publish_unpublish_toggle(self):
        """Test page publish/unpublish toggle via PUT"""
        import time
        timestamp = int(time.time())
        
        # Create unpublished page
        page_data = {
            "title": f"TEST_Toggle_{timestamp}",
            "slug": f"test-toggle-{timestamp}",
            "template": "blank",
            "blocks": [],
            "is_published": False
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/pages", json=page_data)
        assert create_response.status_code == 200
        page_id = create_response.json()["id"]
        
        # Toggle to published
        toggle_response = self.session.put(f"{BASE_URL}/api/pages/{page_id}", json={"is_published": True})
        assert toggle_response.status_code == 200
        assert toggle_response.json()["is_published"] == True
        print("PASS: Page toggled to published")
        
        # Toggle back to unpublished
        toggle_response = self.session.put(f"{BASE_URL}/api/pages/{page_id}", json={"is_published": False})
        assert toggle_response.status_code == 200
        assert toggle_response.json()["is_published"] == False
        print("PASS: Page toggled to unpublished")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/pages/{page_id}")
    
    def test_delete_page(self):
        """Test DELETE /api/pages/:id - delete page"""
        import time
        timestamp = int(time.time())
        
        # Create a page
        page_data = {
            "title": f"TEST_Delete_{timestamp}",
            "slug": f"test-delete-{timestamp}",
            "template": "blank",
            "blocks": [],
            "is_published": False
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/pages", json=page_data)
        assert create_response.status_code == 200
        page_id = create_response.json()["id"]
        
        # Delete the page
        delete_response = self.session.delete(f"{BASE_URL}/api/pages/{page_id}")
        assert delete_response.status_code == 200
        
        # Verify it's deleted
        get_response = self.session.get(f"{BASE_URL}/api/pages/{page_id}")
        assert get_response.status_code == 404
        print(f"PASS: DELETE /api/pages/{page_id} deleted page successfully")
    
    def test_duplicate_slug_rejected(self):
        """Test that duplicate slugs are rejected"""
        import time
        timestamp = int(time.time())
        
        page_data = {
            "title": f"TEST_Dupe_{timestamp}",
            "slug": f"test-dupe-{timestamp}",
            "template": "blank",
            "blocks": [],
            "is_published": False
        }
        
        # Create first page
        response1 = self.session.post(f"{BASE_URL}/api/pages", json=page_data)
        assert response1.status_code == 200
        page_id = response1.json()["id"]
        
        # Try to create second page with same slug
        response2 = self.session.post(f"{BASE_URL}/api/pages", json=page_data)
        assert response2.status_code == 400
        print("PASS: Duplicate slug correctly rejected with 400")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/pages/{page_id}")


class TestDynamicPageRendering:
    """Dynamic page rendering tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_get_published_page_by_slug(self):
        """Test GET /api/pages/slug/:slug - returns published page"""
        # Test with existing 'about-gys' page
        response = self.session.get(f"{BASE_URL}/api/pages/slug/about-gys")
        assert response.status_code == 200
        
        page = response.json()
        assert page["slug"] == "about-gys"
        assert page["is_published"] == True
        assert "blocks" in page
        print(f"PASS: GET /api/pages/slug/about-gys returns published page with {len(page['blocks'])} blocks")
    
    def test_unpublished_page_returns_404(self):
        """Test that unpublished pages return 404 on public slug endpoint"""
        # First login to create an unpublished page
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        token = login_response.json()["token"]
        self.session.headers.update({"Authorization": f"Bearer {token}"})
        
        import time
        timestamp = int(time.time())
        
        # Create unpublished page
        page_data = {
            "title": f"TEST_Unpub_{timestamp}",
            "slug": f"test-unpublished-{timestamp}",
            "template": "blank",
            "blocks": [],
            "is_published": False
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/pages", json=page_data)
        assert create_response.status_code == 200
        page_id = create_response.json()["id"]
        slug = page_data["slug"]
        
        # Remove auth header to test as public user
        del self.session.headers["Authorization"]
        
        # Try to access unpublished page by slug
        response = self.session.get(f"{BASE_URL}/api/pages/slug/{slug}")
        assert response.status_code == 404
        print(f"PASS: Unpublished page /api/pages/slug/{slug} returns 404")
        
        # Cleanup - re-add auth
        self.session.headers.update({"Authorization": f"Bearer {token}"})
        self.session.delete(f"{BASE_URL}/api/pages/{page_id}")
    
    def test_nonexistent_slug_returns_404(self):
        """Test that non-existent slugs return 404"""
        response = self.session.get(f"{BASE_URL}/api/pages/slug/this-page-does-not-exist-12345")
        assert response.status_code == 404
        print("PASS: Non-existent slug returns 404")


class TestMenuManagement:
    """Menu Management API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Login and get auth token"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login as admin
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        assert login_response.status_code == 200
        self.token = login_response.json()["token"]
        self.session.headers.update({"Authorization": f"Bearer {self.token}"})
    
    def test_get_menus_empty(self):
        """Test GET /api/menus - returns empty list initially"""
        response = self.session.get(f"{BASE_URL}/api/menus")
        assert response.status_code == 200
        menus = response.json()
        assert isinstance(menus, list)
        print(f"PASS: GET /api/menus returns {len(menus)} menu items")
    
    def test_get_menus_flat(self):
        """Test GET /api/menus/flat - returns flat list of all menu items"""
        response = self.session.get(f"{BASE_URL}/api/menus/flat")
        assert response.status_code == 200
        menus = response.json()
        assert isinstance(menus, list)
        print(f"PASS: GET /api/menus/flat returns flat list")
    
    def test_create_top_level_menu_item(self):
        """Test POST /api/menus - create top-level menu item"""
        import time
        timestamp = int(time.time())
        
        menu_data = {
            "label": f"TEST_Menu_{timestamp}",
            "path": "/test-path",
            "icon": "building",
            "is_visible": True,
            "order": 0
        }
        
        response = self.session.post(f"{BASE_URL}/api/menus", json=menu_data)
        assert response.status_code == 200, f"Create menu failed: {response.text}"
        
        created_menu = response.json()
        assert created_menu["label"] == menu_data["label"]
        assert created_menu["path"] == menu_data["path"]
        assert created_menu["is_visible"] == True
        assert "id" in created_menu
        print(f"PASS: POST /api/menus created menu item with id {created_menu['id']}")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/menus/{created_menu['id']}")
        
        return created_menu
    
    def test_create_menu_item_with_page_link(self):
        """Test POST /api/menus - create menu item linked to CMS page"""
        import time
        timestamp = int(time.time())
        
        # First get an existing page ID
        pages_response = self.session.get(f"{BASE_URL}/api/pages")
        pages = pages_response.json()
        
        if len(pages) > 0:
            page_id = pages[0]["id"]
            page_slug = pages[0]["slug"]
            
            menu_data = {
                "label": f"TEST_PageLink_{timestamp}",
                "path": f"/page/{page_slug}",
                "page_id": page_id,
                "is_visible": True,
                "order": 0
            }
            
            response = self.session.post(f"{BASE_URL}/api/menus", json=menu_data)
            assert response.status_code == 200
            
            created_menu = response.json()
            assert created_menu["page_id"] == page_id
            print(f"PASS: Menu item created with page_id link to {page_id}")
            
            # Cleanup
            self.session.delete(f"{BASE_URL}/api/menus/{created_menu['id']}")
        else:
            pytest.skip("No pages available to link")
    
    def test_create_submenu_item(self):
        """Test POST /api/menus - create submenu item under parent"""
        import time
        timestamp = int(time.time())
        
        # Create parent menu
        parent_data = {
            "label": f"TEST_Parent_{timestamp}",
            "path": "",
            "is_visible": True,
            "order": 0
        }
        
        parent_response = self.session.post(f"{BASE_URL}/api/menus", json=parent_data)
        assert parent_response.status_code == 200
        parent_id = parent_response.json()["id"]
        
        # Create child menu
        child_data = {
            "label": f"TEST_Child_{timestamp}",
            "path": "/child-path",
            "parent_id": parent_id,
            "is_visible": True,
            "order": 0
        }
        
        child_response = self.session.post(f"{BASE_URL}/api/menus", json=child_data)
        assert child_response.status_code == 200
        
        child_menu = child_response.json()
        assert child_menu["parent_id"] == parent_id
        print(f"PASS: Submenu item created with parent_id {parent_id}")
        
        # Verify parent now shows child in tree
        menus_response = self.session.get(f"{BASE_URL}/api/menus")
        menus = menus_response.json()
        
        parent_in_tree = next((m for m in menus if m["id"] == parent_id), None)
        assert parent_in_tree is not None
        assert len(parent_in_tree.get("children", [])) >= 1
        print(f"PASS: Parent menu shows {len(parent_in_tree['children'])} children in tree structure")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/menus/{parent_id}")  # This should delete children too
    
    def test_update_menu_item(self):
        """Test PUT /api/menus/:id - update menu item"""
        import time
        timestamp = int(time.time())
        
        # Create menu
        menu_data = {
            "label": f"TEST_Update_{timestamp}",
            "path": "/original",
            "is_visible": True,
            "order": 0
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/menus", json=menu_data)
        assert create_response.status_code == 200
        menu_id = create_response.json()["id"]
        
        # Update menu
        update_data = {
            "label": f"TEST_Updated_{timestamp}",
            "path": "/updated-path"
        }
        
        update_response = self.session.put(f"{BASE_URL}/api/menus/{menu_id}", json=update_data)
        assert update_response.status_code == 200
        
        updated_menu = update_response.json()
        assert updated_menu["label"] == update_data["label"]
        assert updated_menu["path"] == update_data["path"]
        print(f"PASS: PUT /api/menus/{menu_id} updated menu item")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/menus/{menu_id}")
    
    def test_toggle_menu_visibility(self):
        """Test toggling menu item visibility"""
        import time
        timestamp = int(time.time())
        
        # Create visible menu
        menu_data = {
            "label": f"TEST_Vis_{timestamp}",
            "path": "/visible",
            "is_visible": True,
            "order": 0
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/menus", json=menu_data)
        menu_id = create_response.json()["id"]
        
        # Toggle to hidden
        update_response = self.session.put(f"{BASE_URL}/api/menus/{menu_id}", json={"is_visible": False})
        assert update_response.status_code == 200
        assert update_response.json()["is_visible"] == False
        print("PASS: Menu visibility toggled to hidden")
        
        # Toggle back to visible
        update_response = self.session.put(f"{BASE_URL}/api/menus/{menu_id}", json={"is_visible": True})
        assert update_response.status_code == 200
        assert update_response.json()["is_visible"] == True
        print("PASS: Menu visibility toggled to visible")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/menus/{menu_id}")
    
    def test_delete_menu_item(self):
        """Test DELETE /api/menus/:id - delete menu item"""
        import time
        timestamp = int(time.time())
        
        # Create menu
        menu_data = {
            "label": f"TEST_Delete_{timestamp}",
            "path": "/delete-me",
            "is_visible": True,
            "order": 0
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/menus", json=menu_data)
        menu_id = create_response.json()["id"]
        
        # Delete menu
        delete_response = self.session.delete(f"{BASE_URL}/api/menus/{menu_id}")
        assert delete_response.status_code == 200
        
        # Verify deleted
        get_response = self.session.get(f"{BASE_URL}/api/menus/flat")
        menus = get_response.json()
        assert not any(m["id"] == menu_id for m in menus)
        print(f"PASS: DELETE /api/menus/{menu_id} deleted menu item")
    
    def test_reorder_menus(self):
        """Test PUT /api/menus/reorder - reorder menu items"""
        import time
        timestamp = int(time.time())
        
        # Create two menus
        menu1_data = {"label": f"TEST_Order1_{timestamp}", "path": "/order1", "is_visible": True, "order": 0}
        menu2_data = {"label": f"TEST_Order2_{timestamp}", "path": "/order2", "is_visible": True, "order": 1}
        
        menu1_response = self.session.post(f"{BASE_URL}/api/menus", json=menu1_data)
        menu1_id = menu1_response.json()["id"]
        
        menu2_response = self.session.post(f"{BASE_URL}/api/menus", json=menu2_data)
        menu2_id = menu2_response.json()["id"]
        
        # Reorder - swap positions
        reorder_data = [
            {"id": menu1_id, "order": 1},
            {"id": menu2_id, "order": 0}
        ]
        
        reorder_response = self.session.put(f"{BASE_URL}/api/menus/reorder", json=reorder_data)
        assert reorder_response.status_code == 200
        print("PASS: PUT /api/menus/reorder successfully reordered menus")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/menus/{menu1_id}")
        self.session.delete(f"{BASE_URL}/api/menus/{menu2_id}")


class TestAuthRequirements:
    """Test that page/menu operations require authentication"""
    
    def setup_method(self):
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_create_page_requires_auth(self):
        """Creating a page requires authentication"""
        response = self.session.post(f"{BASE_URL}/api/pages", json={
            "title": "Unauthorized Page",
            "slug": "unauthorized",
            "blocks": [],
            "is_published": False
        })
        assert response.status_code == 401
        print("PASS: POST /api/pages requires authentication (401)")
    
    def test_create_menu_requires_auth(self):
        """Creating a menu item requires authentication"""
        response = self.session.post(f"{BASE_URL}/api/menus", json={
            "label": "Unauthorized Menu",
            "path": "/unauthorized",
            "is_visible": True
        })
        assert response.status_code == 401
        print("PASS: POST /api/menus requires authentication (401)")
    
    def test_public_can_read_pages(self):
        """Public users can read pages list"""
        response = self.session.get(f"{BASE_URL}/api/pages")
        assert response.status_code == 200
        print("PASS: GET /api/pages is public (200)")
    
    def test_public_can_read_menus(self):
        """Public users can read menus list"""
        response = self.session.get(f"{BASE_URL}/api/menus")
        assert response.status_code == 200
        print("PASS: GET /api/menus is public (200)")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
