import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, Building2, User } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { apiService } from '../../lib/api';

export const DirectorySection = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiService.getEmployees({ limit: 100 });
        setEmployees(response.data);
        setFilteredEmployees(response.data);
        
        // Extract unique departments
        const depts = [...new Set(response.data.map(e => e.department))];
        setDepartments(depts);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    let filtered = employees;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.position.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query)
      );
    }

    // Filter by department
    if (selectedDepartment && selectedDepartment !== 'all') {
      filtered = filtered.filter((emp) => emp.department === selectedDepartment);
    }

    setFilteredEmployees(filtered);
  }, [searchQuery, selectedDepartment, employees]);

  if (loading) {
    return (
      <section className="py-24 bg-slate-50" id="directory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 w-48 mb-12 rounded" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-48 bg-slate-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-slate-50" id="directory" data-testid="directory-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="text-[#0C765B] font-semibold text-sm uppercase tracking-wider mb-2 block">
            Connect With Colleagues
          </span>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Employee Directory
          </h2>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name, email, position, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white border-slate-200 focus:border-[#0C765B] focus:ring-[#0C765B]/20"
              data-testid="directory-search"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full sm:w-[200px] h-12 bg-white" data-testid="department-filter">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Results count */}
        <p className="text-slate-500 mb-6">
          Showing {filteredEmployees.length} of {employees.length} employees
        </p>

        {/* Employee Grid */}
        {filteredEmployees.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
                data-testid={`employee-card-${index}`}
              >
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  {employee.avatar_url ? (
                    <img
                      src={employee.avatar_url}
                      alt={employee.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-[#0C765B]/10"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#0C765B]/10 flex items-center justify-center border-4 border-[#0C765B]/10">
                      <User className="w-10 h-10 text-[#0C765B]/50" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="font-bold text-slate-900 mb-1">{employee.name}</h3>
                  <p className="text-[#0C765B] font-medium text-sm mb-3">{employee.position}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center text-slate-500">
                      <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{employee.department}</span>
                    </div>
                    <div className="flex items-center justify-center text-slate-500">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <a
                        href={`mailto:${employee.email}`}
                        className="truncate hover:text-[#0C765B] transition-colors"
                      >
                        {employee.email}
                      </a>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center justify-center text-slate-500">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <a
                          href={`tel:${employee.phone}`}
                          className="hover:text-[#0C765B] transition-colors"
                        >
                          {employee.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No employees found matching your criteria</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDepartment('all'); }}
              className="mt-4 text-[#0C765B] font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DirectorySection;
