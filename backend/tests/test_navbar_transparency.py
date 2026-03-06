"""
Test Suite for Iteration 5 - New Features:
1. Navbar transparency toggle in CMS (GET/PUT /api/settings/hero)
2. Verify navbar_transparent field in hero settings
3. Test other public pages still work
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHeroSettingsNavbarTransparency:
    """Tests for navbar_transparent field in hero settings API"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test - login as admin to get token"""
        # Login as admin
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        if login_response.status_code == 200:
            self.token = login_response.json().get("token")  # API returns 'token' not 'access_token'
        else:
            pytest.skip("Authentication failed - skipping authenticated tests")
    
    def test_get_hero_settings_returns_navbar_transparent_field(self):
        """GET /api/settings/hero should return navbar_transparent field"""
        response = requests.get(f"{BASE_URL}/api/settings/hero")
        assert response.status_code == 200
        
        data = response.json()
        assert "navbar_transparent" in data, "navbar_transparent field missing from hero settings"
        assert isinstance(data["navbar_transparent"], bool), "navbar_transparent should be boolean"
        print(f"navbar_transparent value: {data['navbar_transparent']}")
    
    def test_get_hero_settings_default_navbar_transparent_is_true(self):
        """navbar_transparent should default to True"""
        response = requests.get(f"{BASE_URL}/api/settings/hero")
        assert response.status_code == 200
        
        data = response.json()
        # Default is True as per HERO_DEFAULTS
        assert data.get("navbar_transparent") == True, "Default navbar_transparent should be True"
    
    def test_update_navbar_transparent_to_false(self):
        """PUT /api/settings/hero with navbar_transparent: false should persist"""
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Update navbar_transparent to false
        update_response = requests.put(
            f"{BASE_URL}/api/settings/hero",
            json={"navbar_transparent": False},
            headers=headers
        )
        assert update_response.status_code == 200
        
        updated_data = update_response.json()
        assert updated_data["navbar_transparent"] == False, "navbar_transparent should be updated to False"
        
        # Verify persistence with GET
        get_response = requests.get(f"{BASE_URL}/api/settings/hero")
        assert get_response.status_code == 200
        
        fetched_data = get_response.json()
        assert fetched_data["navbar_transparent"] == False, "navbar_transparent should persist as False"
        print("navbar_transparent successfully updated to False and persisted")
    
    def test_update_navbar_transparent_to_true(self):
        """PUT /api/settings/hero with navbar_transparent: true should persist"""
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Update navbar_transparent to true
        update_response = requests.put(
            f"{BASE_URL}/api/settings/hero",
            json={"navbar_transparent": True},
            headers=headers
        )
        assert update_response.status_code == 200
        
        updated_data = update_response.json()
        assert updated_data["navbar_transparent"] == True, "navbar_transparent should be updated to True"
        
        # Verify persistence with GET
        get_response = requests.get(f"{BASE_URL}/api/settings/hero")
        assert get_response.status_code == 200
        
        fetched_data = get_response.json()
        assert fetched_data["navbar_transparent"] == True, "navbar_transparent should persist as True"
        print("navbar_transparent successfully updated to True and persisted")


class TestHeroSettingsImageFormat:
    """Tests for hero image object-contain verification"""
    
    def test_hero_settings_has_hero_image_url(self):
        """Hero settings should have hero_image_url or hero_images"""
        response = requests.get(f"{BASE_URL}/api/settings/hero")
        assert response.status_code == 200
        
        data = response.json()
        assert "hero_image_url" in data or "hero_images" in data
        assert "background_type" in data
        print(f"Background type: {data.get('background_type')}")
        print(f"Hero images count: {len(data.get('hero_images', []))}")


class TestPublicPagesStillWork:
    """Tests to verify other public pages still work after Corporate Overview removal"""
    
    def test_corporate_philosophy_page_api(self):
        """Corporate Philosophy page should still work"""
        # Test the menus endpoint which powers navigation
        response = requests.get(f"{BASE_URL}/api/menus?visible_only=true")
        assert response.status_code == 200
        print("Corporate Philosophy - API accessible")
    
    def test_news_api_accessible(self):
        """News page API should work"""
        response = requests.get(f"{BASE_URL}/api/news")
        assert response.status_code == 200
        print("News API accessible")
    
    def test_events_api_accessible(self):
        """Events page API should work"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        print("Events API accessible")
    
    def test_gallery_api_accessible(self):
        """Gallery page API should work"""
        response = requests.get(f"{BASE_URL}/api/photos")
        assert response.status_code == 200
        print("Gallery API accessible")


class TestCorporateOverviewRemoval:
    """Tests to verify Corporate Overview has been removed from navigation"""
    
    def test_corporate_overview_not_in_menus(self):
        """Corporate Overview should not appear in visible menus"""
        response = requests.get(f"{BASE_URL}/api/menus?visible_only=true")
        assert response.status_code == 200
        
        menus = response.json()
        
        # Recursively check all menu items and their children
        def find_overview_in_menus(items):
            for item in items:
                label = item.get("label", "").lower()
                path = item.get("path", "").lower()
                if "corporate overview" in label or "/corporate/overview" in path:
                    return True
                if item.get("children"):
                    if find_overview_in_menus(item["children"]):
                        return True
            return False
        
        assert not find_overview_in_menus(menus), "Corporate Overview should not be in visible menus"
        print("Corporate Overview NOT found in visible menus - Correctly removed")


class TestAdminAuthAndHeroSettingsCRUD:
    """Tests for admin login and hero settings CRUD functionality"""
    
    def test_admin_login_works(self):
        """Admin login should work with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert "token" in data  # API returns 'token' not 'access_token'
        assert "user" in data
        assert data["user"]["email"] == "admin@gys.co.id"
        print("Admin login successful")
    
    def test_hero_settings_crud_full_flow(self):
        """Test complete CRUD flow for hero settings"""
        # Login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        assert login_response.status_code == 200
        token = login_response.json().get("token")  # API returns 'token' not 'access_token'
        headers = {"Authorization": f"Bearer {token}"}
        
        # Read current settings
        get_response = requests.get(f"{BASE_URL}/api/settings/hero")
        assert get_response.status_code == 200
        original_data = get_response.json()
        
        # Update settings
        test_title = "TEST_Building Indonesia's"
        update_response = requests.put(
            f"{BASE_URL}/api/settings/hero",
            json={"hero_title_line1": test_title},
            headers=headers
        )
        assert update_response.status_code == 200
        
        # Verify update
        verify_response = requests.get(f"{BASE_URL}/api/settings/hero")
        assert verify_response.status_code == 200
        assert verify_response.json()["hero_title_line1"] == test_title
        
        # Restore original
        restore_response = requests.put(
            f"{BASE_URL}/api/settings/hero",
            json={"hero_title_line1": original_data.get("hero_title_line1", "Building Indonesia's")},
            headers=headers
        )
        assert restore_response.status_code == 200
        print("Hero settings CRUD flow complete")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
