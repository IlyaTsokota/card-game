import {
    ConnectedSocket,
    // MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { type Server, type Socket } from "socket.io";

type GameState = {
    counter: number;
    players: string[];
};

@WebSocketGateway({
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private state: GameState = {
        counter: 0,
        players: [],
    };

    handleConnection(socket: Socket) {
        console.log("connected:", socket.id);

        this.state.players.push(socket.id);

        socket.emit("game:state", this.state);
        this.server.emit("game:state", this.state);
    }

    handleDisconnect(socket: Socket) {
        console.log("disconnected:", socket.id);

        this.state.players = this.state.players.filter((id) => id !== socket.id);

        this.server.emit("game:state", this.state);
    }

    @SubscribeMessage("game:increment")
    handleIncrement(@ConnectedSocket() socket: Socket) {
        console.log("increment from:", socket.id);

        this.state.counter += 1;

        this.server.emit("game:state", this.state);
    }

    @SubscribeMessage("game:reset")
    handleReset() {
        this.state.counter = 0;
        this.server.emit("game:state", this.state);
    }
}
