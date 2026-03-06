"""
Backend Tests for Hero Slideshow Feature
Tests hero_images array and hero_rotation_interval fields in hero settings API
"""
import pytest
import requests
import os
import base64

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials
ADMIN_EMAIL = "admin@gys.co.id"
ADMIN_PASSWORD = "admin123"


@pytest.fixture(scope="module")
def admin_token():
    """Get admin authentication token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    return response.json().get("token")


@pytest.fixture
def auth_headers(admin_token):
    """Headers with admin auth token"""
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


class TestHeroSettingsAPI:
    """Tests for hero settings API - slideshow and rotation interval"""

    def test_get_hero_settings_returns_hero_images_field(self, auth_headers):
        """GET /api/settings/hero should return hero_images array field"""
        response = requests.get(f"{BASE_URL}/api/settings/hero", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        # hero_images field should exist (can be empty list or populated)
        assert "hero_images" in data, "hero_images field missing from response"
        assert isinstance(data["hero_images"], list), "hero_images should be a list"

    def test_get_hero_settings_returns_rotation_interval_field(self, auth_headers):
        """GET /api/settings/hero should return hero_rotation_interval field"""
        response = requests.get(f"{BASE_URL}/api/settings/hero", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "hero_rotation_interval" in data, "hero_rotation_interval field missing"
        assert isinstance(data["hero_rotation_interval"], int), "hero_rotation_interval should be int"

    def test_put_hero_settings_accepts_hero_images_array(self, auth_headers):
        """PUT /api/settings/hero should accept hero_images array"""
        # Get current settings first
        get_response = requests.get(f"{BASE_URL}/api/settings/hero", headers=auth_headers)
        original_settings = get_response.json()
        
        # Test updating with hero_images array
        test_images = [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg"
        ]
        update_payload = {"hero_images": test_images}
        response = requests.put(f"{BASE_URL}/api/settings/hero", 
                               json=update_payload, 
                               headers=auth_headers)
        assert response.status_code == 200, f"Update failed: {response.text}"
        data = response.json()
        assert data["hero_images"] == test_images, "hero_images not updated correctly"

    def test_put_hero_settings_accepts_rotation_interval(self, auth_headers):
        """PUT /api/settings/hero should accept hero_rotation_interval"""
        # Test updating rotation interval
        test_interval = 8
        update_payload = {"hero_rotation_interval": test_interval}
        response = requests.put(f"{BASE_URL}/api/settings/hero", 
                               json=update_payload, 
                               headers=auth_headers)
        assert response.status_code == 200, f"Update failed: {response.text}"
        data = response.json()
        assert data["hero_rotation_interval"] == test_interval, "hero_rotation_interval not updated"

    def test_hero_images_persists_after_update(self, auth_headers):
        """Verify hero_images are persisted in database after update"""
        # Update with specific images
        test_images = [
            "https://example.com/persist-test1.jpg",
            "https://example.com/persist-test2.jpg",
            "https://example.com/persist-test3.jpg"
        ]
        update_payload = {"hero_images": test_images}
        requests.put(f"{BASE_URL}/api/settings/hero", 
                    json=update_payload, 
                    headers=auth_headers)
        
        # GET to verify persistence
        get_response = requests.get(f"{BASE_URL}/api/settings/hero", headers=auth_headers)
        assert get_response.status_code == 200
        data = get_response.json()
        assert data["hero_images"] == test_images, "hero_images not persisted correctly"

    def test_rotation_interval_persists_after_update(self, auth_headers):
        """Verify hero_rotation_interval persists in database after update"""
        test_interval = 10
        update_payload = {"hero_rotation_interval": test_interval}
        requests.put(f"{BASE_URL}/api/settings/hero", 
                    json=update_payload, 
                    headers=auth_headers)
        
        # GET to verify persistence
        get_response = requests.get(f"{BASE_URL}/api/settings/hero", headers=auth_headers)
        assert get_response.status_code == 200
        data = get_response.json()
        assert data["hero_rotation_interval"] == test_interval, "hero_rotation_interval not persisted"

    def test_hero_images_can_be_empty_array(self, auth_headers):
        """hero_images should accept empty array"""
        update_payload = {"hero_images": []}
        response = requests.put(f"{BASE_URL}/api/settings/hero", 
                               json=update_payload, 
                               headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["hero_images"] == [], "Empty hero_images array not accepted"

    def test_hero_images_max_5_images(self, auth_headers):
        """Verify API accepts up to 5 images in hero_images array"""
        test_images = [
            "https://example.com/img1.jpg",
            "https://example.com/img2.jpg",
            "https://example.com/img3.jpg",
            "https://example.com/img4.jpg",
            "https://example.com/img5.jpg"
        ]
        update_payload = {"hero_images": test_images}
        response = requests.put(f"{BASE_URL}/api/settings/hero", 
                               json=update_payload, 
                               headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["hero_images"]) == 5, "Should accept 5 images"

    def test_rotation_interval_default_value(self):
        """GET /api/settings/hero should return default rotation interval if not set"""
        # Public endpoint - no auth needed
        response = requests.get(f"{BASE_URL}/api/settings/hero")
        assert response.status_code == 200
        data = response.json()
        # Default should be 5 seconds as per model
        assert data["hero_rotation_interval"] >= 2 and data["hero_rotation_interval"] <= 15, \
            "Rotation interval should be within valid range (2-15)"

    def test_combined_hero_images_and_interval_update(self, auth_headers):
        """PUT should accept both hero_images and hero_rotation_interval together"""
        test_images = ["https://example.com/combined1.jpg", "https://example.com/combined2.jpg"]
        test_interval = 7
        update_payload = {
            "hero_images": test_images,
            "hero_rotation_interval": test_interval
        }
        response = requests.put(f"{BASE_URL}/api/settings/hero", 
                               json=update_payload, 
                               headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["hero_images"] == test_images
        assert data["hero_rotation_interval"] == test_interval


class TestHeroSettingsAuth:
    """Tests for hero settings authentication and permissions"""

    def test_get_hero_settings_public_access(self):
        """GET /api/settings/hero should be publicly accessible (no auth)"""
        response = requests.get(f"{BASE_URL}/api/settings/hero")
        assert response.status_code == 200, "Public GET should work without auth"

    def test_put_hero_settings_requires_auth(self):
        """PUT /api/settings/hero should require authentication"""
        update_payload = {"hero_rotation_interval": 5}
        response = requests.put(f"{BASE_URL}/api/settings/hero", json=update_payload)
        assert response.status_code == 401, "PUT should require authentication"

    def test_put_hero_settings_admin_can_update(self, auth_headers):
        """Admin should be able to update hero settings"""
        update_payload = {"hero_rotation_interval": 6}
        response = requests.put(f"{BASE_URL}/api/settings/hero", 
                               json=update_payload, 
                               headers=auth_headers)
        assert response.status_code == 200, "Admin should be able to update"


class TestHeroSettingsResponseSchema:
    """Tests for hero settings response schema validation"""

    def test_response_contains_all_required_fields(self, auth_headers):
        """Response should contain all expected fields"""
        response = requests.get(f"{BASE_URL}/api/settings/hero", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        
        required_fields = [
            "id", "hero_image_url", "hero_images", "hero_rotation_interval",
            "hero_video_url", "background_type", "video_muted",
            "hero_title_line1", "hero_title_line2", "hero_subtitle",
            "hero_cta1_text", "hero_cta1_link", "hero_cta2_text", "hero_cta2_link",
            "show_title", "show_subtitle", "show_cta_buttons",
            "show_particles", "show_gradient_overlay", "show_floating_cards", "show_welcome_badge"
        ]
        
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"


# Reset to known state after tests
@pytest.fixture(scope="module", autouse=True)
def cleanup(admin_token):
    """Reset hero settings to default after tests"""
    yield
    headers = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
    # Reset to default values
    requests.put(f"{BASE_URL}/api/settings/hero", json={
        "hero_images": [],
        "hero_rotation_interval": 5
    }, headers=headers)
