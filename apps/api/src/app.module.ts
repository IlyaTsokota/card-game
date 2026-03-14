import { Module } from "@nestjs/common";
import { RoomsModule } from "./room/rooms.module";

@Module({
    imports: [RoomsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
