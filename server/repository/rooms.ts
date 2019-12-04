import uuid from "uuid/v4";
export interface IRoom {
  id: string;
  roomNm: string;
}

export class RoomsRepository {
  private static rooms: IRoom[] = [];

  public static get getRooms(): IRoom[] {
    return this.rooms;
  }

  public static addRoom(roomNm: string): IRoom[] {
    this.rooms = this.rooms.concat({ roomNm, id: uuid() });
    return this.rooms;
  }
}
