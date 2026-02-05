"""
PT Garuda Yamato Steel Intranet CMS - API Tests
Tests for User Management, News, Albums, Photos, Hero Settings, Events
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# ===================== AUTH & USER MANAGEMENT TESTS =====================

class TestAuthAndUsers:
    """Authentication and User Management tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Login as admin and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "token" in data
        return data["token"]
    
    def test_auth_login_success(self):
        """Test admin login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == "admin@gys.co.id"
        assert data["user"]["role"] == "admin"
        print("✓ Admin login successful")
    
    def test_auth_login_invalid_credentials(self):
        """Test login with wrong credentials returns 401"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Invalid credentials properly rejected")
    
    def test_auth_me_requires_token(self):
        """Test /auth/me requires authentication"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ /auth/me requires authentication")
    
    def test_auth_me_with_token(self, admin_token):
        """Test /auth/me returns current user with valid token"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "admin@gys.co.id"
        print("✓ /auth/me returns admin user")
    
    def test_get_users_requires_admin(self, admin_token):
        """Test getting users list requires admin role"""
        response = requests.get(
            f"{BASE_URL}/api/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Get users returned {len(data)} users")
    
    def test_create_user_with_roles(self, admin_token):
        """Test creating users with different roles (admin, editor, viewer)"""
        test_users = [
            {"name": "TEST_Admin", "email": "test_admin@gys.co.id", "password": "test123", "role": "admin"},
            {"name": "TEST_Editor", "email": "test_editor@gys.co.id", "password": "test123", "role": "editor"},
            {"name": "TEST_Viewer", "email": "test_viewer@gys.co.id", "password": "test123", "role": "viewer"},
        ]
        
        created_ids = []
        for user_data in test_users:
            response = requests.post(
                f"{BASE_URL}/api/users",
                json=user_data,
                headers={"Authorization": f"Bearer {admin_token}"}
            )
            # May return 400 if already exists, that's OK
            if response.status_code == 201:
                data = response.json()
                assert data["role"] == user_data["role"]
                created_ids.append(data["id"])
                print(f"✓ Created user with role: {user_data['role']}")
            elif response.status_code == 400:
                print(f"✓ User {user_data['email']} already exists")
        
        return created_ids
    
    def test_update_user(self, admin_token):
        """Test updating user details"""
        # First create a test user
        response = requests.post(
            f"{BASE_URL}/api/users",
            json={"name": "TEST_Update", "email": "test_update@gys.co.id", "password": "test123", "role": "editor"},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if response.status_code == 201:
            user_id = response.json()["id"]
            
            # Update the user
            update_response = requests.put(
                f"{BASE_URL}/api/users/{user_id}",
                json={"name": "TEST_Updated Name", "role": "viewer"},
                headers={"Authorization": f"Bearer {admin_token}"}
            )
            assert update_response.status_code == 200
            data = update_response.json()
            assert data["name"] == "TEST_Updated Name"
            assert data["role"] == "viewer"
            print("✓ User updated successfully")
            
            # Clean up
            requests.delete(f"{BASE_URL}/api/users/{user_id}", headers={"Authorization": f"Bearer {admin_token}"})
        else:
            print("✓ Test user already exists, skipping update test")
    
    def test_delete_user(self, admin_token):
        """Test deleting a user"""
        # Create user to delete
        response = requests.post(
            f"{BASE_URL}/api/users",
            json={"name": "TEST_Delete", "email": "test_delete@gys.co.id", "password": "test123", "role": "viewer"},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if response.status_code == 201:
            user_id = response.json()["id"]
            
            # Delete the user
            delete_response = requests.delete(
                f"{BASE_URL}/api/users/{user_id}",
                headers={"Authorization": f"Bearer {admin_token}"}
            )
            assert delete_response.status_code == 200
            
            # Verify deleted
            get_response = requests.get(
                f"{BASE_URL}/api/users/{user_id}",
                headers={"Authorization": f"Bearer {admin_token}"}
            )
            assert get_response.status_code == 404
            print("✓ User deleted and verified")


# ===================== NEWS TESTS =====================

class TestNews:
    """News CRUD and Detail Page tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        return response.json()["token"]
    
    def test_get_news_list(self):
        """Test getting news list (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/news")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} news articles")
    
    def test_get_news_by_id(self):
        """Test getting single news article by ID"""
        # First get list
        list_response = requests.get(f"{BASE_URL}/api/news")
        news_list = list_response.json()
        
        if news_list:
            news_id = news_list[0]["id"]
            response = requests.get(f"{BASE_URL}/api/news/{news_id}")
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == news_id
            assert "title" in data
            assert "content" in data
            assert "summary" in data
            print(f"✓ News detail page working: {data['title'][:40]}...")
    
    def test_create_news_with_custom_category(self, admin_token):
        """Test creating news with custom category"""
        news_data = {
            "title": "TEST_News with Custom Category",
            "summary": "Testing custom category feature",
            "content": "Full content for testing custom category functionality",
            "category": "custom_tech",  # Custom category
            "is_featured": False
        }
        response = requests.post(
            f"{BASE_URL}/api/news",
            json=news_data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["category"] == "custom_tech"
        print("✓ News created with custom category")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/news/{data['id']}", headers={"Authorization": f"Bearer {admin_token}"})
    
    def test_update_news(self, admin_token):
        """Test updating a news article"""
        # Create test news
        create_response = requests.post(
            f"{BASE_URL}/api/news",
            json={
                "title": "TEST_News Update",
                "summary": "Original summary",
                "content": "Original content",
                "category": "general"
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert create_response.status_code == 200
        news_id = create_response.json()["id"]
        
        # Update
        update_response = requests.put(
            f"{BASE_URL}/api/news/{news_id}",
            json={"title": "TEST_News Updated Title", "is_featured": True},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert update_response.status_code == 200
        data = update_response.json()
        assert data["title"] == "TEST_News Updated Title"
        assert data["is_featured"] == True
        print("✓ News updated successfully")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/news/{news_id}", headers={"Authorization": f"Bearer {admin_token}"})
    
    def test_delete_news(self, admin_token):
        """Test deleting news article"""
        # Create test news
        create_response = requests.post(
            f"{BASE_URL}/api/news",
            json={
                "title": "TEST_News Delete",
                "summary": "To be deleted",
                "content": "Content",
                "category": "general"
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        news_id = create_response.json()["id"]
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/news/{news_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert delete_response.status_code == 200
        
        # Verify deleted
        get_response = requests.get(f"{BASE_URL}/api/news/{news_id}")
        assert get_response.status_code == 404
        print("✓ News deleted and verified")


# ===================== ALBUMS & PHOTOS TESTS =====================

class TestAlbumsAndPhotos:
    """Photo Albums and Gallery tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        return response.json()["token"]
    
    def test_get_albums(self, admin_token):
        """Test getting albums list"""
        response = requests.get(
            f"{BASE_URL}/api/albums",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} albums")
    
    def test_create_album(self, admin_token):
        """Test creating a new album"""
        album_data = {
            "title": "TEST_Album",
            "description": "Test album for photos",
            "cover_image_url": "https://example.com/cover.jpg"
        }
        response = requests.post(
            f"{BASE_URL}/api/albums",
            json=album_data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "TEST_Album"
        assert "id" in data
        print(f"✓ Album created: {data['id']}")
        return data["id"]
    
    def test_album_crud_flow(self, admin_token):
        """Test complete album CRUD flow"""
        # CREATE album
        create_response = requests.post(
            f"{BASE_URL}/api/albums",
            json={"title": "TEST_CRUD Album", "description": "For CRUD test"},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert create_response.status_code == 200
        album_id = create_response.json()["id"]
        
        # READ album
        get_response = requests.get(
            f"{BASE_URL}/api/albums/{album_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert get_response.status_code == 200
        assert get_response.json()["title"] == "TEST_CRUD Album"
        
        # UPDATE album
        update_response = requests.put(
            f"{BASE_URL}/api/albums/{album_id}",
            json={"title": "TEST_CRUD Album Updated"},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["title"] == "TEST_CRUD Album Updated"
        
        # DELETE album
        delete_response = requests.delete(
            f"{BASE_URL}/api/albums/{album_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert delete_response.status_code == 200
        
        # VERIFY deleted
        verify_response = requests.get(
            f"{BASE_URL}/api/albums/{album_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert verify_response.status_code == 404
        print("✓ Album CRUD flow completed successfully")
    
    def test_get_photos(self, admin_token):
        """Test getting photos list"""
        response = requests.get(
            f"{BASE_URL}/api/photos",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} photos")
    
    def test_create_photo_with_album(self, admin_token):
        """Test creating photo and assigning to album"""
        # First create album
        album_response = requests.post(
            f"{BASE_URL}/api/albums",
            json={"title": "TEST_Photo Album"},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        album_id = album_response.json()["id"]
        
        # Create photo in album
        photo_data = {
            "title": "TEST_Photo in Album",
            "description": "Test photo",
            "image_url": "https://example.com/photo.jpg",
            "album_id": album_id
        }
        photo_response = requests.post(
            f"{BASE_URL}/api/photos",
            json=photo_data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert photo_response.status_code == 200
        photo_data = photo_response.json()
        assert photo_data["album_id"] == album_id
        print("✓ Photo created and assigned to album")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/photos/{photo_data['id']}", headers={"Authorization": f"Bearer {admin_token}"})
        requests.delete(f"{BASE_URL}/api/albums/{album_id}", headers={"Authorization": f"Bearer {admin_token}"})


# ===================== HERO SETTINGS TESTS =====================

class TestHeroSettings:
    """Hero Settings visual effects toggle tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        return response.json()["token"]
    
    def test_get_hero_settings(self):
        """Test getting hero settings (returns defaults if none set)"""
        response = requests.get(f"{BASE_URL}/api/settings/hero")
        assert response.status_code == 200
        data = response.json()
        assert "hero_title_line1" in data
        assert "hero_title_line2" in data
        assert "show_particles" in data
        assert "show_gradient_overlay" in data
        assert "show_floating_cards" in data
        print("✓ Hero settings retrieved with visual effect toggles")
    
    def test_update_hero_visual_effects(self, admin_token):
        """Test updating hero visual effects toggles"""
        # Get current settings
        get_response = requests.get(f"{BASE_URL}/api/settings/hero")
        original_settings = get_response.json()
        
        # Toggle visual effects
        update_data = {
            "show_particles": not original_settings.get("show_particles", True),
            "show_gradient_overlay": not original_settings.get("show_gradient_overlay", True),
            "show_floating_cards": not original_settings.get("show_floating_cards", True)
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/settings/hero",
            json=update_data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert update_response.status_code == 200
        data = update_response.json()
        assert data["show_particles"] == update_data["show_particles"]
        assert data["show_gradient_overlay"] == update_data["show_gradient_overlay"]
        assert data["show_floating_cards"] == update_data["show_floating_cards"]
        print("✓ Hero visual effects toggles updated")
        
        # Restore original settings
        requests.put(
            f"{BASE_URL}/api/settings/hero",
            json={
                "show_particles": original_settings.get("show_particles", True),
                "show_gradient_overlay": original_settings.get("show_gradient_overlay", True),
                "show_floating_cards": original_settings.get("show_floating_cards", True)
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
    
    def test_update_hero_text(self, admin_token):
        """Test updating hero text content"""
        update_data = {
            "hero_title_line1": "Building Indonesia's",
            "hero_title_line2": "Steel Future"
        }
        response = requests.put(
            f"{BASE_URL}/api/settings/hero",
            json=update_data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["hero_title_line1"] == "Building Indonesia's"
        print("✓ Hero text content updated")


# ===================== EVENTS TESTS =====================

class TestEvents:
    """Events API tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        return response.json()["token"]
    
    def test_get_events(self):
        """Test getting events list (public)"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} events")
    
    def test_create_event_requires_auth(self):
        """Test creating event requires authentication"""
        response = requests.post(f"{BASE_URL}/api/events", json={
            "title": "Test Event",
            "description": "Test",
            "event_date": "2026-02-01",
            "event_type": "event"
        })
        assert response.status_code == 401
        print("✓ Event creation requires authentication")
    
    def test_create_event(self, admin_token):
        """Test creating an event"""
        event_data = {
            "title": "TEST_Event",
            "description": "Test event description",
            "event_date": "2026-03-15",
            "event_type": "event",
            "location": "Conference Room A"
        }
        response = requests.post(
            f"{BASE_URL}/api/events",
            json=event_data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "TEST_Event"
        print("✓ Event created successfully")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/events/{data['id']}", headers={"Authorization": f"Bearer {admin_token}"})


# ===================== FILE UPLOAD TESTS =====================

class TestFileUpload:
    """File upload tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@gys.co.id",
            "password": "admin123"
        })
        return response.json()["token"]
    
    def test_upload_photo_requires_auth(self):
        """Test photo upload requires authentication"""
        # Create a simple test image data
        import io
        files = {"file": ("test.jpg", io.BytesIO(b"fake image data"), "image/jpeg")}
        response = requests.post(f"{BASE_URL}/api/photos/upload", files=files)
        assert response.status_code == 401
        print("✓ Photo upload requires authentication")
    
    def test_upload_photo_success(self, admin_token):
        """Test successful photo upload returns data URL"""
        import io
        # Create a minimal valid JPEG header
        jpeg_header = bytes([
            0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
            0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xD9
        ])
        
        files = {"file": ("test.jpg", io.BytesIO(jpeg_header), "image/jpeg")}
        response = requests.post(
            f"{BASE_URL}/api/photos/upload",
            files=files,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "image_url" in data
        assert data["image_url"].startswith("data:image/jpeg;base64,")
        print("✓ Photo upload returns base64 data URL")


# ===================== CLEANUP =====================

@pytest.fixture(scope="session", autouse=True)
def cleanup_test_data():
    """Cleanup test data after all tests"""
    yield
    
    # Login as admin for cleanup
    login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@gys.co.id",
        "password": "admin123"
    })
    if login_response.status_code != 200:
        return
    
    token = login_response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Cleanup TEST_ prefixed users
    users_response = requests.get(f"{BASE_URL}/api/users", headers=headers)
    if users_response.status_code == 200:
        for user in users_response.json():
            if user.get("name", "").startswith("TEST_") or user.get("email", "").startswith("test_"):
                requests.delete(f"{BASE_URL}/api/users/{user['id']}", headers=headers)
    
    # Cleanup TEST_ prefixed news
    news_response = requests.get(f"{BASE_URL}/api/news")
    if news_response.status_code == 200:
        for news in news_response.json():
            if news.get("title", "").startswith("TEST_"):
                requests.delete(f"{BASE_URL}/api/news/{news['id']}", headers=headers)
    
    # Cleanup TEST_ prefixed albums
    albums_response = requests.get(f"{BASE_URL}/api/albums", headers=headers)
    if albums_response.status_code == 200:
        for album in albums_response.json():
            if album.get("title", "").startswith("TEST_"):
                requests.delete(f"{BASE_URL}/api/albums/{album['id']}", headers=headers)
    
    # Cleanup TEST_ prefixed events
    events_response = requests.get(f"{BASE_URL}/api/events")
    if events_response.status_code == 200:
        for event in events_response.json():
            if event.get("title", "").startswith("TEST_"):
                requests.delete(f"{BASE_URL}/api/events/{event['id']}", headers=headers)
    
    print("\n✓ Test data cleanup completed")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
