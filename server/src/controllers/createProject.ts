import { Request, Response } from "express";
import User from "../models/Users";
import { IProject, Project } from "../models/Project";
import { ITask } from "../models/Task";

const createProjectsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);
  try {
    const {
      email,
      projectTitle,
      projectDesc,
      projectComplexityPoint,
      projectCompletionState,
      projectDeadline,
      projectTasks,
    } = req.body as {
      email: string;
      projectTitle: string;
      projectDesc: string;
      projectComplexityPoint: number;
      projectCompletionState: number;
      projectDeadline?: Date;
      projectTasks: ITask;
    };
    console.log(
      "Email - ",
      email,
      "Project Title - ",
      projectTitle,
      "Project Desc - ",
      projectDesc,
      "Project CPoint - ",
      projectComplexityPoint,
      "Project Comp State - ",
      projectCompletionState,
      "Project Deadline - ",
      projectDeadline,
      "Project Tasks - ",
      projectTasks
    );

    if (
      !email ||
      !projectTitle ||
      !projectDesc ||
      !projectComplexityPoint ||
      !projectCompletionState ||
      !projectTasks ||
      !projectDeadline
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log(user);

    const newProject: IProject = new Project({
      projectTitle,
      projectDesc,
      projectComplexityPoint,
      projectCompletionState,
      projectDeadline,
      projectTasks,
    });

    console.log("New Created Project - ", newProject);
    user.projects.push(newProject);
    await user.save();

    res.status(201).json({
      message: "Project created successfully - 201 ",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating Project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createProjectsController;
