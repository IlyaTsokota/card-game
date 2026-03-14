import { Injectable } from "@nestjs/common";
import type { Player, Room, RoomId } from "@card-game/shared-contracts";

@Injectable()
export class RoomsService {
    private rooms: Map<string, Room> = new Map();

    public createRoom(host: Player, maxPlayers: Room["maxPlayers"]): Room {
        const roomId = this.generateRoomId();

        const newRoom: Room = {
            id: roomId,
            players: [host],
            status: "waiting",
            maxPlayers,
        };

        this.rooms.set(roomId, newRoom);

        return newRoom;
    }

    public getRoom(roomId: RoomId): Room {
        const room = this.rooms.get(roomId);

        if (!room) throw new Error("Room not found");

        return room;
    }

    public joinRoom(roomId: RoomId, player: Player) {
        const room = this.getRoom(roomId);

        if (room.status !== "waiting") {
            throw new Error("Game already started");
        }

        if (room.players.length >= room.maxPlayers) {
            throw new Error("Room is full");
        }

        const alreadyInRoom = room.players.some((p) => p.id === player.id);
        if (alreadyInRoom) return room;

        room.players.push(player);
        return room;
    }

    public deleteRoom(roomId: RoomId, isHost: boolean) {
        return isHost && this.rooms.delete(roomId);
    }

    public startRoom(roomId: string, requesterSocketId: string): Room | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        const host = room.players.find((p) => p.isHost);
        if (!host || host.id !== requesterSocketId) {
            throw new Error("Only host can start the game");
        }

        if (room.players.length < 2) {
            throw new Error("Need 2 players to start");
        }

        room.status = "playing";
        return room;
    }

    public removePlayer(socketId: string): Room | null {
        for (const [roomId, room] of this.rooms.entries()) {
            const hadPlayer = room.players.some((p) => p.id === socketId);
            if (!hadPlayer) continue;

            room.players = room.players.filter((p) => p.id !== socketId);

            if (room.players.length === 0) {
                this.rooms.delete(roomId);
                return null;
            }

            const hasHost = room.players.some((p) => p.isHost);
            if (!hasHost && room.players[0]) {
                room.players[0].isHost = true;
            }

            return room;
        }

        return null;
    }

    private generateRoomId(): string {
        const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let id = "";

        for (let i = 0; i < 6; i++) {
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        if (this.rooms.has(id)) {
            return this.generateRoomId();
        }

        return id;
    }
}
