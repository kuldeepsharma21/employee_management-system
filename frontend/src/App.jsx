import { AuthForm } from "./components/ui/AuthForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Department from "./components/Department";
import EmployeeDashboard from "./components/EmployeeDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<AuthForm />} />
        <Route path="department" element={<Department />} />
        <Route path="employeeDashboard" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
