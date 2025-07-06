import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useState } from "react";

interface LoginFormProps {
  onSubmit?: (username: string, password: string) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(username, password);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="pb-0 pt-6 px-6 flex-col items-start">
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="text-small text-default-500">
          Enter your credentials to access the IoT Traffic Light controls
        </p>
      </CardHeader>
      <CardBody className="py-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            type="text"
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isRequired
            variant="bordered"
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
            variant="bordered"
          />

          <Button
            type="submit"
            color="primary"
            variant="solid"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading || !username.trim() || !password.trim()}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
