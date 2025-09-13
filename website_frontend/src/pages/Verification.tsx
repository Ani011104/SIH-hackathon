import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, XCircle, Eye, Clock, Search, Filter } from "lucide-react";
import { useState } from "react";

export default function Verification() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const flaggedSubmissions = [
    {
      id: "VS001",
      athlete: "John Smith",
      test: "Vertical Jump",
      submittedScore: 95,
      aiEstimate: 72,
      confidence: 89,
      flags: ["Unrealistic score", "Video anomaly"],
      timestamp: "2024-01-15 14:30",
      status: "pending"
    },
    {
      id: "VS002", 
      athlete: "Sarah Johnson",
      test: "Sit-ups",
      submittedScore: 88,
      aiEstimate: 65,
      confidence: 92,
      flags: ["Form violation", "Count mismatch"],
      timestamp: "2024-01-15 13:45",
      status: "pending"
    },
    {
      id: "VS003",
      athlete: "Mike Davis",
      test: "Shuttle Run",
      submittedScore: 91,
      aiEstimate: 78,
      confidence: 85,
      flags: ["Timer discrepancy"],
      timestamp: "2024-01-15 12:20",
      status: "reviewed"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Verification & Cheat Detection</h1>
          <p className="text-muted-foreground">AI-powered video analysis and manual review system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Select defaultValue="pending">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Awaiting manual review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Detection Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Accuracy this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">+3</span> from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Submissions</CardTitle>
              <CardDescription>Videos requiring manual review due to AI-detected anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Search by athlete name..." className="flex-1" />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {flaggedSubmissions.map((submission) => (
                    <Card key={submission.id} className="p-4 cursor-pointer hover:bg-accent/50" onClick={() => setSelectedVideo(submission.id)}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{submission.id}</Badge>
                            <span className="font-medium">{submission.athlete}</span>
                            <Badge variant={submission.status === "pending" ? "secondary" : "default"}>
                              {submission.status}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            {submission.test} • {submission.timestamp}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Submitted:</span> 
                              <span className="font-medium ml-1">{submission.submittedScore}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">AI Estimate:</span>
                              <span className="font-medium ml-1">{submission.aiEstimate}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Confidence:</span>
                              <span className="font-medium ml-1">{submission.confidence}%</span>
                            </div>
                          </div>

                          <div className="flex gap-1">
                            {submission.flags.map((flag, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Review Panel</CardTitle>
              <CardDescription>
                {selectedVideo ? `Reviewing ${selectedVideo}` : "Select a submission to review"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedVideo ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Video Player</p>
                      <p className="text-xs text-muted-foreground">Side-by-side comparison view</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 border rounded">
                        <div className="text-2xl font-bold">95</div>
                        <div className="text-xs text-muted-foreground">Submitted Score</div>
                      </div>
                      <div className="text-center p-3 border rounded">
                        <div className="text-2xl font-bold">72</div>
                        <div className="text-xs text-muted-foreground">AI Estimate</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Reviewer Notes</label>
                      <Textarea 
                        placeholder="Add your review notes..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" variant="default">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Score
                      </Button>
                      <Button className="w-full" variant="destructive">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Submission
                      </Button>
                      <Button className="w-full" variant="outline">
                        Request Re-submission
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a flagged submission from the list to begin reviewing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>Recent reviewer decisions and system actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "Approved", reviewer: "Admin", athlete: "Mike Davis", test: "Shuttle Run", time: "2 hours ago" },
              { action: "Rejected", reviewer: "Evaluator1", athlete: "Lisa Wong", test: "Push-ups", time: "3 hours ago" },
              { action: "Approved", reviewer: "Admin", athlete: "Tom Wilson", test: "Vertical Jump", time: "5 hours ago" },
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3">
                  <Badge variant={log.action === "Approved" ? "default" : "destructive"}>
                    {log.action}
                  </Badge>
                  <span className="text-sm">{log.athlete} - {log.test}</span>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>by {log.reviewer}</div>
                  <div>{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}