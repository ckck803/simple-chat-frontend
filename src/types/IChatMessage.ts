import {IFileInfo} from "~types/IFileInfo.ts";

export interface IChatMessage {
  roomId: string,
  userId: string,
  message: string,
  sendDate: string,
  sendTime: string,
  sender: string,
  // urlList?: []
  fileList?: IFileInfo[]
}

