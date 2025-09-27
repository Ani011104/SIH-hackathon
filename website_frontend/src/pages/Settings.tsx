import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Users, Shield, Bell, Database, Trash2, Plus, Edit } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [officials, setOfficials] = useState([
    { id: 1, name: "Gauri", email: "gauri@admin.com", role: "Admin", status: "active", lastLogin: "2025-08-15" },
    { id: 2, name: "Chinmai", email: "chinmai@gmail.com", role: "Evaluator", status: "active", lastLogin: "2025-08-14" },
    { id: 3, name: "Amar", email: "amar@gmail.com", role: "Reviewer", status: "inactive", lastLogin: "2025-08-10" },
  ]);

  // State for form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  // Function to handle form submission
  const handleAddOfficial = () => {
    if (fullName && email && role) {
      const newOfficial = {
        id: officials.length + 1, // Simple ID generation (consider using UUID in production)
        name: fullName,
        email,
        role: role.charAt(0).toUpperCase() + role.slice(1), // Capitalize role
        status: "active", // Default status
        lastLogin: new Date().toISOString().split("T")[0], // Current date
      };
      setOfficials([...officials, newOfficial]);
      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setRole("");
    }
  };

  // Function to handle deleting an official
  const handleDeleteOfficial = (id: number) => {
    setOfficials(officials.filter(official => official.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">System configuration and management</p>
        </div>
        <Button>
          <SettingsIcon className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="officials" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="officials">Officials</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="officials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Officials</CardTitle>
              <CardDescription>Add, edit, and manage dashboard user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {officials.map((official) => (
                  <div key={official.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{official.name}</span>
                        <Badge variant={official.role === "Admin" ? "default" : "secondary"}>
                          {official.role}
                        </Badge>
                        <Badge variant={official.status === "active" ? "default" : "outline"}>
                          {official.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{official.email}</div>
                      <div className="text-xs text-muted-foreground">Last login: {official.lastLogin}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteOfficial(official.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Official
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Official</CardTitle>
              <CardDescription>Create a new dashboard user account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="evaluator">Evaluator</SelectItem>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Button className="w-full" onClick={handleAddOfficial}>
                    Create Official Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Flagged Submission Alerts</Label>
                    <p className="text-sm text-muted-foreground">Immediate alerts for cheat detection</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Daily Summary Reports</Label>
                    <p className="text-sm text-muted-foreground">Daily performance summaries</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">System Maintenance Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notifications about system updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}