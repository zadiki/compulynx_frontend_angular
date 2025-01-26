export interface Student {
  studentId?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  studentClass: string;
  score: number;
  status: string;
  photoPath: string;
}

export interface StudentLog {
  id: number;
  student: Student;
  actionType: string;
  newValue: string;
  actionStatus: string;
  oldValue: string;
  comment?: string;
  approvedByUser?: { id: number; userName: string; roles: string };
  createdByUser?: {
    id: number;
    userName: string;
    roles: string;
  };
  creationDate: string;
  updateDate?: string;
}
