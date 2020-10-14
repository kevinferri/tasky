export interface IViewer {
  _id: string;
  email: string;
  name: string;
  picture: string;
}

export interface IFile {
  _id: string;
  createdAt: string;
  fileName: string;
  fileSize: number;
  format: string;
  resourceType: 'image' | 'video' | 'pdf';
  secureUrl: string;
}

export interface ITodo {
  _id: string;
  name: string;
  status: 'active' | 'done';
}
