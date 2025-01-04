import { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/ui/multiselect";

// Zod schema for validation
const departmentSchema = z.object({
  departmentName: z.string().min(1, "Department name is required."),
  categoryName: z.string().min(1, "Category name is required."),
  salary: z
    .union([
      z.string().refine((val) => !isNaN(parseFloat(val)), {
        message: "Salary must be a valid number.",
      }),
      z.number().min(1, "Salary must be a positive number."),
    ])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
  location: z.string().min(1, "Location is required."),
  employees: z
    .array(z.string())
    .nonempty("At least one employee must be selected."),
});

export default function Department() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortColumn, setSortColumn] = useState("employees");

  const [categories, setCategories] = useState([
    { name: "HR" },
    { name: "IT" },
    { name: "Sales" },
    { name: "Product" },
    { name: "Marketing" },
  ]); // List of categories
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      departmentName: "",
      categoryName: "",
      salary: "",
      location: "",
      employees: [],
    },
  });

  // Fetch departments, employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptResponse = await axios.get(
          `http://localhost:8000/api/v1/department/get-department?page=${currentPage}&limit=${itemsPerPage}&category=${categoryFilter}&location=${locationFilter}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`
        );
        const empResponse = await axios.get(
          "http://localhost:8000/api/v1/user/get-all-users"
        );

        setDepartments(deptResponse.data);
        setEmployees(empResponse.data);
        setRefresh(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [
    currentPage,
    refresh,
    categoryFilter,
    locationFilter,
    sortColumn,
    sortDirection,
  ]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      if (selectedDepartment) {
        await axios.patch(
          `http://localhost:8000/api/v1/department/update-department?id=${selectedDepartment._id}`,
          data
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/v1/department/create-department",
          data
        );
      }

      reset();
      setSelectedDepartment(null);
      setIsModalOpen(false);

      setRefresh(true);
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    reset({
      departmentName: department.departmentName,
      categoryName: department.categoryName,
      salary: department.salary,
      location: department.location,
      employees: department.employees.map((emp) => emp._id),
    });
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/department/delete-department?id=${id}`
      );
      setRefresh(true);
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="p-10 ">
      {/* Dialog for adding/editing department */}
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <div className="">
            <Label htmlFor="categoryFilter">Category Filter</Label>
            <select
              id="categoryFilter"
              className="input flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="locationFilter">Location Filter</Label>
            <input
              id="locationFilter"
              className="input flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              type="text"
              placeholder="Search by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="">
              {selectedDepartment ? "Edit Department" : "Add Department"}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-[400px]">
            <DialogHeader>
              <DialogTitle>
                {selectedDepartment ? "Edit Department" : "Add Department"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="departmentName">Department Name</Label>
                <Controller
                  name="departmentName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="departmentName"
                      placeholder="Enter department name"
                    />
                  )}
                />
                {errors.departmentName && (
                  <p className="text-red-500">
                    {errors.departmentName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Controller
                  name="categoryName"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="categoryName"
                      placeholder="Select category"
                      className="input flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.categoryName && (
                  <p className="text-red-500">{errors.categoryName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="salary">Salary</Label>
                <Controller
                  name="salary"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="salary"
                      type="number"
                      placeholder="Enter salary"
                    />
                  )}
                />
                {errors.salary && (
                  <p className="text-red-500">{errors.salary.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="location"
                      placeholder="Enter location"
                    />
                  )}
                />
                {errors.location && (
                  <p className="text-red-500">{errors.location.message}</p>
                )}
              </div>

              <div>
                <MultiSelect
                  options={employees}
                  selectedValues={getValues("employees")}
                  onChange={(selectedIds) => setValue("employees", selectedIds)}
                />
                {errors.employees && (
                  <p className="text-red-500">{errors.employees.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-4">
                {selectedDepartment ? "Update Department" : "Add Department"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Departments Table */}
      <table className="min-w-full table-auto mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Department Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Salary</th>
            <th
              className="border px-4 py-2 cursor-pointer"
              onClick={() => handleSort("employees")}
            >
              Employees
              {sortColumn === "employees" &&
                (sortDirection === "asc" ? " ↑" : " ↓")}
            </th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments?.departments?.map((department) => (
            <tr key={department._id}>
              <td className="border px-4 py-2">{department.departmentName}</td>
              <td className="border px-4 py-2">{department.categoryName}</td>
              <td className="border px-4 py-2">{department.location}</td>
              <td className="border px-4 py-2 text-right">
                {department.salary}
              </td>

              <td className="border px-4 py-2">
                {department?.employees.map((user) => (
                  <p key={user._id}>
                    {user.firstName} {user.lastName}
                  </p>
                ))}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleEditDepartment(department)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteDepartment(department._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Buttons */}
      <div className="flex  mt-4 gap-5 justify-end">
        <Button
          variant="outline"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="self-center">{`Page ${currentPage}`}</span>
        <Button
          variant="outline"
          onClick={goToNextPage}
          disabled={
            currentPage < departments?.pagination?.totalPages ? false : true
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
