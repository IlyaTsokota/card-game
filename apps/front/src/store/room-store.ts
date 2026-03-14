import { create } from "zustand";
import type { Room } from "@card-game/shared-contracts";

type RoomStore = {
    room: Room | null;
    error: string | null;
    setRoom: (room: Room | null) => void;
    setError: (error: string | null) => void;
    reset: () => void;
};

export const useRoomStore = create<RoomStore>((set) => ({
    room: null,
    error: null,
    setRoom: (room) => set({ room, error: null }),
    setError: (error) => set({ error }),
    reset: () => set({ room: null, error: null }),
}));
