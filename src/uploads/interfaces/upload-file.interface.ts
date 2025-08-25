import { FileType } from '../enums/file-types.enum';
export interface UploadFile {
  name: string;
  path: string;
  type: FileType;
  mime: string;
  size: number;
}
