import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, AlertTriangle, Play, Calendar, MapPin } from "lucide-react";
import { athletes } from "./Athletes"; // Adjust path if needed

// Base test templates with sport names
const testTemplates = [
  {
    id: 1,
    test: "Vertical Jump",
    score: "68cm",
    benchmark: "65cm",
    date: "2025-01-15",
    status: "Pending",
    video: true,
    videoUrl: "/videos/vertical-jump.mp4", // Placeholder for other athletes
    notes: ""
  },
  {
    id: 2,
    test: "Sit-ups",
    score: "45 reps",
    benchmark: "40 reps",
    date: "2025-01-10",
    status: "Verified",
    video: true,
    videoUrl: "/videos/sit-ups.mp4", // Placeholder for other athletes
    notes: "Good"
  },
  {
    id: 3,
    test: "Squats",
    score: "9.8s",
    benchmark: "10.2s",
    date: "2025-01-05",
    status: "Verified",
    video: true,
    videoUrl: "/videos/squats.mp4", // Path to actual squats video
    notes: "Excellent form"
  },
  {
    id: 4,
    test: "Push-ups",
    score: "30 reps",
    benchmark: "25 reps",
    date: "2025-01-07",
    status: "Pending",
    video: true,
    videoUrl: "/videos/push-ups.mp4", // Path to actual push-ups video
    notes: "Good effort"
  }
];

export default function AthleteProfile() {
  const { id } = useParams();
  const athlete = athletes.find(a => a.id === parseInt(id || "0"));

  if (!athlete) {
    return <div>Athlete not found</div>;
  }

  // Generate test history based on athlete ID
  let testHistory;
  if (athlete.id === 4) { // Sumadhwa
    testHistory = [
      testTemplates.find(test => test.test === "Squats"),
      testTemplates.find(test => test.test === "Push-ups")
    ].filter(test => test !== undefined).map(test => ({
      ...test!,
      id: test!.id + athlete.id * 10 // Ensure unique IDs
    }));
  } else {
    const testCount = (athlete.id % 3) + 1; // 1 to 3 tests for other athletes
    testHistory = testTemplates.slice(0, testCount).map(test => ({
      ...test,
      id: test.id + athlete.id * 10 // Ensure unique IDs
    }));
  }

  const athleteData = {
    id: athlete.id,
    name: athlete.name,
    age: athlete.age,
    gender: athlete.gender,
    location: athlete.location,
    photo: "/placeholder-avatar.jpg",
    status: athlete.status || "Pending", // Fallback to "Pending" if status is undefined
    totalTests: testHistory.length,
    verifiedTests: testHistory.filter(test => test.status.toLowerCase() === "verified").length
  };

  const getStatusBadge = (status: string | undefined) => {
    const statusLower = status?.toLowerCase() || "pending"; // Default to "pending" if undefined
    switch (statusLower) {
      case 'verified':
        return <Badge className="bg-success text-success-foreground">Verified</Badge>;
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge>{statusLower}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={athleteData.photo} />
          <AvatarFallback className="text-2xl">
            {athleteData.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{athleteData.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Age: {athleteData.age}</span>
            <span>•</span>
            <span>{athleteData.gender}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {athleteData.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Status:</span>
            {getStatusBadge(athleteData.status)}
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button className="bg-success hover:bg-success/90">
            <Check className="h-4 w-4 mr-2" />
            Approve All
          </Button>
          <Button variant="destructive">
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{athleteData.totalTests}</div>
            <p className="text-sm text-muted-foreground">Total Tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{athleteData.verifiedTests}</div>
            <p className="text-sm text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
          <TabsTrigger value="videos">Video Evidence</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {testHistory.filter(test => test.video).map((test) => (
                  <div key={test.id} className="border rounded-lg p-4 space-y-2">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      {test.videoUrl ? (
                        <video controls className="w-full h-full rounded-lg">
                          <source src={test.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Play className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <h4 className="font-medium">{test.test}</h4>
                    <p className="text-sm text-muted-foreground">{test.date}</p>
                    {getStatusBadge(test.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testHistory.map((test) => (
                    <div key={test.id} className="flex justify-between items-center">
                      <span>{test.test}</span>
                      <span className="font-mono">{test.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evaluation Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Add your evaluation notes here..."
                  className="min-h-32"
                />
                <div className="mt-4 flex gap-2">
                  <Button className="bg-success hover:bg-success/90">
                    Save & Approve
                  </Button>
                  <Button variant="outline">Save Draft</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
