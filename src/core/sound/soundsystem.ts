import { log, LogLevel } from "../loggingsystem/src";
import { Message } from "../messagesystem";
import { System } from "../system";
import { SoundStream } from "../systemstreams";

/**
 * Sound System for the Divine Engine.
 * This engine uses HowlerJS for it's sound
 */
export class SoundSystem extends System {
    public soundStream: SoundStream = new SoundStream();
    protected messageQueue: Array<Message> = new Array<Message>();
    constructor() {
        super("soundsystem");
    }
    public start() {
        this.soundStream.on("data", (data) => {
            this.messageQueue.push(data as Message);
        });
    }
    public update(delta: number): void {
        this.messageQueue.forEach((element) => {
            this.parseMessage(element);
        });
        this.messageQueue = new Array<Message>();
    }
    public parseMessage(message: Message): void {
        log(LogLevel.debug, message.toString());
    }
}