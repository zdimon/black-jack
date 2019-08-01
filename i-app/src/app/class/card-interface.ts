export interface Icard {
  XBgPosition: number;
  YBgPosition: number;
  Ranck: number;
  Face: number;
  Width: number;
  Height: number;
  faceDown(): void;
  faceUp(): void;
}
