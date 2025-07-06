// import { Button } from "@heroui/button";
// import { Card, CardBody, CardHeader } from "@heroui/card";
// import { LoginForm } from "./components/LoginForm";
// import { useState } from "react";
import Road3D from "./components/3DRoadline";

// const ESP_IP = "http://192.168.1.28";

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [user, setUser] = useState<string>("");

  // const handleLogin = async (username: string, password: string) => {
  //   // Simple authentication logic - in real app, this would call an API
  //   console.log("Attempting login with:", { username, password });

  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   // For demo purposes, accept any non-empty credentials
  //   if (username.trim() && password.trim()) {
  //     setIsAuthenticated(true);
  //     setUser(username);
  //     console.log("Login successful");
  //   } else {
  //     throw new Error("Invalid credentials");
  //   }
  // };

  // const handleLogout = () => {
  //   setIsAuthenticated(false);
  //   setUser("");
  // };
  // const turnOnRedLight = async () => {
  //   // Logic to turn on the red light
  //   const url = `${ESP_IP}/on`;
  //   console.log("Turning on red light at:", url);
  //   const req = await fetch(url);
  //   const res = await req.json();

  //   console.log("Response from ESP:", res);

  //   console.log("Red light turned on");
  // };

  // const turnOffRedLight = async () => {
  //   // Logic to turn on the red light
  //   const url = `${ESP_IP}/off`;
  //   console.log("Turning on red light at:", url);
  //   const req = await fetch(url);
  //   const res = await req.json();

  //   console.log("Response from ESP:", res);

  //   console.log("Red light turned on");
  // };

  return (
    // <div className="min-h-screen bg-gray-50 py-8">
    //   <div className="container mx-auto px-4">
    //     {!isAuthenticated ? (
    //       <div className="flex flex-col items-center justify-center min-h-[80vh]">
    //         <h1 className="text-4xl font-bold text-gray-800 mb-8">
    //           IoT Traffic Light Control
    //         </h1>
    //         <LoginForm onSubmit={handleLogin} />
    //       </div>
    //     ) : (
    //       <div className="max-w-4xl mx-auto">
    //         <div className="flex justify-between items-center mb-8">
    //           <div>
    //             <h1 className="text-4xl font-bold text-gray-800">
    //               IoT Traffic Light Control
    //             </h1>
    //             <p className="text-gray-600 mt-2">Welcome back, {user}!</p>
    //           </div>
    //         </div>

    //         <Card className="max-w-4xl mx-auto">
    //           <CardHeader className="pb-0 pt-6 px-6">
    //             <h2 className="text-2xl font-semibold text-gray-800">
    //               Traffic Light Controls
    //             </h2>
    //           </CardHeader>
    //           <CardBody className="py-6">
    //             <div className="flex gap-4">
    //               <Button
    //                 variant="solid"
    //                 color="primary"
    //                 onClick={turnOnRedLight}
    //               >
    //                 Turn On
    //               </Button>
    //               <Button
    //                 variant="solid"
    //                 color="danger"
    //                 onClick={turnOffRedLight}
    //               >
    //                 Turn Off
    //               </Button>
    //             </div>
    //           </CardBody>
    //         </Card>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <main className="w-full h-screen">
      <Road3D />
    </main>
  );
}

export default App;
