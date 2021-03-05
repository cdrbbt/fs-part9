interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartwDescription extends CoursePartBase {
  description: string;
}

export interface CourseNormalPart extends CoursePartwDescription {
  type: "normal";
}


export interface CourseSubmissionPart extends CoursePartwDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

export interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

export interface CourseSpecialPart extends CoursePartwDescription {
  requirements: string[];
  type: "special";
}

export type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart;