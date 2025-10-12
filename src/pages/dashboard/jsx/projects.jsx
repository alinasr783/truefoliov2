"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderKanban,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "./Sidebar";
import "../css/projects.css";

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  onHold: {
    label: "On Hold",
    color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    icon: <Clock className="h-3 w-3" />,
  },
  planning: {
    label: "Planning",
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    icon: <AlertCircle className="h-3 w-3" />,
  },
};

const ProjectCard = ({ project, index }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const statusInfo = statusConfig[project.status];

  return (
    <motion.div variants={itemVariants}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("gap-1", statusInfo.color)}>
              {statusInfo.icon}
              {statusInfo.label}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                project.priority === "high"
                  ? "border-red-500/20 text-red-700 dark:text-red-400"
                  : project.priority === "medium"
                  ? "border-orange-500/20 text-orange-700 dark:text-orange-400"
                  : "border-gray-500/20 text-gray-700 dark:text-gray-400"
              )}
            >
              {project.priority}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{project.dueDate}</span>
            </div>
            <div className="text-muted-foreground">
              {project.tasksCompleted}/{project.totalTasks} tasks
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex -space-x-2">
              {project.team.slice(0, 3).map((member, idx) => (
                <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>{member.fallback}</AvatarFallback>
                </Avatar>
              ))}
              {project.team.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                  +{project.team.length - 3}
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ProjectsManagementPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const projects = [
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern UI/UX",
      status: "active",
      progress: 65,
      dueDate: "Dec 30, 2024",
      team: [
        { name: "Alice", avatarUrl: "https://i.pravatar.cc/150?u=alice", fallback: "AL" },
        { name: "Bob", avatarUrl: "https://i.pravatar.cc/150?u=bob", fallback: "BO" },
        { name: "Carol", avatarUrl: "https://i.pravatar.cc/150?u=carol", fallback: "CA" },
      ],
      tasksCompleted: 13,
      totalTasks: 20,
      priority: "high",
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "Native iOS and Android app for customer engagement",
      status: "active",
      progress: 45,
      dueDate: "Jan 15, 2025",
      team: [
        { name: "David", avatarUrl: "https://i.pravatar.cc/150?u=david", fallback: "DA" },
        { name: "Eve", avatarUrl: "https://i.pravatar.cc/150?u=eve", fallback: "EV" },
      ],
      tasksCompleted: 9,
      totalTasks: 20,
      priority: "high",
    },
    {
      id: "3",
      name: "Marketing Campaign",
      description: "Q1 2025 digital marketing and social media strategy",
      status: "planning",
      progress: 20,
      dueDate: "Feb 1, 2025",
      team: [
        { name: "Frank", avatarUrl: "https://i.pravatar.cc/150?u=frank", fallback: "FR" },
        { name: "Grace", avatarUrl: "https://i.pravatar.cc/150?u=grace", fallback: "GR" },
        { name: "Henry", avatarUrl: "https://i.pravatar.cc/150?u=henry", fallback: "HE" },
        { name: "Ivy", avatarUrl: "https://i.pravatar.cc/150?u=ivy", fallback: "IV" },
      ],
      tasksCompleted: 3,
      totalTasks: 15,
      priority: "medium",
    },
    {
      id: "4",
      name: "API Integration",
      description: "Third-party API integration for payment processing",
      status: "completed",
      progress: 100,
      dueDate: "Nov 20, 2024",
      team: [
        { name: "Jack", avatarUrl: "https://i.pravatar.cc/150?u=jack", fallback: "JA" },
        { name: "Kate", avatarUrl: "https://i.pravatar.cc/150?u=kate", fallback: "KA" },
      ],
      tasksCompleted: 12,
      totalTasks: 12,
      priority: "low",
    },
    {
      id: "5",
      name: "Database Migration",
      description: "Migrate legacy database to cloud infrastructure",
      status: "onHold",
      progress: 30,
      dueDate: "TBD",
      team: [
        { name: "Leo", avatarUrl: "https://i.pravatar.cc/150?u=leo", fallback: "LE" },
      ],
      tasksCompleted: 4,
      totalTasks: 14,
      priority: "medium",
    },
    {
      id: "6",
      name: "Customer Portal",
      description: "Self-service portal for customer account management",
      status: "active",
      progress: 55,
      dueDate: "Jan 10, 2025",
      team: [
        { name: "Mia", avatarUrl: "https://i.pravatar.cc/150?u=mia", fallback: "MI" },
        { name: "Noah", avatarUrl: "https://i.pravatar.cc/150?u=noah", fallback: "NO" },
        { name: "Olivia", avatarUrl: "https://i.pravatar.cc/150?u=olivia", fallback: "OL" },
      ],
      tasksCompleted: 11,
      totalTasks: 20,
      priority: "high",
    },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: <FolderKanban className="h-5 w-5" />,
      color: "text-blue-500",
    },
    {
      label: "Active",
      value: projects.filter((p) => p.status === "active").length,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-green-500",
    },
    {
      label: "Completed",
      value: projects.filter((p) => p.status === "completed").length,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-blue-500",
    },
    {
      label: "On Hold",
      value: projects.filter((p) => p.status === "onHold").length,
      icon: <Clock className="h-5 w-5" />,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className='Projects-page'>
      <Sidebar />
      <div className='Projects-content'>

    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track all your projects
              </p>
            </div>
            {/* <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button> */}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-lg bg-muted", stat.color)}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Projects
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("onHold")}>
                  On Hold
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("planning")}>
                  Planning
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v)}>
              <TabsList>
                <TabsTrigger value="grid" className="gap-2">
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "grid gap-4",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No projects found</p>
          </motion.div>
        )}
      </div>
    </div>
      </div>
    </div>
  );
};

export default ProjectsManagementPage;