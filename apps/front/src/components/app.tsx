import { useEffect } from "react";
import { socket } from "../socket";
import { useGameStore, type GameState } from "../store/game-store";

function App() {
    const { state, setState } = useGameStore();

    useEffect(() => {
        const handleGameState = (nextState: GameState) => {
            setState(nextState);
        };

        socket.on("connect", () => {
            console.log("connected:", socket.id);
        });

        socket.on("game:state", handleGameState);

        return () => {
            socket.off("game:state", handleGameState);
        };
    }, [setState]);

    const increment = () => {
        socket.emit("game:increment");
    };

    const reset = () => {
        socket.emit("game:reset");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
                <h1 className="text-2xl font-bold mb-4">Socket.IO demo</h1>

                <div className="space-y-2 mb-6">
                    <p className="text-lg">
                        Counter: <span className="font-semibold">{state.counter}</span>
                    </p>
                    <p>
                        Players online:{" "}
                        <span className="font-semibold">{state.players.length}</span>
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={increment}
                        className="rounded-xl bg-black px-4 py-2 text-white"
                    >
                        Increment
                    </button>

                    <button onClick={reset} className="rounded-xl border border-black px-4 py-2">
                        Reset
                    </button>
                </div>

                <div className="mt-6">
                    <p className="font-medium mb-2">Connected sockets:</p>
                    <ul className="space-y-1 text-sm text-zinc-600">
                        {state.players.map((playerId) => (
                            <li key={playerId}>{playerId}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;
