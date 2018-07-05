import { EventEmitter } from "events";
import { RenderComponent } from "src/components/rendercomponent";
import { ErrorCode } from "./logging";

/**
 * Message system
 */
export class MessageSystem extends EventEmitter {
    /**
     * Message system constructor.
     */
    constructor() {
        super();
    }
    /**
     * Send a new message to the system. There needs to be either an EventType 
     * or a string. Recommended to make an enumerator list to define your
     * own classes. The message needs to extends from the base Message class.
     * @param type 
     * @param message 
     */
    public sendMessage(type: EventType | string, message: Message): void {
        this.emit(type, message);
    }
    /**
     * Returns the count of all listeners in the system.
     * @returns number
     */
    public allListenersCount(): number {
        var count: number = 0;
        var events = this.eventNames();
        events.forEach((element) => {
            count += this.listenerCount(element);
        });
        return count;
    }
}

/**
 * Base engine message types. These are all message types that are handled by 
 * the system natively.
 */
export enum EventType {
    Entity = "entity", 
    ErrorSystem = "errorsystem",
    IOSystem = "iosystem",
    PhysicsSystem = "physicssystem",
    RenderSystem = "rendersystem",
    SoundSystem = "soundsystem",
    KeyInput = "keyinput",
    MouseInput = "mouseinput",
    TouchInput = "touchinput"
}

/**
 *              ------------
 *              CORE CLASSES
 *              ------------
 *  Notes:
 *  ------
 *  
 *  These are all the core Messages that the system will handle. The 
 *  messages here correspond with the enumerator class `EventType` defined in 
 *  `messagesystem.ts`. For your own messages and message types, please save an
 *  enumerated list in your own message types file and extend these classes 
 *  there as well. 
 *  
 *  Instructions:
 *  -------------
 *  All messages must implement thier own constructor or else they will not 
 *  parse correctly.
 */
/**
 * Message object.
 * The data is saved as a JSON object in string format. It will be parsed based
 * on it's message type. Listeners have a specific format based on interface.
 */
export class Message {
    private _data: string;     
    /**
     * List of any objects that will be JSON stringified. They will be stored 
     * as a string to be parsed out for reading by each system.
     * 
     * NOTE: There may be some networking capabilities because of this later.
     * Something with streams.
     * @param  {any[]} ...data
     */
    constructor(...data: any[]) {
        this._data = JSON.stringify(data);
    }
    
    /**
     * Returns the data as a JSON string object.
     * @returns string
     */
    public get JSONString(): string {
        return this._data;
    }
    /**
     * Returns the JSON object.
     * @returns JSON
     */
    public get JSON(): JSON {
        return JSON.parse(this._data);
    }

    /**
     * Returns the object.
     */
    public getObject(): object {
        let object: object = this.JSON;
        return object;
    }
}

/**
 * Base message data interface(class).
 * All messages must extend from this class.
 *  
 *  data: is a JSON string object.
 */

/**
 * EntityMessages interface. 
 * All entity messages must extend this interface.
 */
export class EntityMessage extends Message {
    constructor(entityID: string | number, ...extra: any[]) {
        super(entityID, extra);
    }
}

/**
 * Error system message interface. 
 * All error messages must extend this interface.
 */
export class ErrorSystemMessage extends Message {
    constructor(errorCode: ErrorCode, data: string | undefined, 
        ...extra: any[]) {
        super(errorCode, data, extra);
    }
}

/**
 * IO system message interface. 
 * All io messages must extend this class.
 */
export class IOSystemMessage extends Message {
    constructor(entityID: string | number, ...extra: any[]) {
        super(entityID, extra);
    }
}

/**
 * Physics system message interface. 
 * All physics messages must extend this interface.
 */
export class PhysicsSystemMessage extends Message {
    constructor(entityID: string | number, ...extra: any[]) {
        super(entityID, extra);
    }
}

/**
 * Render system message  interface. 
 * All render messages must extend this interface.
 */
export class RenderSystemMessage extends Message {
    constructor(entityID: string | number, renderableComponent: RenderComponent,
        ...extra: any[]) {
        super(entityID, renderableComponent, extra);
    }
}

/**
 * Sound system message interface. 
 * All sound messages must extend this interface.
 */
export class SoundSystemMessage extends Message {
    constructor(...extra: any[]) {
        super(extra);
    }
}
/**             ----------------
 *              END CORE CLASSES
 *              ----------------
 */
/**
 * Key input message interface.
 */
export class KeyInputMessage extends IOSystemMessage {
    constructor(entityID: string | number, code: string) {
        super(entityID, code);
    }
}
/**
 * Mouse input message interface.
 */
export class MouseInputMessage extends IOSystemMessage {
    constructor(entityID: string | number, x: number, y: number) {
        super(entityID, x, y);
    }
}
/**
 * Touch input message interface.
 */
export class TouchInputMessage extends IOSystemMessage {
    constructor(public entityID: string | number, public x: number, 
        public y: number) {
        super(entityID, x, y);
    }
}