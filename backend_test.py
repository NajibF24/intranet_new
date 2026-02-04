#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class GYSIntranetAPITester:
    def __init__(self, base_url="https://intranet-hub-12.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})

    def log(self, message):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        test_headers = self.session.headers.copy()
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        self.log(f"   URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    self.log(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, response.text
            else:
                self.log(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                self.log(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            self.log(f"❌ FAILED - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test("Root API", "GET", "/api/", 200)
        return success and "GYS Intranet API" in str(response)

    def test_seed_data(self):
        """Test seeding initial data"""
        success, response = self.run_test("Seed Data", "POST", "/api/seed", 200)
        return success

    def test_admin_login(self):
        """Test admin login and get token"""
        login_data = {
            "email": "admin@gys.co.id",
            "password": "admin123"
        }
        success, response = self.run_test("Admin Login", "POST", "/api/auth/login", 200, data=login_data)
        
        if success and 'token' in response:
            self.token = response['token']
            self.log(f"   🔑 Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_auth_me(self):
        """Test getting current user info"""
        success, response = self.run_test("Auth Me", "GET", "/api/auth/me", 200)
        return success and 'email' in response

    def test_news_operations(self):
        """Test news CRUD operations"""
        results = []
        
        # Get news
        success, news_list = self.run_test("Get News", "GET", "/api/news", 200)
        results.append(success)
        
        if success:
            self.log(f"   📰 Found {len(news_list)} news articles")
        
        # Get featured news
        success, featured_news = self.run_test("Get Featured News", "GET", "/api/news?featured=true", 200)
        results.append(success)
        
        # Create news
        new_news = {
            "title": "Test News Article",
            "summary": "This is a test news summary",
            "content": "This is the full content of the test news article.",
            "image_url": "https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=800",
            "category": "general",
            "is_featured": False
        }
        success, created_news = self.run_test("Create News", "POST", "/api/news", 200, data=new_news)
        results.append(success)
        
        if success and 'id' in created_news:
            news_id = created_news['id']
            self.log(f"   📰 Created news with ID: {news_id}")
            
            # Get specific news
            success, _ = self.run_test("Get News By ID", "GET", f"/api/news/{news_id}", 200)
            results.append(success)
            
            # Update news
            update_data = {"title": "Updated Test News Article"}
            success, _ = self.run_test("Update News", "PUT", f"/api/news/{news_id}", 200, data=update_data)
            results.append(success)
            
            # Delete news
            success, _ = self.run_test("Delete News", "DELETE", f"/api/news/{news_id}", 200)
            results.append(success)
        
        return all(results)

    def test_events_operations(self):
        """Test events CRUD operations"""
        results = []
        
        # Get events
        success, events_list = self.run_test("Get Events", "GET", "/api/events", 200)
        results.append(success)
        
        if success:
            self.log(f"   📅 Found {len(events_list)} events")
        
        # Create event
        new_event = {
            "title": "Test Event",
            "description": "This is a test event",
            "event_date": "2026-02-01",
            "event_type": "event",
            "location": "Test Location"
        }
        success, created_event = self.run_test("Create Event", "POST", "/api/events", 200, data=new_event)
        results.append(success)
        
        if success and 'id' in created_event:
            event_id = created_event['id']
            self.log(f"   📅 Created event with ID: {event_id}")
            
            # Get specific event
            success, _ = self.run_test("Get Event By ID", "GET", f"/api/events/{event_id}", 200)
            results.append(success)
            
            # Update event
            update_data = {"title": "Updated Test Event"}
            success, _ = self.run_test("Update Event", "PUT", f"/api/events/{event_id}", 200, data=update_data)
            results.append(success)
            
            # Delete event
            success, _ = self.run_test("Delete Event", "DELETE", f"/api/events/{event_id}", 200)
            results.append(success)
        
        return all(results)

    def test_photos_operations(self):
        """Test photos CRUD operations"""
        results = []
        
        # Get photos
        success, photos_list = self.run_test("Get Photos", "GET", "/api/photos", 200)
        results.append(success)
        
        if success:
            self.log(f"   🖼️ Found {len(photos_list)} photos")
        
        # Create photo
        new_photo = {
            "title": "Test Photo",
            "description": "This is a test photo",
            "image_url": "https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=800",
            "category": "test"
        }
        success, created_photo = self.run_test("Create Photo", "POST", "/api/photos", 200, data=new_photo)
        results.append(success)
        
        if success and 'id' in created_photo:
            photo_id = created_photo['id']
            self.log(f"   🖼️ Created photo with ID: {photo_id}")
            
            # Get specific photo
            success, _ = self.run_test("Get Photo By ID", "GET", f"/api/photos/{photo_id}", 200)
            results.append(success)
            
            # Update photo
            update_data = {"title": "Updated Test Photo"}
            success, _ = self.run_test("Update Photo", "PUT", f"/api/photos/{photo_id}", 200, data=update_data)
            results.append(success)
            
            # Delete photo
            success, _ = self.run_test("Delete Photo", "DELETE", f"/api/photos/{photo_id}", 200)
            results.append(success)
        
        return all(results)

    def test_employees_operations(self):
        """Test employees CRUD operations"""
        results = []
        
        # Get employees
        success, employees_list = self.run_test("Get Employees", "GET", "/api/employees", 200)
        results.append(success)
        
        if success:
            self.log(f"   👥 Found {len(employees_list)} employees")
        
        # Search employees
        success, search_results = self.run_test("Search Employees", "GET", "/api/employees?search=Budi", 200)
        results.append(success)
        
        # Filter by department
        success, dept_results = self.run_test("Filter by Department", "GET", "/api/employees?department=Production", 200)
        results.append(success)
        
        # Create employee
        new_employee = {
            "name": "Test Employee",
            "email": "test.employee@gys.co.id",
            "department": "Testing",
            "position": "Test Engineer",
            "phone": "+62 812-1234-5678"
        }
        success, created_employee = self.run_test("Create Employee", "POST", "/api/employees", 200, data=new_employee)
        results.append(success)
        
        if success and 'id' in created_employee:
            employee_id = created_employee['id']
            self.log(f"   👥 Created employee with ID: {employee_id}")
            
            # Get specific employee
            success, _ = self.run_test("Get Employee By ID", "GET", f"/api/employees/{employee_id}", 200)
            results.append(success)
            
            # Update employee
            update_data = {"name": "Updated Test Employee"}
            success, _ = self.run_test("Update Employee", "PUT", f"/api/employees/{employee_id}", 200, data=update_data)
            results.append(success)
            
            # Delete employee
            success, _ = self.run_test("Delete Employee", "DELETE", f"/api/employees/{employee_id}", 200)
            results.append(success)
        
        return all(results)

    def test_authentication_security(self):
        """Test authentication security"""
        results = []
        
        # Test accessing protected endpoint without token
        old_token = self.token
        self.token = None
        success, _ = self.run_test("Unauthorized Access", "POST", "/api/news", 401, data={"title": "test"})
        results.append(success)  # Should succeed in getting 401
        
        # Test with invalid token
        self.token = "invalid_token"
        success, _ = self.run_test("Invalid Token", "POST", "/api/news", 401, data={"title": "test"})
        results.append(success)  # Should succeed in getting 401
        
        # Restore valid token
        self.token = old_token
        
        return all(results)

    def run_all_tests(self):
        """Run all tests"""
        self.log("🚀 Starting GYS Intranet API Tests")
        self.log(f"   Base URL: {self.base_url}")
        
        # Basic tests
        tests = [
            ("Root Endpoint", self.test_root_endpoint),
            ("Seed Data", self.test_seed_data),
            ("Admin Login", self.test_admin_login),
            ("Auth Me", self.test_auth_me),
            ("News Operations", self.test_news_operations),
            ("Events Operations", self.test_events_operations),
            ("Photos Operations", self.test_photos_operations),
            ("Employees Operations", self.test_employees_operations),
            ("Authentication Security", self.test_authentication_security),
        ]
        
        failed_tests = []
        
        for test_name, test_func in tests:
            self.log(f"\n{'='*50}")
            self.log(f"🧪 Running Test Suite: {test_name}")
            try:
                result = test_func()
                if result:
                    self.log(f"✅ Test Suite PASSED: {test_name}")
                else:
                    self.log(f"❌ Test Suite FAILED: {test_name}")
                    failed_tests.append(test_name)
            except Exception as e:
                self.log(f"💥 Test Suite ERROR: {test_name} - {str(e)}")
                failed_tests.append(test_name)
        
        # Summary
        self.log(f"\n{'='*50}")
        self.log("📊 TEST SUMMARY")
        self.log(f"   Total individual tests: {self.tests_run}")
        self.log(f"   Tests passed: {self.tests_passed}")
        self.log(f"   Tests failed: {self.tests_run - self.tests_passed}")
        self.log(f"   Success rate: {(self.tests_passed / self.tests_run * 100):.1f}%" if self.tests_run > 0 else "0.0%")
        
        if failed_tests:
            self.log(f"\n❌ Failed test suites: {', '.join(failed_tests)}")
            return 1
        else:
            self.log("\n🎉 All test suites passed!")
            return 0

def main():
    tester = GYSIntranetAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())