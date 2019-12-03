export interface IRoom {
  roomNm: string;
}

export class RoomsRepository {
  private static rooms: IRoom[] = [];

  public static get getRooms(): IRoom[] {
    return this.rooms;
  }

  public static addRoom(roomNm: string): IRoom[] {
    this.rooms = this.rooms.concat({ roomNm });
    return this.rooms;
  }
}
