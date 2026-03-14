import { type SubmitEvent, useEffect, useState } from "react";
import { socket } from "@/socket";
import { useRoomStore } from "@/store/room-store";
import type { Room } from "@card-game/shared-contracts";

function App() {
    const { room, error, setRoom, setError } = useRoomStore();

    const [playerName, setPlayerName] = useState("");
    const [roomIdInput, setRoomIdInput] = useState("");

    useEffect(() => {
        const onRoomState = (nextRoom: Room) => {
            setRoom(nextRoom);
        };

        const onRoomError = (message: string) => {
            setError(message);
        };

        socket.on("room:state", onRoomState);
        socket.on("room:error", onRoomError);

        return () => {
            socket.off("room:state", onRoomState);
            socket.off("room:error", onRoomError);
        };
    }, [setRoom, setError]);

    const handleCreateRoom = (e: SubmitEvent) => {
        e.preventDefault();
        setError(null);

        socket.emit("room:create", {
            playerName: playerName.trim(),
            maxPlayers: 4,
        });
    };

    const handleJoinRoom = (e: SubmitEvent) => {
        e.preventDefault();
        setError(null);

        socket.emit("room:join", {
            roomId: roomIdInput.trim().toUpperCase(),
            playerName: playerName.trim(),
        });
    };

    const handleStart = () => {
        if (!room) return;

        socket.emit("room:start", {
            roomId: room.id,
        });
    };

    const isHost = room?.players.some((player) => player.id === socket.id && player.isHost);

    return (
        <div className="min-h-screen bg-zinc-100 p-6 text-zinc-900">
            <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">
                <h1 className="mb-6 text-3xl font-bold">Card Game Lobby</h1>

                {!room ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        <form
                            onSubmit={handleCreateRoom}
                            className="rounded-2xl border border-zinc-200 p-4"
                        >
                            <h2 className="mb-4 text-xl font-semibold">Create room</h2>

                            <label className="mb-2 block text-sm font-medium">Your name</label>
                            <input
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                className="mb-4 w-full rounded-xl border border-zinc-300 px-3 py-2 outline-none"
                                placeholder="Ilya"
                            />

                            <button
                                type="submit"
                                className="rounded-xl bg-black px-4 py-2 text-white"
                            >
                                Create
                            </button>
                        </form>

                        <form
                            onSubmit={handleJoinRoom}
                            className="rounded-2xl border border-zinc-200 p-4"
                        >
                            <h2 className="mb-4 text-xl font-semibold">Join room</h2>

                            <label className="mb-2 block text-sm font-medium">Your name</label>
                            <input
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                className="mb-4 w-full rounded-xl border border-zinc-300 px-3 py-2 outline-none"
                                placeholder="Ilya"
                            />

                            <label className="mb-2 block text-sm font-medium">Room ID</label>
                            <input
                                value={roomIdInput}
                                onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                                className="mb-4 w-full rounded-xl border border-zinc-300 px-3 py-2 uppercase outline-none"
                                placeholder="ABC123"
                            />

                            <button
                                type="submit"
                                className="rounded-xl bg-black px-4 py-2 text-white"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-zinc-200 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Room</h2>
                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium">
                                    {room.id}
                                </span>
                            </div>

                            <p className="mb-4">
                                Status: <span className="font-semibold">{room.status}</span>
                            </p>

                            <h3 className="mb-2 font-semibold">Players</h3>
                            <ul className="space-y-2">
                                {room.players.map((player) => (
                                    <li
                                        key={player.id}
                                        className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2"
                                    >
                                        <span>{player.name}</span>
                                        <span className="text-sm text-zinc-500">
                                            {player.isHost ? "Host" : "Guest"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {room.status === "waiting" && (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleStart}
                                    disabled={!isHost || room.players.length < 2}
                                    className="rounded-xl bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Start game
                                </button>
                            </div>
                        )}

                        {room.status === "playing" && (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                Game started. Следующий шаг — добавлять `game state`.
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
