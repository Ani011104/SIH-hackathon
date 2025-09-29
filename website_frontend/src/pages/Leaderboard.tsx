import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Star, TrendingUp, Filter, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Leaderboard() {
  const topPerformers = [
    { rank: 1, name: "Dhushyanth", age: 22, region: "North", score: 98.5, tests: 8, avatar: "/avatars/01.png" },
    { rank: 2, name: "Anirudh", age: 19, region: "West", score: 97.8, tests: 8, avatar: "/avatars/02.png" },
    { rank: 3, name: "Amrutha", age: 24, region: "East", score: 96.9, tests: 7, avatar: "/avatars/03.png" },
    { rank: 4, name: "Sumadhwa", age: 20, region: "South", score: 96.2, tests: 8, avatar: "/avatars/04.png" },
  ];

  const testLeaderboards = {
    "vertical-jump": [
      { rank: 1, name: "Dhushyanth", score: 99.2, measurement: "28.5 inches" },
      { rank: 2, name: "Disha", score: 98.8, measurement: "28.2 inches" },
      { rank: 3, name: "Sumadhwa", score: 98.1, measurement: "27.9 inches" },
    ],
    "push-ups": [
      { rank: 1, name: "Dhushyanth", score: 99.5, measurement: "9.2 seconds" },
      { rank: 2, name: "Anirudh", score: 98.9, measurement: "9.4 seconds" },
      { rank: 3, name: "Amrutha", score: 98.3, measurement: "9.6 seconds" },
    ],
    "sit-ups": [
      { rank: 1, name: "Sumadhwa", score: 97.8, measurement: "62 reps" },
      { rank: 2, name: "Disha", score: 97.2, measurement: "61 reps" },
      { rank: 3, name: "Amrutha", score: 96.8, measurement: "60 reps" },
    ]
  };

  const regionalRankings = [
    { region: "North Region", athletes: 10, avgScore: 81.2, topAthlete: "Dhusyanth", improvement: "+2.3%" },
    { region: "West Region", athletes: 7, avgScore: 80.8, topAthlete: "Aniruddh", improvement: "+1.8%" },
    { region: "East Region", athletes: 5, avgScore: 78.9, topAthlete: "Amrutha", improvement: "+3.1%" },
    { region: "South Region", athletes: 8, avgScore: 78.1, topAthlete: "Sumadhwa", improvement: "+1.2%" },
    
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leaderboards</h1>
          <p className="text-muted-foreground">Top performers and rankings across all assessments</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all-time">
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Score</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5</div>
            <p className="text-xs text-muted-foreground">Dhushyanth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Athletes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.4</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2.1%</span> improvement
            </p>
          </CardContent>
        </Card>

        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Overall Top Performers</CardTitle>
              <CardDescription>Highest average scores across all assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer) => (
                  <div key={performer.rank} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 text-center">
                        {getRankIcon(performer.rank)}
                      </div>
                      <Avatar>
                        <AvatarImage src={performer.avatar} />
                        <AvatarFallback>{performer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{performer.name}</span>
                        <Badge variant="secondary">{performer.region}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Age {performer.age} • {performer.tests} tests completed
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold">{performer.score}</div>
                      <div className="text-sm text-muted-foreground">Average Score</div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  View Full Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test-Specific Leaderboards</CardTitle>
          <CardDescription>Top performers for individual fitness assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vertical-jump" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vertical-jump">Vertical Jump</TabsTrigger>
              <TabsTrigger value="push-ups">push-ups</TabsTrigger>
              <TabsTrigger value="sit-ups">Sit-ups</TabsTrigger>
            </TabsList>
            
            {Object.entries(testLeaderboards).map(([testKey, leaders]) => (
              <TabsContent key={testKey} value={testKey} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {leaders.map((leader) => (
                    <Card key={leader.rank} className="text-center">
                      <CardContent className="pt-6">
                        <div className="mb-4">
                          {getRankIcon(leader.rank)}
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">{leader.name}</div>
                          <div className="text-2xl font-bold">{leader.score}</div>
                          <div className="text-sm text-muted-foreground">{leader.measurement}</div>
                          <Badge variant={leader.rank === 1 ? "default" : "secondary"}>
                            Rank #{leader.rank}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}