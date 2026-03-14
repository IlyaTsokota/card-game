export type PlayerId = string;
export type CardId = string;
export type RoomId = string;

export type Card = {
    id: CardId;
    type: string;
    color: string;
};

export type Player = {
    id: PlayerId;
    name: string;
    hand: Card[];
    score: number;
    isHost: boolean;
};

export type RoomCreateMessageBody = {
    playerName: Player["name"];
    maxPlayers: Room["maxPlayers"];
};

export type RoomJoinMessageBody = {
    playerName: Player["name"];
    roomId: string;
};

export type RoomStartMessageBody = {
    roomId: string;
};

export type GameState = {
    roomId: RoomId;
    players: Player[];
    deck: Card[];
    discardPiles: [Card[], Card[]];
    currentPlayerId: PlayerId;
    turn: number;
    phase: "waiting" | "playing" | "round-end" | "finished";
};

export type RoomStatus = "waiting" | "playing" | "end";

export type Room = {
    id: RoomId;
    players: Player[];
    status: RoomStatus;
    maxPlayers: 2 | 3 | 4;
};

export type ServerToClientEvents = {
    "room:state": (room: Room) => void;
    "room:error": (message: string) => void;
};

export type ClientToServerEvents = {
    "room:create": (payload: { playerName: string }) => void;
    "room:join": (payload: { roomId: string; playerName: string }) => void;
    "room:start": (payload: { roomId: string }) => void;
};
