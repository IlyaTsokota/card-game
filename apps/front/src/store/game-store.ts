import { create } from "zustand";

export type GameState = {
    counter: number;
    players: string[];
};

type GameStore = {
    state: GameState;
    setState: (nextState: GameState) => void;
};

export const useGameStore = create<GameStore>((set) => ({
    state: {
        counter: 0,
        players: [],
    },
    setState: (nextState) => set({ state: nextState }),
}));
