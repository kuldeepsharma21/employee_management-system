import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";

const EmployeeDashboard = () => {
  const location = useLocation();
  const { _id, firstName, lastName, email, role } = location.state || {};

  console.log(_id);
  
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empResponse = await axios.get(
          `http://localhost:8000/api/v1/user/employee?id=${_id}`
        );

        setUserData(empResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Employee Dashboard</CardTitle>
          <CardDescription>Employee Details</CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            <li>
              <strong>First Name</strong> {firstName}
            </li>
            <li>
              <strong>Last Name</strong> {lastName}
            </li>
            <li>
              <strong>Email:</strong> {email}
            </li>
            <li>
              <strong>Role:</strong> {role}
            </li>
            <li>
              <strong>Department:</strong>{" "}
              {userData?.department?.departmentName || "Not assigned"}
            </li>
            <li>
              <strong>Category:</strong>{" "}
              {userData?.department?.categoryName || "Not assigned"}
            </li>
            <li>
              <strong>Salary:</strong>{" "}
              {userData?.department?.salary || "Not assigned"}
            </li>
            <li>
              <strong>Location:</strong>{" "}
              {userData?.department?.location || "Not assigned"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
