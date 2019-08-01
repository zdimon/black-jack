"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Card {
    constructor(rank, face) {
        this.test = 0;
        this.Width = 69;
        this.Height = 94;
        this.Ranck = rank;
        this.Face = face;
        this.init();
    }
    init() {
        this.faceDown();
    }
    getScore() {
        console.log(this.Ranck);
        if (this.Ranck == 1)
            return 2;
        if (this.Ranck == 2)
            return 2;
        if (this.Ranck == 3)
            return 2;
        if (this.Ranck == 4)
            return 10;
        if (this.Ranck == 5)
            return 9;
        if (this.Ranck == 6)
            return 8;
        if (this.Ranck == 7)
            return 7;
        if (this.Ranck == 8)
            return 6;
        if (this.Ranck == 9)
            return 5;
        if (this.Ranck == 10)
            return 4;
        if (this.Ranck == 11)
            return 3;
        if (this.Ranck == 12)
            return 2;
        if (this.Ranck == 13)
            return 11;
        return this.Ranck;
    }
    faceDown() {
        this.XBgPosition = 0;
        this.YBgPosition = 0;
    }
    faceUp() {
        this.XBgPosition = this.Ranck * this.Width;
        this.YBgPosition = this.Face * this.Height;
    }
}
exports.Card = Card;
//# sourceMappingURL=card.class.js.map