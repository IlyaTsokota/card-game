import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { RoomsService } from "./rooms.service";
import { type Server, type Socket } from "socket.io";
import type {
    ClientToServerEvents,
    Player,
    RoomCreateMessageBody,
    RoomJoinMessageBody,
    RoomStartMessageBody,
    ServerToClientEvents,
} from "@card-game/shared-contracts";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server!: Server<ClientToServerEvents, ServerToClientEvents>;

    constructor(private readonly roomsService: RoomsService) {}

    public handleConnection(socket: Socket) {
        console.log("connected", socket.id);
    }

    public handleDisconnect(socket: Socket) {
        const updatedRoom = this.roomsService.removePlayer(socket.id);

        if (updatedRoom) {
            this.server.to(updatedRoom.id).emit("room:state", updatedRoom);
        }

        console.log("disconnected", socket.id);
    }

    @SubscribeMessage("room:create")
    public async handleCreateRoom(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { playerName, maxPlayers }: RoomCreateMessageBody,
    ) {
        if (!playerName) {
            socket.emit("room:error", "Player name is required");
            return;
        }

        if (!maxPlayers) {
            socket.emit("room:error", "Max players is required");
            return;
        }

        const host: Player = {
            id: socket.id,
            name: playerName,
            hand: [],
            score: 0,
            isHost: true,
        };

        const room = this.roomsService.createRoom(host, maxPlayers);

        await socket.join(room.id);
        socket.emit("room:state", room);
    }

    @SubscribeMessage("room:join")
    public async handleJoinRoom(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { playerName, roomId }: RoomJoinMessageBody,
    ) {
        if (!roomId || !playerName) {
            socket.emit("room:error", "Room ID and player name are required");
            return;
        }

        const player: Player = {
            id: socket.id,
            name: playerName,
            hand: [],
            score: 0,
            isHost: true,
        };

        try {
            const room = this.roomsService.joinRoom(roomId, player);

            if (!room) {
                socket.emit("room:error", "Room not found");
                return;
            }

            await socket.join(room.id);
            this.server.to(room.id).emit("room:state", room);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to join room";
            socket.emit("room:error", message);
        }
    }

    @SubscribeMessage("room:start")
    handleStartRoom(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { roomId }: RoomStartMessageBody,
    ) {
        if (!roomId) {
            socket.emit("room:error", "Room ID is required");
            return;
        }

        try {
            const room = this.roomsService.startRoom(roomId, socket.id);

            if (!room) {
                socket.emit("room:error", "Room not found");
                return;
            }

            this.server.to(room.id).emit("room:state", room);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to start room";
            socket.emit("room:error", message);
        }
    }
}
