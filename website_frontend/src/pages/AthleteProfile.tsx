import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, AlertTriangle, Play, Calendar, MapPin } from "lucide-react";

const athleteData = {
  id: 1,
  name: "Dhushyanth",
  age: 19,
  gender: "Male",
  location: "Bengalore",
  photo: "/placeholder-avatar.jpg",
  status: "Flagged",
  totalTests: 12,
  verifiedTests: 9,
  pendingTests: 2,
  flaggedTests: 1
};

const testHistory = [
  {
    id: 1,
    test: "Vertical Jump",
    score: "68cm",
    benchmark: "65cm",
    date: "2025-01-15",
    status: "Flagged",
    video: true,
    notes: "Suspicious technique detected"
  },
  {
    id: 2,
    test: "Sit-ups",
    score: "45 reps",
    benchmark: "40 reps",
    date: "2025-01-10",
    status: "Verified",
    video: true,
    notes: ""
  },
  {
    id: 3,
    test: "Squats",
    score: "9.8s",
    benchmark: "10.2s",
    date: "2025-01-05",
    status: "Verified",
    video: true,
    notes: "Excellent form"
  }
];

export default function AthleteProfile() {
  const { id } = useParams();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return <Badge className="bg-success text-success-foreground">Verified</Badge>;
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
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
      <div className="grid gap-4 md:grid-cols-4">
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

      <Tabs defaultValue="tests" className="space-y-4">
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
                      <Play className="h-12 w-12 text-muted-foreground" />
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
                  <div className="flex justify-between items-center">
                    <span>Vertical Jump</span>
                    <span className="font-mono">68cm (+5%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sit-ups</span>
                    <span className="font-mono">45 reps (+12%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shuttle Run</span>
                    <span className="font-mono">9.8s (-3%)</span>
                  </div>
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