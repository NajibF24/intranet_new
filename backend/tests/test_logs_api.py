"""
Test Activity Log API endpoints - Admin only access
Tests: /api/logs, /api/logs/count, category filtering, admin access control
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestLogsAPI:
    """Activity Log endpoint tests - admin only access"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        return response.json().get("token")
    
    @pytest.fixture(scope="class")
    def editor_token(self):
        """Get non-admin (editor) authentication token"""
        # First try to register
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": "TEST_editor_logs@gys.co.id",
            "password": "test123",
            "name": "Test Editor",
            "role": "editor",
            "permissions": []
        })
        # Then login
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "TEST_editor_logs@gys.co.id",
            "password": "test123"
        })
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip("Could not create test editor user")

    def test_get_logs_admin_success(self, admin_token):
        """Test GET /api/logs returns log entries for admin"""
        response = requests.get(
            f"{BASE_URL}/api/logs?limit=10",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        # Status assertion
        assert response.status_code == 200
        
        # Data assertions
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        
        # Verify log entry structure if there are logs
        if len(data) > 0:
            log = data[0]
            assert "id" in log
            assert "timestamp" in log
            assert "user_email" in log
            assert "action" in log
            assert "category" in log
    
    def test_get_logs_count_admin_success(self, admin_token):
        """Test GET /api/logs/count returns count for admin"""
        response = requests.get(
            f"{BASE_URL}/api/logs/count",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        # Status assertion
        assert response.status_code == 200
        
        # Data assertions
        data = response.json()
        assert "count" in data
        assert isinstance(data["count"], int)
        assert data["count"] >= 0
    
    def test_get_logs_filter_by_category(self, admin_token):
        """Test GET /api/logs?category=auth filters correctly"""
        response = requests.get(
            f"{BASE_URL}/api/logs?category=auth&limit=50",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        # Status assertion
        assert response.status_code == 200
        
        # Data assertions
        data = response.json()
        assert isinstance(data, list)
        
        # All returned logs should be in auth category
        for log in data:
            assert log["category"] == "auth", f"Expected category 'auth', got '{log['category']}'"
    
    def test_get_logs_non_admin_forbidden(self, editor_token):
        """Test GET /api/logs returns 403 for non-admin users"""
        response = requests.get(
            f"{BASE_URL}/api/logs",
            headers={"Authorization": f"Bearer {editor_token}"}
        )
        
        # Status assertion - should be forbidden
        assert response.status_code == 403
        
        # Data assertions
        data = response.json()
        assert "detail" in data
        assert "admin" in data["detail"].lower() or "access" in data["detail"].lower()
    
    def test_get_logs_count_non_admin_forbidden(self, editor_token):
        """Test GET /api/logs/count returns 403 for non-admin users"""
        response = requests.get(
            f"{BASE_URL}/api/logs/count",
            headers={"Authorization": f"Bearer {editor_token}"}
        )
        
        # Status assertion - should be forbidden
        assert response.status_code == 403
    
    def test_get_logs_unauthenticated_forbidden(self):
        """Test GET /api/logs returns 401/403 for unauthenticated users"""
        response = requests.get(f"{BASE_URL}/api/logs")
        
        # Should be unauthorized or forbidden
        assert response.status_code in [401, 403, 422], f"Expected 401/403/422, got {response.status_code}"
    
    def test_login_creates_log_entry(self, admin_token):
        """Test that login action creates a log entry"""
        # Get current count
        count_response = requests.get(
            f"{BASE_URL}/api/logs/count?category=auth",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        initial_count = count_response.json()["count"]
        
        # Perform a login
        requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        
        # Get new count
        new_count_response = requests.get(
            f"{BASE_URL}/api/logs/count?category=auth",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        new_count = new_count_response.json()["count"]
        
        # Verify log was created
        assert new_count > initial_count, "Login should create a log entry"
        
        # Verify the log entry content
        logs_response = requests.get(
            f"{BASE_URL}/api/logs?category=auth&limit=1",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        latest_log = logs_response.json()[0]
        assert latest_log["action"] == "login"
        assert latest_log["user_email"] == "admin@gys.co.id"


class TestLogsAPIDataValidation:
    """Test log data structure and validation"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        assert response.status_code == 200
        return response.json().get("token")
    
    def test_log_entry_has_required_fields(self, admin_token):
        """Verify log entries have all required fields"""
        response = requests.get(
            f"{BASE_URL}/api/logs?limit=1",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            log = data[0]
            required_fields = ["id", "timestamp", "user_email", "action", "category"]
            for field in required_fields:
                assert field in log, f"Missing required field: {field}"
    
    def test_pagination_works(self, admin_token):
        """Test pagination with skip and limit parameters"""
        # Get first page
        page1_response = requests.get(
            f"{BASE_URL}/api/logs?limit=2&skip=0",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert page1_response.status_code == 200
        page1 = page1_response.json()
        
        # Get second page
        page2_response = requests.get(
            f"{BASE_URL}/api/logs?limit=2&skip=2",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert page2_response.status_code == 200
        page2 = page2_response.json()
        
        # If we have enough logs, pages should be different
        if len(page1) > 0 and len(page2) > 0:
            assert page1[0]["id"] != page2[0]["id"], "Pagination should return different logs"
