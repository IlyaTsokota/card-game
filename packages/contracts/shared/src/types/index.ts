export type PlayerId = string;
export type CardId = string;
export type RoomId = string;

export type Card = {
    id: CardId;
    type: string;
};

export type PlayerState = {
    id: PlayerId;
    name: string;
    hand: Card[];
    score: number;
};

export type State = {
    roomId: RoomId;
    players: PlayerState[];
    deck: Card[];
    discardPile: Card[];
    currentPlayerId: PlayerId;
    turn: number;
    phase: "waiting" | "playing" | "round-end" | "finished";
};
