import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [loginData, setLoginData] = useState({
    phone: "",
    otp: "",
  });
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtp) {
      setShowOtp(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center font-quicksand p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Sports Assessment Portal
          </CardTitle>
          <CardDescription>
            Secure access for officials and evaluators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={loginData.phone}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {showOtp && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={loginData.otp}
                      onChange={(e) =>
                        setLoginData((prev) => ({
                          ...prev,
                          otp: e.target.value,
                        }))
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Code sent to {loginData.phone}
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  {showOtp ? "Verify & Login" : "Send OTP"}
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Forgot Password?
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
