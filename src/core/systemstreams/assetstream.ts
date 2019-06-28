import { SystemStream } from "../messagesystem/src//isystemstream";
import { MessageType } from "../messagesystem/src/messagetype";

/**
 * Engine stream class to handle engine messages.
 */
export class AssetStream extends SystemStream {
    /**
     * Default message type for the stream.
     */
    public type: MessageType = MessageType.Asset;
}