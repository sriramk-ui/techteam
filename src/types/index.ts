export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  instagram?: string;
  gmail?: string;
}

export interface UserType {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  profilePic?: string;
  socialLinks?: ISocialLinks;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectType {
  _id: string;
  title: string;
  description: string;
  status: 'Planning' | 'Active' | 'Completed';
  visibility: 'public' | 'private';
  progress: number;
  githubUrl?: string;
  demoUrl?: string;
  projectUrl?: string;
  assignedMembers?: (string | UserType)[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventType {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  visibility: 'public' | 'private';
  assignedMembers?: (string | UserType)[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VaultCredential {
  process: string;
  email: string;
  password?: string;
}

export interface VaultType {
  _id: string;
  projectId: string;
  credentials: VaultCredential[];
  updatedAt?: string;
}
