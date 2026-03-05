"""
Test granular role-based access control (RBAC) for GYS Intranet Portal
Tests permissions for Admin, Editor, and Viewer roles across CMS sections:
news, events, gallery, employees, pages, menus, hero, ticker
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')

# Test credentials from requirements
ADMIN_CREDS = {"email": "admin@gys.co.id", "password": "admin123"}
EDITOR_CREDS = {"email": "editor@gys.co.id", "password": "editor123"}  # has ['news', 'events'] permissions
VIEWER_CREDS = {"email": "viewer@gys.co.id", "password": "viewer123"}  # has ['gallery'] permissions


class TestLoginAndPermissions:
    """Test login response includes permissions array"""
    
    def test_admin_login_returns_user_with_role(self):
        """Admin login should return user object with role=admin"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=ADMIN_CREDS)
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "token" in data, "Login response should contain token"
        assert "user" in data, "Login response should contain user object"
        assert data["user"]["role"] == "admin", f"Expected admin role, got {data['user']['role']}"
        print(f"PASS: Admin login successful, role={data['user']['role']}")
    
    def test_editor_login_returns_permissions_array(self):
        """Editor login should return permissions array in user object"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=EDITOR_CREDS)
        assert response.status_code == 200, f"Editor login failed: {response.text}"
        data = response.json()
        assert "user" in data, "Login response should contain user object"
        assert "permissions" in data["user"], "User object should contain permissions array"
        assert isinstance(data["user"]["permissions"], list), "Permissions should be a list"
        print(f"PASS: Editor login successful, permissions={data['user']['permissions']}")
    
    def test_viewer_login_returns_permissions_array(self):
        """Viewer login should return permissions array in user object"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=VIEWER_CREDS)
        assert response.status_code == 200, f"Viewer login failed: {response.text}"
        data = response.json()
        assert "user" in data, "Login response should contain user object"
        assert "permissions" in data["user"], "User object should contain permissions array"
        print(f"PASS: Viewer login successful, permissions={data['user']['permissions']}")


class TestAuthMeEndpoint:
    """Test /api/auth/me returns permissions for logged-in user"""
    
    def test_auth_me_returns_permissions_for_editor(self):
        """GET /api/auth/me should return permissions for editor"""
        # Login as editor
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json=EDITOR_CREDS)
        assert login_resp.status_code == 200, f"Editor login failed: {login_resp.text}"
        token = login_resp.json()["token"]
        
        # Call /api/auth/me
        me_resp = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_resp.status_code == 200, f"GET /api/auth/me failed: {me_resp.text}"
        data = me_resp.json()
        assert "permissions" in data, "/api/auth/me should return permissions"
        assert isinstance(data["permissions"], list), "Permissions should be a list"
        print(f"PASS: /api/auth/me returns permissions={data['permissions']}")
    
    def test_auth_me_returns_permissions_for_viewer(self):
        """GET /api/auth/me should return permissions for viewer"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json=VIEWER_CREDS)
        assert login_resp.status_code == 200, f"Viewer login failed: {login_resp.text}"
        token = login_resp.json()["token"]
        
        me_resp = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_resp.status_code == 200, f"GET /api/auth/me failed: {me_resp.text}"
        data = me_resp.json()
        assert "permissions" in data, "/api/auth/me should return permissions"
        print(f"PASS: Viewer /api/auth/me returns permissions={data['permissions']}")


class TestEditorPermissions:
    """Test editor can access only their permitted sections for write operations"""
    
    @pytest.fixture(autouse=True)
    def setup_editor_token(self):
        """Login as editor and get token"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json=EDITOR_CREDS)
        assert login_resp.status_code == 200, f"Editor login failed: {login_resp.text}"
        self.editor_token = login_resp.json()["token"]
        self.editor_perms = login_resp.json()["user"].get("permissions", [])
        print(f"Editor permissions: {self.editor_perms}")
    
    def test_editor_with_news_permission_can_post_news(self):
        """Editor WITH 'news' permission can POST /api/news (should succeed 200/201)"""
        # Skip if editor doesn't have news permission
        if "news" not in self.editor_perms:
            pytest.skip("Editor doesn't have news permission - skipping")
        
        news_data = {
            "title": "TEST_Permission_News",
            "summary": "Test summary for permission testing",
            "content": "Test content for permission testing",
            "image_url": "https://example.com/test.jpg",
            "is_featured": False
        }
        response = requests.post(
            f"{BASE_URL}/api/news",
            json=news_data,
            headers={"Authorization": f"Bearer {self.editor_token}"}
        )
        assert response.status_code in [200, 201], f"Editor with news permission should be able to create news. Got: {response.status_code} - {response.text}"
        print(f"PASS: Editor with 'news' permission can POST /api/news - status {response.status_code}")
        
        # Cleanup - delete the test news
        if response.status_code in [200, 201]:
            news_id = response.json().get("id")
            if news_id:
                requests.delete(
                    f"{BASE_URL}/api/news/{news_id}",
                    headers={"Authorization": f"Bearer {self.editor_token}"}
                )
    
    def test_editor_with_events_permission_can_post_events(self):
        """Editor WITH 'events' permission can POST /api/events"""
        if "events" not in self.editor_perms:
            pytest.skip("Editor doesn't have events permission - skipping")
        
        event_data = {
            "title": "TEST_Permission_Event",
            "description": "Test event for permission testing",
            "event_date": "2026-03-15",
            "event_type": "meeting"
        }
        response = requests.post(
            f"{BASE_URL}/api/events",
            json=event_data,
            headers={"Authorization": f"Bearer {self.editor_token}"}
        )
        assert response.status_code in [200, 201], f"Editor with events permission should be able to create events. Got: {response.status_code} - {response.text}"
        print(f"PASS: Editor with 'events' permission can POST /api/events - status {response.status_code}")
        
        # Cleanup
        if response.status_code in [200, 201]:
            event_id = response.json().get("id")
            if event_id:
                requests.delete(
                    f"{BASE_URL}/api/events/{event_id}",
                    headers={"Authorization": f"Bearer {self.editor_token}"}
                )
    
    def test_editor_without_employees_permission_gets_403(self):
        """Editor WITHOUT 'employees' permission gets 403 on POST /api/employees"""
        if "employees" in self.editor_perms:
            pytest.skip("Editor has employees permission - skipping negative test")
        
        employee_data = {
            "name": "TEST_Permission_Employee",
            "email": "test@example.com",
            "position": "Tester",
            "department": "QA",
            "phone": "1234567890"
        }
        response = requests.post(
            f"{BASE_URL}/api/employees",
            json=employee_data,
            headers={"Authorization": f"Bearer {self.editor_token}"}
        )
        assert response.status_code == 403, f"Editor without employees permission should get 403. Got: {response.status_code} - {response.text}"
        print(f"PASS: Editor without 'employees' permission gets 403 on POST /api/employees")
    
    def test_editor_without_gallery_permission_gets_403_on_albums(self):
        """Editor WITHOUT 'gallery' permission gets 403 on POST /api/albums"""
        if "gallery" in self.editor_perms:
            pytest.skip("Editor has gallery permission - skipping negative test")
        
        album_data = {
            "title": "TEST_Permission_Album",
            "description": "Test album for permission testing"
        }
        response = requests.post(
            f"{BASE_URL}/api/albums",
            json=album_data,
            headers={"Authorization": f"Bearer {self.editor_token}"}
        )
        assert response.status_code == 403, f"Editor without gallery permission should get 403. Got: {response.status_code} - {response.text}"
        print(f"PASS: Editor without 'gallery' permission gets 403 on POST /api/albums")


class TestViewerPermissions:
    """Test viewer gets 403 on ALL write endpoints even if they have section permission"""
    
    @pytest.fixture(autouse=True)
    def setup_viewer_token(self):
        """Login as viewer and get token"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json=VIEWER_CREDS)
        assert login_resp.status_code == 200, f"Viewer login failed: {login_resp.text}"
        self.viewer_token = login_resp.json()["token"]
        self.viewer_perms = login_resp.json()["user"].get("permissions", [])
        print(f"Viewer permissions: {self.viewer_perms}")
    
    def test_viewer_gets_403_on_post_news(self):
        """Viewer gets 403 on POST /api/news even if they have the permission"""
        news_data = {
            "title": "TEST_Viewer_News",
            "summary": "This should not be created",
            "content": "This should not be created",
            "image_url": "https://example.com/test.jpg",
            "is_featured": False
        }
        response = requests.post(
            f"{BASE_URL}/api/news",
            json=news_data,
            headers={"Authorization": f"Bearer {self.viewer_token}"}
        )
        assert response.status_code == 403, f"Viewer should get 403 on POST /api/news. Got: {response.status_code} - {response.text}"
        print(f"PASS: Viewer gets 403 on POST /api/news")
    
    def test_viewer_gets_403_on_post_events(self):
        """Viewer gets 403 on POST /api/events"""
        event_data = {
            "title": "TEST_Viewer_Event",
            "description": "This should not be created",
            "event_date": "2026-03-15",
            "event_type": "meeting"
        }
        response = requests.post(
            f"{BASE_URL}/api/events",
            json=event_data,
            headers={"Authorization": f"Bearer {self.viewer_token}"}
        )
        assert response.status_code == 403, f"Viewer should get 403 on POST /api/events. Got: {response.status_code} - {response.text}"
        print(f"PASS: Viewer gets 403 on POST /api/events")
    
    def test_viewer_gets_403_on_post_albums(self):
        """Viewer gets 403 on POST /api/albums even with gallery permission"""
        album_data = {
            "title": "TEST_Viewer_Album",
            "description": "This should not be created"
        }
        response = requests.post(
            f"{BASE_URL}/api/albums",
            json=album_data,
            headers={"Authorization": f"Bearer {self.viewer_token}"}
        )
        assert response.status_code == 403, f"Viewer should get 403 on POST /api/albums. Got: {response.status_code} - {response.text}"
        print(f"PASS: Viewer gets 403 on POST /api/albums")
    
    def test_viewer_gets_403_on_post_employees(self):
        """Viewer gets 403 on POST /api/employees"""
        employee_data = {
            "name": "TEST_Viewer_Employee",
            "email": "viewer@example.com",
            "position": "Viewer",
            "department": "Test",
            "phone": "1234567890"
        }
        response = requests.post(
            f"{BASE_URL}/api/employees",
            json=employee_data,
            headers={"Authorization": f"Bearer {self.viewer_token}"}
        )
        assert response.status_code == 403, f"Viewer should get 403 on POST /api/employees. Got: {response.status_code} - {response.text}"
        print(f"PASS: Viewer gets 403 on POST /api/employees")
    
    def test_viewer_gets_403_on_put_hero_settings(self):
        """Viewer gets 403 on PUT /api/settings/hero"""
        hero_data = {
            "hero_title_line1": "TEST_Viewer_Update"
        }
        response = requests.put(
            f"{BASE_URL}/api/settings/hero",
            json=hero_data,
            headers={"Authorization": f"Bearer {self.viewer_token}"}
        )
        assert response.status_code == 403, f"Viewer should get 403 on PUT /api/settings/hero. Got: {response.status_code} - {response.text}"
        print(f"PASS: Viewer gets 403 on PUT /api/settings/hero")
    
    def test_viewer_gets_403_on_put_ticker_settings(self):
        """Viewer gets 403 on PUT /api/settings/ticker"""
        ticker_data = {
            "manual_text": "TEST_Viewer_Update"
        }
        response = requests.put(
            f"{BASE_URL}/api/settings/ticker",
            json=ticker_data,
            headers={"Authorization": f"Bearer {self.viewer_token}"}
        )
        assert response.status_code == 403, f"Viewer should get 403 on PUT /api/settings/ticker. Got: {response.status_code} - {response.text}"
        print(f"PASS: Viewer gets 403 on PUT /api/settings/ticker")


class TestAdminFullAccess:
    """Test admin can access ALL write endpoints regardless of permissions field"""
    
    @pytest.fixture(autouse=True)
    def setup_admin_token(self):
        """Login as admin and get token"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json=ADMIN_CREDS)
        assert login_resp.status_code == 200, f"Admin login failed: {login_resp.text}"
        self.admin_token = login_resp.json()["token"]
        print(f"Admin logged in successfully")
    
    def test_admin_can_post_news(self):
        """Admin can always access POST /api/news"""
        news_data = {
            "title": "TEST_Admin_News",
            "summary": "Admin should be able to create this",
            "content": "Admin should be able to create this",
            "image_url": "https://example.com/test.jpg",
            "is_featured": False
        }
        response = requests.post(
            f"{BASE_URL}/api/news",
            json=news_data,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code in [200, 201], f"Admin should be able to create news. Got: {response.status_code} - {response.text}"
        print(f"PASS: Admin can POST /api/news - status {response.status_code}")
        
        # Cleanup
        if response.status_code in [200, 201]:
            news_id = response.json().get("id")
            if news_id:
                requests.delete(
                    f"{BASE_URL}/api/news/{news_id}",
                    headers={"Authorization": f"Bearer {self.admin_token}"}
                )
    
    def test_admin_can_post_employees(self):
        """Admin can always access POST /api/employees"""
        employee_data = {
            "name": "TEST_Admin_Employee",
            "email": "test_admin@example.com",
            "position": "Admin Test",
            "department": "Test",
            "phone": "1234567890"
        }
        response = requests.post(
            f"{BASE_URL}/api/employees",
            json=employee_data,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code in [200, 201], f"Admin should be able to create employees. Got: {response.status_code} - {response.text}"
        print(f"PASS: Admin can POST /api/employees - status {response.status_code}")
        
        # Cleanup
        if response.status_code in [200, 201]:
            emp_id = response.json().get("id")
            if emp_id:
                requests.delete(
                    f"{BASE_URL}/api/employees/{emp_id}",
                    headers={"Authorization": f"Bearer {self.admin_token}"}
                )
    
    def test_admin_can_post_albums(self):
        """Admin can always access POST /api/albums"""
        album_data = {
            "title": "TEST_Admin_Album",
            "description": "Admin should be able to create this"
        }
        response = requests.post(
            f"{BASE_URL}/api/albums",
            json=album_data,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code in [200, 201], f"Admin should be able to create albums. Got: {response.status_code} - {response.text}"
        print(f"PASS: Admin can POST /api/albums - status {response.status_code}")
        
        # Cleanup
        if response.status_code in [200, 201]:
            album_id = response.json().get("id")
            if album_id:
                requests.delete(
                    f"{BASE_URL}/api/albums/{album_id}",
                    headers={"Authorization": f"Bearer {self.admin_token}"}
                )
    
    def test_admin_can_update_hero_settings(self):
        """Admin can always access PUT /api/settings/hero"""
        hero_data = {
            "hero_title_line1": "TEST_Admin_Update"
        }
        response = requests.put(
            f"{BASE_URL}/api/settings/hero",
            json=hero_data,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200, f"Admin should be able to update hero settings. Got: {response.status_code} - {response.text}"
        print(f"PASS: Admin can PUT /api/settings/hero - status {response.status_code}")
    
    def test_admin_can_update_ticker_settings(self):
        """Admin can always access PUT /api/settings/ticker"""
        ticker_data = {
            "manual_text": "TEST_Admin_Ticker_Update"
        }
        response = requests.put(
            f"{BASE_URL}/api/settings/ticker",
            json=ticker_data,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200, f"Admin should be able to update ticker settings. Got: {response.status_code} - {response.text}"
        print(f"PASS: Admin can PUT /api/settings/ticker - status {response.status_code}")


class TestUserCreationWithPermissions:
    """Test admin can create users with specific permissions"""
    
    @pytest.fixture(autouse=True)
    def setup_admin_token(self):
        """Login as admin and get token"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json=ADMIN_CREDS)
        assert login_resp.status_code == 200, f"Admin login failed: {login_resp.text}"
        self.admin_token = login_resp.json()["token"]
    
    def test_admin_can_create_editor_with_specific_permissions(self):
        """Admin can create editor with specific permissions (e.g., ['news','events'])"""
        user_data = {
            "email": "TEST_editor_perm@gys.co.id",
            "password": "testpass123",
            "name": "Test Editor Permissions",
            "role": "editor",
            "permissions": ["news", "events"]
        }
        
        # Create user
        response = requests.post(
            f"{BASE_URL}/api/users",
            json=user_data,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code in [200, 201], f"Admin should be able to create editor with permissions. Got: {response.status_code} - {response.text}"
        
        created_user = response.json()
        assert created_user["role"] == "editor", f"Created user should have role=editor"
        assert "permissions" in created_user, "Created user should have permissions field"
        assert "news" in created_user["permissions"], "Created user should have 'news' permission"
        assert "events" in created_user["permissions"], "Created user should have 'events' permission"
        print(f"PASS: Admin created editor with permissions={created_user['permissions']}")
        
        # Cleanup - delete the test user
        if response.status_code in [200, 201]:
            user_id = created_user.get("id")
            if user_id:
                requests.delete(
                    f"{BASE_URL}/api/users/{user_id}",
                    headers={"Authorization": f"Bearer {self.admin_token}"}
                )
    
    def test_admin_can_create_viewer_with_specific_permissions(self):
        """Admin can create viewer with specific permissions (e.g., ['gallery'])"""
        user_data = {
            "email": "TEST_viewer_perm@gys.co.id",
            "password": "testpass123",
            "name": "Test Viewer Permissions",
            "role": "viewer",
            "permissions": ["gallery"]
        }
        
        # Create user
        response = requests.post(
            f"{BASE_URL}/api/users",
            json=user_data,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code in [200, 201], f"Admin should be able to create viewer with permissions. Got: {response.status_code} - {response.text}"
        
        created_user = response.json()
        assert created_user["role"] == "viewer", f"Created user should have role=viewer"
        assert "permissions" in created_user, "Created user should have permissions field"
        assert "gallery" in created_user["permissions"], "Created user should have 'gallery' permission"
        print(f"PASS: Admin created viewer with permissions={created_user['permissions']}")
        
        # Cleanup
        if response.status_code in [200, 201]:
            user_id = created_user.get("id")
            if user_id:
                requests.delete(
                    f"{BASE_URL}/api/users/{user_id}",
                    headers={"Authorization": f"Bearer {self.admin_token}"}
                )


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
