import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const athletes = [
  {
    id: 1,
    name: "Amrutha",
    age: 19,
    gender: "Female",
    location: "Bangalore",
    status: "Verified",
    lastTest: "Sit-ups",
    score: "32reps",
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Anirudh",
    age: 20,
    gender: "Male",
    location: "Mumbai",
    status: "Flagged",
    lastTest: "Vertical Jump",
    score: "45cm",
    date: "2024-01-14"
  },
  {
    id: 3,
    name: "Dhushyanth",
    age: 21,
    gender: "Male",
    location: "Hyderabad",
    status: "Pending",
    lastTest: "Sit-ups",
    score: "45 reps",
    date: "2024-01-13"
  },
  {
    id: 4,
    name: "Sumadhwa",
    age: 20,
    gender: "Male",
    location: "Chennai",
    status: "Verified",
    lastTest: "Push-ups",
    score: "50 reps",
    date: "2024-01-12"
  },
  {
    id: 5,
    name: "Disha",
    age:16 ,
    gender: "Female",
    location: "Delhi",
    status: "Pending",
    lastTest: "Squats",
    score: "25 reps",
    date: "2024-01-11"
  }
];

export default function Athletes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const navigate = useNavigate();

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         athlete.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || athlete.status.toLowerCase() === statusFilter;
    const matchesGender = genderFilter === "all" || athlete.gender.toLowerCase() === genderFilter;
    
    return matchesSearch && matchesStatus && matchesGender;
  });

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Athlete Management</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search athletes by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Athletes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Athletes ({filteredAthletes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Test</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAthletes.map((athlete) => (
                <TableRow key={athlete.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{athlete.name}</TableCell>
                  <TableCell>{athlete.age}</TableCell>
                  <TableCell>{athlete.gender}</TableCell>
                  <TableCell>{athlete.location}</TableCell>
                  <TableCell>{athlete.lastTest}</TableCell>
                  <TableCell className="font-mono">{athlete.score}</TableCell>
                  <TableCell>{getStatusBadge(athlete.status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/athlete/${athlete.id}`)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}