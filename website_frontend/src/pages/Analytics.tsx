import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Star, TrendingUp, Filter, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Highcharts imports
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as HighchartsMapModule from "highcharts/modules/map";
import mapDataIndia from "@highcharts/map-collection/countries/in/in-all.geo.json";

// --- Safe map initialization ---
if (!Highcharts?.mapChart) {
  (HighchartsMapModule as any)(Highcharts);
}

export default function Analytics() {
  // --- Sample Top Performers Data ---
  const topPerformers = [
    { rank: 1, name: "Dhushyanth", age: 22, region: "North", score: 98.5, tests: 8, avatar: "/avatars/01.png" },
    { rank: 2, name: "Anirudh", age: 19, region: "West", score: 97.8, tests: 8, avatar: "/avatars/02.png" },
    { rank: 3, name: "Amrutha", age: 24, region: "East", score: 96.9, tests: 7, avatar: "/avatars/03.png" },
    { rank: 4, name: "Sumadhwa", age: 20, region: "South", score: 96.2, tests: 8, avatar: "/avatars/04.png" },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Top Summary Cards --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Overview of athlete performance and hotspots</p>
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

      {/* --- Top Performers List --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Highest average scores across assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer) => (
                  <div key={performer.rank} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 text-center">{getRankIcon(performer.rank)}</div>
                      <Avatar>
                        <AvatarImage src={performer.avatar} />
                        <AvatarFallback>{performer.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
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
                <Button variant="outline" className="w-full">View Full Leaderboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Athlete Hotspot Map Card --- */}
        <Card>
          <CardHeader>
            <CardTitle>Athlete Hotspot Map</CardTitle>
            <CardDescription>
              Regions highlighted based on number of athletes who have given assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <HighchartsReact
                highcharts={Highcharts}
                constructorType="mapChart"
                options={{
                  chart: { map: mapDataIndia },
                  title: { text: "Athlete Distribution in India" },
                  mapNavigation: { enabled: true, buttonOptions: { verticalAlign: "bottom" } },
                  colorAxis: {
                    min: 0,
                    stops: [
                      [0, "#E0F7FA"],   // light
                      [0.5, "#0288D1"], // medium
                      [1, "#01579B"]    // dark
                    ]
                  },
                  tooltip: {
                    pointFormat: "{point.name}: <b>{point.value}</b> athletes"
                  },
                  series: [
                    {
                      type: "map",
                      name: "Athletes",
                      mapData: mapDataIndia,
                      data: [
                        ["in-up", 2], ["in-mh", 5], ["in-tn", 1],
                        ["in-ka", 10], ["in-dl", 5], ["in-wb", 1],
                        ["in-pb", 10], ["in-hr", 5], ["in-kl", 3], ["in-rj", 2]
                      ],
                      joinBy: ["hc-key", "code"],
                      keys: ["code", "value"],
                      states: { hover: { color: "#da7b55ff" } },
                      dataLabels: { enabled: true, format: "{point.name}" }
                    }
                  ]
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
