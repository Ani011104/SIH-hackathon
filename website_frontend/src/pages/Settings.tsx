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
    { id: 1, name: "John Admin", email: "john@admin.com", role: "Admin", status: "active", lastLogin: "2024-01-15" },
    { id: 2, name: "Sarah Evaluator", email: "sarah@eval.com", role: "Evaluator", status: "active", lastLogin: "2024-01-14" },
    { id: 3, name: "Mike Reviewer", email: "mike@review.com", role: "Reviewer", status: "inactive", lastLogin: "2024-01-10" },
  ]);

  const benchmarks = [
    { test: "Vertical Jump", ageGroup: "18-25", gender: "Male", excellent: "24+", good: "20-23", fair: "16-19", poor: "<16" },
    { test: "Vertical Jump", ageGroup: "18-25", gender: "Female", excellent: "20+", good: "17-19", fair: "14-16", poor: "<14" },
    { test: "Sit-ups", ageGroup: "18-25", gender: "Male", excellent: "50+", good: "40-49", fair: "30-39", poor: "<30" },
    { test: "Shuttle Run", ageGroup: "18-25", gender: "Male", excellent: "<9.5", good: "9.5-10.5", fair: "10.6-11.5", poor: ">11.5" },
  ];

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
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="officials" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage Officials</CardTitle>
                  <CardDescription>Add, edit, and manage dashboard user accounts</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Official
                </Button>
              </div>
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
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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
                  <Input id="fullName" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
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
                  <Button className="w-full">Create Official Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance Benchmarks</CardTitle>
                  <CardDescription>Manage age and gender-based performance thresholds</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benchmark
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Test Type</th>
                      <th className="text-left p-2">Age Group</th>
                      <th className="text-left p-2">Gender</th>
                      <th className="text-left p-2">Excellent</th>
                      <th className="text-left p-2">Good</th>
                      <th className="text-left p-2">Fair</th>
                      <th className="text-left p-2">Poor</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarks.map((benchmark, index) => (
                      <tr key={index} className="border-b hover:bg-accent/50">
                        <td className="p-2">{benchmark.test}</td>
                        <td className="p-2">{benchmark.ageGroup}</td>
                        <td className="p-2">{benchmark.gender}</td>
                        <td className="p-2 text-green-600">{benchmark.excellent}</td>
                        <td className="p-2 text-blue-600">{benchmark.good}</td>
                        <td className="p-2 text-yellow-600">{benchmark.fair}</td>
                        <td className="p-2 text-red-600">{benchmark.poor}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="30" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input id="passwordExpiry" type="number" defaultValue="90" className="mt-1" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Require 2FA</Label>
                      <p className="text-sm text-muted-foreground">Force two-factor authentication</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Login Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">Track all login attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>General system settings and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="systemName">System Name</Label>
                    <Input id="systemName" defaultValue="Sport Score Guard" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">System Timezone</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="cst">Central Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxFileSize">Max Upload Size (MB)</Label>
                    <Input id="maxFileSize" type="number" defaultValue="50" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="retentionPeriod">Data Retention (days)</Label>
                    <Input id="retentionPeriod" type="number" defaultValue="365" className="mt-1" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="maintenance">Maintenance Notice</Label>
                  <Textarea 
                    id="maintenance" 
                    placeholder="Enter maintenance message for users..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-4">
                  <Button>Save Configuration</Button>
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button variant="destructive" className="ml-auto">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}