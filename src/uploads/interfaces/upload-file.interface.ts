import { FileType } from '../enums/file-types.enum';
import { FileResource } from '../enums/file-resources.enum';
export interface UploadFile {
  name: string;
  path: string;
  type: FileType;
  mime: string;
  size: number;
  resource: FileResource;
}
